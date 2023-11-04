use std::fmt::Display;
use std::vec;

use crate::ast::field;
use crate::context::Syntax;
use crate::descriptor::field_descriptor_proto::Type;
use crate::descriptor::DescriptorProto;
use crate::{context::Context, descriptor::FieldDescriptorProto};
use crate::{member_expr, member_expr_bare};

use convert_case::{Case, Casing};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, ArrayPat, BinaryOp, BlockStmt, ClassMember, ClassMethod, Expr, Function, MethodKind,
    ObjectLit, Param, Pat, PatOrExpr, PropName, Stmt, ThrowStmt,
};
use swc_ecma_utils::{quote_ident, quote_str};

use super::field::FieldAccessorFn;

pub(crate) fn json_key_name_field_member(field: &FieldDescriptorProto) -> Expr {
    crate::member_expr!("json", field.json_key_name())
}

impl FieldDescriptorProto {
    pub(self) fn infinity_and_nan_check(&self, accessor: FieldAccessorFn) -> Expr {
        crate::chain_bin_exprs_or!(
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("NaN").into(),
                BinaryOp::EqEq
            ),
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("Infinity").into(),
                BinaryOp::EqEq
            ),
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("-Infinity").into(),
                BinaryOp::EqEq
            )
        )
    }

    pub(self) fn min_max_check<T>(&self, accessor: FieldAccessorFn, min: T, max: T) -> Expr
    where
        T: Display,
    {
        crate::paren_expr!(crate::chain_bin_exprs_and!(
            crate::bin_expr!(
                accessor(self),
                quote_ident!(format!("{}", min)).into(),
                BinaryOp::GtEq
            ),
            crate::bin_expr!(
                accessor(self),
                quote_ident!(format!("{}", max)).into(),
                BinaryOp::LtEq
            )
        ))
    }

    pub(self) fn valid_value_bin_expr(&self, ctx: &mut Context, accessor: FieldAccessorFn) -> Option<Expr> {
        match self.type_() {
            Type::TYPE_FLOAT => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, f32::MIN, f32::MAX)
            )),
            Type::TYPE_DOUBLE => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, f64::MIN, f64::MAX)
            )),
            Type::TYPE_UINT32 | Type::TYPE_FIXED32 => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, u32::MIN, u32::MAX)
            )),
            Type::TYPE_UINT64 | Type::TYPE_FIXED64 => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, u64::MIN, u64::MAX)
            )),
            Type::TYPE_INT32 | Type::TYPE_SFIXED32 | Type::TYPE_SINT32 => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, i32::MIN, i32::MAX)
            )),
            Type::TYPE_INT64 | Type::TYPE_SFIXED64 | Type::TYPE_SINT64 => Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                self.min_max_check(accessor, i64::MIN, i64::MAX)
            )),
            // Type::TYPE_BOOL => todo!(),
            // Type::TYPE_STRING => todo!(),
            // Type::TYPE_GROUP => todo!(),
            // Type::TYPE_MESSAGE => todo!(),
            // Type::TYPE_BYTES => todo!(),
            // Type::TYPE_ENUM => todo!(),
            _ => None,
        }
    }

    pub(self) fn default_value_bin_expr_for_json(
        &self,
        ctx: &mut Context,
        accessor: FieldAccessorFn,
    ) -> Expr {
        let neq_undefined_check = crate::bin_expr!(
            accessor(self),
            quote_ident!("undefined").into(),
            BinaryOp::NotEqEq
        );

        let presence_check = if self.has_oneof_index() {
            // for oneof field we have to serialize the value unconditionally even if the value is the default.
            neq_undefined_check
        } else if self.is_map(ctx) {
            crate::bin_expr!(
                neq_undefined_check,
                crate::bin_expr!(
                    crate::member_expr_bare!(accessor(self), "size"),
                    Expr::Lit(crate::lit_num!(0)),
                    BinaryOp::NotEqEq
                )
            )
        } else if (self.is_bytes() && ctx.syntax == &Syntax::Proto3) || self.is_repeated() {
            crate::bin_expr!(
                neq_undefined_check,
                crate::bin_expr!(
                    crate::member_expr_bare!(accessor(self), "length"),
                    Expr::Lit(crate::lit_num!(0)),
                    BinaryOp::NotEqEq
                )
            )
        } else {
            neq_undefined_check
        };

        let default_expr = self.proto3_default(ctx);

        if default_expr.is_some() && ctx.syntax == &Syntax::Proto3 && !self.has_oneof_index() {
            crate::bin_expr!(
                presence_check,
                crate::bin_expr!(accessor(self), default_expr.unwrap(), BinaryOp::NotEqEq)
            )
        } else {
            presence_check
        }
    }

    pub(self) fn value_check_stmt(&self, ctx: &mut Context, accessor: FieldAccessorFn) -> Option<Stmt> {
        let valid_value_bin = self.valid_value_bin_expr(ctx, accessor);
        if valid_value_bin.is_none() {
            return None
        }
        Some(crate::if_stmt!(
            crate::bin_expr!(
                crate::paren_expr!(valid_value_bin.unwrap()),
                crate::lit_bool!(false).into(),
                BinaryOp::EqEq
            ),
            Stmt::Throw(ThrowStmt {
                span: DUMMY_SP,
                arg: Box::new(crate::new_expr!(
                    quote_ident!("Error").into(),
                    vec![crate::expr_or_spread!(
                        crate::lit_str!(format!("illegal value for {}", self.json_key_name())).into()
                    )]
                )),
            })
        ))
    }

    pub(self) fn json_key_name(&self) -> String {
        if self.has_json_name() {
            self.json_name().to_string()
        } else {
            self.name().to_case(Case::Camel)
        }
    }

    pub(self) fn needs_mapping(&self) -> bool {
        !((self.is_number() && !self.is_bigint()) || self.is_booelan() || self.is_string())
    }

    pub(self) fn into_to_stringified_map_expr(&self, ctx: &mut Context) -> Expr {
        if self.is_string() {
            return Expr::Ident(quote_ident!(self.name()));
        }
        if self.name() == "key" {
            super::field::to_string_normalizer(&quote_ident!(self.name()).into())
        } else {
            self.into_to_json_expr(ctx, super::field::bare_field_member)
        }
    }

    pub(self) fn into_to_json_expr(
        &self,
        ctx: &mut Context,
        accessor_fn: super::field::FieldAccessorFn,
    ) -> Expr {
        let accessor = accessor_fn(self);
        if self.is_enum() {
            crate::member_expr_computed!(ctx.lazy_type_ref(self.type_name()).into(), accessor)
        } else if self.is_bigint() {
            crate::call_expr!(member_expr_bare!(accessor, "toString"))
        } else if self.is_message() && !self.is_map(ctx) {
            crate::call_expr!(member_expr_bare!(accessor, "toJson"))
        } else {
            accessor
        }
    }

    pub(self) fn into_from_json_expr(
        &self,
        ctx: &mut Context,
        accessor_fn: super::field::FieldAccessorFn,
    ) -> Expr {
        let accessor = accessor_fn(self);
        if self.is_enum() {
            crate::member_expr_computed!(ctx.lazy_type_ref(self.type_name()).into(), accessor)
        } else if self.is_bigint() {
            crate::call_expr!(
                quote_ident!("BigInt").into(),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else if self.is_message() && !self.is_map(ctx) {
            crate::call_expr!(
                member_expr_bare!(ctx.lazy_type_ref(self.type_name()).into(), "fromJson"),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else {
            accessor
        }
    }
}

impl DescriptorProto {
    pub(super) fn print_to_json(&self, ctx: &mut Context) -> ClassMember {
        let mut statements = vec![Stmt::Decl(crate::const_decl!(
            "json",
            Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![]
            })
        ))];

        for field in self.field.clone() {
            let accessor_fn = if field.is_repeated() && !field.is_map(ctx) && field.needs_mapping()
            {
                super::field::static_field_member
            } else {
                super::field::this_field_member
            };

            let mut value_expr = field.into_to_json_expr(ctx, accessor_fn);

            if field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());
                let key_field = &descriptor.field[0];
                let value_field = &descriptor.field[1];
                value_expr = crate::call_expr!(
                    member_expr!("Array", "from"),
                    vec![crate::expr_or_spread!(value_expr)]
                );
                if !(key_field.is_string() && value_field.is_string()) {
                    value_expr = crate::call_expr!(
                        crate::member_expr_bare!(value_expr, "map"),
                        vec![crate::expr_or_spread!(crate::arrow_func_short!(
                            Expr::Array(ArrayLit {
                                span: DUMMY_SP,
                                elems: vec![
                                    Some(crate::expr_or_spread!(
                                        key_field.into_to_stringified_map_expr(ctx)
                                    )),
                                    Some(crate::expr_or_spread!(
                                        value_field.into_to_stringified_map_expr(ctx)
                                    ))
                                ]
                            }),
                            vec![Pat::Array(ArrayPat {
                                optional: false,
                                elems: vec![
                                    Some(crate::pat_ident!(key_field.name())),
                                    Some(crate::pat_ident!(value_field.name()))
                                ],
                                span: DUMMY_SP,
                                type_ann: None
                            })]
                        ))]
                    );
                }
                value_expr = crate::call_expr!(
                    member_expr!("Object", "fromEntries"),
                    vec![crate::expr_or_spread!(value_expr)]
                );
            } else if field.is_repeated() && field.needs_mapping() {
                value_expr = crate::call_expr!(
                    crate::member_expr_bare!(member_expr!("this", field.name()), "map"),
                    vec![crate::expr_or_spread!(crate::arrow_func_short!(
                        value_expr,
                        vec![crate::pat_ident!("r")]
                    ))]
                );
            }

            statements.push(crate::if_stmt!(
                field.default_value_bin_expr(ctx, super::field::this_field_member),
                crate::expr_stmt!(crate::assign_expr!(
                    PatOrExpr::Expr(Box::new(crate::member_expr!("json", field.json_key_name()))),
                    value_expr
                ))
            ))
        }

        statements.push(crate::return_stmt!(quote_ident!("json").into()));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("toJson")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: false,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }

    pub(super) fn print_from_json(&self, ctx: &mut Context) -> ClassMember {
        let mut statements = vec![Stmt::Decl(crate::const_decl!(
            "message",
            crate::new_expr!(Expr::Ident(quote_ident!(ctx.normalize_name(self.name()))))
        ))];

        for field in self.field.clone() {
            let accessor_fn = if field.is_repeated() && !field.is_map(ctx)
            {
                super::field::static_field_member
            } else {
                json_key_name_field_member
            };
            let mut value_expr = field.into_from_json_expr(ctx, accessor_fn);

            // TODO: wkt
            if field.type_name().contains("google.protobuf") {
                continue;
            }

            let validation_stmt = field.value_check_stmt(ctx, accessor_fn);

            if field.is_map(ctx) {
                // let descriptor = ctx
                //     .get_map_type(field.type_name())
                //     .expect(format!("can not find the map type {}", field.type_name()).as_str());
                // let key_field = &descriptor.field[0];
                // let value_field = &descriptor.field[1];
                // value_expr = crate::call_expr!(
                //     member_expr!("Array", "from"),
                //     vec![crate::expr_or_spread!(value_expr)]
                // );
                // if !(key_field.is_string() && value_field.is_string()) {
                //     value_expr = crate::call_expr!(
                //         crate::member_expr_bare!(value_expr, "map"),
                //         vec![crate::expr_or_spread!(crate::arrow_func_short!(
                //             Expr::Array(ArrayLit {
                //                 span: DUMMY_SP,
                //                 elems: vec![
                //                     Some(crate::expr_or_spread!(
                //                         key_field.into_to_stringified_map_expr(ctx)
                //                     )),
                //                     Some(crate::expr_or_spread!(
                //                         value_field.into_to_stringified_map_expr(ctx)
                //                     ))
                //                 ]
                //             }),
                //             vec![Pat::Array(ArrayPat {
                //                 optional: false,
                //                 elems: vec![
                //                     Some(crate::pat_ident!(key_field.name())),
                //                     Some(crate::pat_ident!(value_field.name()))
                //                 ],
                //                 span: DUMMY_SP,
                //                 type_ann: None
                //             })]
                //         ))]
                //     );
                // }
                // value_expr = crate::call_expr!(
                //     member_expr!("Object", "fromEntries"),
                //     vec![crate::expr_or_spread!(value_expr)]
                // );
            } else if field.is_repeated() {
                let mut stmts = vec![];
                if validation_stmt.is_some() {
                    stmts.push(validation_stmt.clone().unwrap())
                }
                stmts.push(crate::return_stmt!(value_expr));
                value_expr = crate::call_expr!(
                    crate::member_expr_bare!(json_key_name_field_member(&field), "map"),
                    vec![crate::expr_or_spread!(crate::arrow_func!(
                        vec![crate::pat_ident!("r")],
                        stmts
                    ))]
                );
            }
            let mut substmts = vec![];
            if !field.is_repeated() && validation_stmt.is_some() {
                substmts.push(validation_stmt.unwrap())
            }
            substmts.push(crate::expr_stmt!(crate::assign_expr!(
                PatOrExpr::Expr(Box::new(crate::member_expr!("message", field.name()))),
                value_expr
            )));
            statements.push(crate::if_stmt!(
                field.default_value_bin_expr_for_json(ctx, json_key_name_field_member),
                crate::block_stmt!(substmts)
            ))
        }

        statements.push(crate::return_stmt!(quote_ident!("message").into()));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("fromJson")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: true,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                        id: quote_ident!("json"),
                        type_ann: Some(crate::type_annotation!("unknown")),
                    }),
                }],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}
