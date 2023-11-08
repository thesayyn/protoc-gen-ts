use std::fmt::{Display, LowerExp};
use std::vec;

use crate::context::Syntax;
use crate::descriptor::field_descriptor_proto::Type;
use crate::descriptor::DescriptorProto;
use crate::{context::Context, descriptor::FieldDescriptorProto};

use convert_case::{Case, Casing};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, ArrayPat, BinaryOp, BlockStmt, ClassMember, ClassMethod, Expr, Function, MethodKind,
    ObjectLit, Param, Pat, PatOrExpr, PropName, Stmt, ThrowStmt, UnaryOp,
};
use swc_ecma_utils::{quote_ident, quote_str};

use super::field::FieldAccessorFn;

pub(crate) fn json_key_name_field_member(field: &FieldDescriptorProto) -> Expr {
    crate::member_expr!("json", field.json_key_name())
}

impl FieldDescriptorProto {
    fn typeof_expr_for_well_known_type(&self, accessor: FieldAccessorFn) -> Expr {
        let typ = match self.type_name().trim_start_matches(".") {
            "google.protobuf.BoolValue" => "boolean",
            "google.protobuf.BytesValue" => "string",
            "google.protobuf.DoubleValue" => "number",
            "google.protobuf.Duration" => "string",
            "google.protobuf.FieldMask" => "string",
            "google.protobuf.FloatValue" => "number",
            "google.protobuf.Int32Value" => "number",
            "google.protobuf.Int64Value" => "number|string",
            "google.protobuf.ListValue" => "array",
            "google.protobuf.StringValue" => "string",
            "google.protobuf.Timestamp" => "string",
            "google.protobuf.UInt32Value" => "number",
            "google.protobuf.UInt64Value" => "number|string",
            "google.protobuf.Value" => "unknown",
            "google.protobuf.NullValue" => "null",
            _ => "object",
        };

        self.typeof_expr_for_type(accessor, typ)
    }

    fn typeof_expr_for_type(&self, accessor: FieldAccessorFn, typ: &str) -> Expr {
        match typ {
            "unknown" => crate::paren_expr!(crate::chain_bin_exprs_or!(
                crate::typeof_unary_expr!(accessor(self).into(), "number"),
                crate::typeof_unary_expr!(accessor(self).into(), "string"),
                crate::typeof_unary_expr!(accessor(self).into(), "boolean"),
                crate::typeof_unary_expr!(accessor(self).into(), "object")
            )),
            "number|string" => crate::paren_expr!(crate::chain_bin_exprs_or!(
                crate::typeof_unary_expr!(accessor(self).into(), "number"),
                crate::typeof_unary_expr!(accessor(self).into(), "string")
            )),
            "array" => crate::call_expr!(
                crate::member_expr!("Array", "isArray"),
                vec![crate::expr_or_spread!(accessor(self).into())]
            ),
            "null" => crate::bin_expr!(
                accessor(self).into(),
                quote_ident!("null").into(),
                BinaryOp::EqEqEq
            ),
            typ => crate::typeof_unary_expr!(accessor(self).into(), typ),
        }
    }

    pub(self) fn infinity_and_nan_check(&self, accessor: FieldAccessorFn) -> Expr {
        crate::chain_bin_exprs_or!(
            crate::bin_expr!(accessor(self), quote_ident!("null").into(), BinaryOp::EqEq),
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("NaN").into(),
                BinaryOp::EqEqEq
            ),
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("Infinity").into(),
                BinaryOp::EqEqEq
            ),
            crate::bin_expr!(
                accessor(self),
                crate::lit_str!("-Infinity").into(),
                BinaryOp::EqEqEq
            )
        )
    }

    pub(self) fn min_max_check<T>(&self, accessor: FieldAccessorFn, min: T, max: T) -> Expr
    where
        T: Display + LowerExp,
    {
        crate::paren_expr!(crate::chain_bin_exprs_and!(
            crate::bin_expr!(
                accessor(self),
                quote_ident!(format!("{:+e}", min)).into(),
                BinaryOp::GtEq
            ),
            crate::bin_expr!(
                accessor(self),
                quote_ident!(format!("{:+e}", max)).into(),
                BinaryOp::LtEq
            )
        ))
    }

    pub(self) fn min_max_check_bigint<T>(&self, accessor: FieldAccessorFn, min: T, max: T) -> Expr
    where
        T: Into<num_bigint::BigInt>,
    {
        crate::paren_expr!(crate::chain_bin_exprs_and!(
            crate::bin_expr!(
                accessor(self),
                crate::lit_bigint!(min.into()).into(),
                BinaryOp::GtEq
            ),
            crate::bin_expr!(
                accessor(self),
                crate::lit_bigint!(max.into()).into(),
                BinaryOp::LtEq
            )
        ))
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

    pub(self) fn value_check_stmt(&self, accessor: FieldAccessorFn) -> Stmt {
        let min_max_check: Option<Expr> = match self.type_() {
            Type::TYPE_FLOAT => Some(self.min_max_check(accessor, f32::MIN, f32::MAX)),
            Type::TYPE_DOUBLE => Some(self.min_max_check(accessor, f64::MIN, f64::MAX)),
            Type::TYPE_UINT32 | Type::TYPE_FIXED32 => {
                Some(self.min_max_check(accessor, u32::MIN, u32::MAX))
            }
            Type::TYPE_UINT64 | Type::TYPE_FIXED64 => {
                Some(self.min_max_check_bigint(accessor, u64::MIN, u64::MAX))
            }
            Type::TYPE_INT32 | Type::TYPE_SFIXED32 | Type::TYPE_SINT32 => {
                Some(self.min_max_check(accessor, i32::MIN, i32::MAX))
            }
            Type::TYPE_INT64 | Type::TYPE_SFIXED64 | Type::TYPE_SINT64 => {
                Some(self.min_max_check_bigint(accessor, i64::MIN, i64::MAX))
            }
            _ => None,
        };

        let num_check = if min_max_check.is_some() {
            Some(crate::chain_bin_exprs_or!(
                self.infinity_and_nan_check(accessor),
                min_max_check.unwrap()
            ))
        } else {
            None
        };

        let typeof_check = if self.is_well_known_message() {
            self.typeof_expr_for_well_known_type(accessor)
        } else if self.is_string() || self.is_bytes() {
            self.typeof_expr_for_type(accessor, "string")
        } else if self.is_booelan() {
            self.typeof_expr_for_type(accessor, "boolean")
        } else if self.is_message() {
            /* also map */
            self.typeof_expr_for_type(accessor, "object")
        } else if self.is_number() || self.is_enum() {
            // crate::paren_expr!(crate::chain_bin_exprs_and!(
            //     self.typeof_expr_for_type(accessor, "number|string"),
            //     crate::call_expr!(
            //         crate::member_expr!("Number", "isInteger"),
            //         vec![crate::expr_or_spread!(accessor(self).into())]
            //     )
            // ))
            self.typeof_expr_for_type(accessor, "number|string")
        } else {
            self.typeof_expr_for_type(accessor, "never!")
        };

        let check = if num_check.is_some() {
            crate::paren_expr!(crate::chain_bin_exprs_and!(
                typeof_check,
                num_check.unwrap()
            ))
        } else {
            typeof_check
        };

        crate::if_stmt!(
            crate::unary_expr!(crate::paren_expr!(check)),
            Stmt::Throw(ThrowStmt {
                span: DUMMY_SP,
                arg: Box::new(crate::new_expr!(
                    quote_ident!("Error").into(),
                    vec![crate::expr_or_spread!(crate::lit_str!(format!(
                        "illegal value for {}",
                        self.json_key_name()
                    ))
                    .into())]
                )),
            })
        )
    }

    pub(self) fn json_key_name(&self) -> String {
        if self.has_json_name() {
            self.json_name().to_string()
        } else {
            self.name().to_case(Case::Camel)
        }
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
        let base64 = ctx.get_import("https://deno.land/std@0.205.0/encoding/base64url.ts");
        if self.is_enum() {
            crate::member_expr_computed!(ctx.lazy_type_ref(self.type_name()).into(), accessor)
        } else if self.is_bytes() {
            crate::call_expr!(
                crate::member_expr!(base64, "encode"),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else if self.is_bigint() {
            crate::call_expr!(crate::member_expr_bare!(accessor, "toString"))
        } else if self.is_number() {
            crate::cond_expr!(
                crate::call_expr!(
                    crate::member_expr!("Number", "isFinite"),
                    vec![crate::expr_or_spread!(accessor.clone())]
                ),
                accessor.clone().into(),
                super::field::to_string_normalizer(&accessor)
            )
        } else if self.is_message() && !self.is_map(ctx) {
            crate::call_expr!(crate::member_expr_bare!(accessor, "toJson"))
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
        let base64 = ctx.get_import("https://deno.land/std@0.205.0/encoding/base64url.ts");
        if self.is_enum() {
            crate::member_expr_computed!(ctx.lazy_type_ref(self.type_name()).into(), accessor)
        } else if self.is_bytes() {
            crate::call_expr!(
                crate::member_expr!(base64, "decode"),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else if self.is_bigint() {
            crate::call_expr!(
                quote_ident!("BigInt").into(),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else if self.is_number() {
            crate::call_expr!(
                quote_ident!("Number").into(),
                vec![crate::expr_or_spread!(accessor)]
            )
        } else if self.is_message() && !self.is_map(ctx) {
            crate::call_expr!(
                crate::member_expr_bare!(ctx.lazy_type_ref(self.type_name()).into(), "fromJson"),
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
            let accessor_fn = if field.is_repeated() && !field.is_map(ctx) {
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
                    crate::member_expr!("Array", "from"),
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
                    crate::member_expr!("Object", "fromEntries"),
                    vec![crate::expr_or_spread!(value_expr)]
                );
            } else if field.is_repeated() {
                value_expr = crate::call_expr!(
                    crate::member_expr_bare!(crate::member_expr!("this", field.name()), "map"),
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
            let accessor_fn = super::field::static_field_member;

            let mut value_expr = field.into_from_json_expr(ctx, accessor_fn);

            // // TODO: wkt
            if field.type_name().contains("google.protobuf") && !field.type_name().contains("Value")
            {
                continue;
            }

            if field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());
                let key_field = &descriptor.field[0];
                let value_field = &descriptor.field[1];
                value_expr = crate::call_expr!(
                    crate::member_expr!("Object", "entries"),
                    vec![crate::expr_or_spread!(value_expr)]
                );
                if !(key_field.is_string() && value_field.is_string()) {
                    value_expr = crate::call_expr!(
                        crate::member_expr_bare!(value_expr, "map"),
                        vec![crate::expr_or_spread!(crate::arrow_func_short!(
                            Expr::Array(ArrayLit {
                                span: DUMMY_SP,
                                elems: vec![
                                    Some(crate::expr_or_spread!(key_field.into_from_json_expr(
                                        ctx,
                                        super::field::bare_field_member
                                    ))),
                                    Some(crate::expr_or_spread!(value_field.into_from_json_expr(
                                        ctx,
                                        super::field::bare_field_member
                                    )))
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
                value_expr = crate::new_expr!(
                    quote_ident!("Map").into(),
                    vec![crate::expr_or_spread!(value_expr)]
                );
            } else if field.is_repeated() {
                value_expr = crate::call_expr!(
                    crate::member_expr_bare!(accessor_fn(&field), "map"),
                    vec![crate::expr_or_spread!(crate::arrow_func!(
                        vec![crate::pat_ident!("r")],
                        vec![
                            field.value_check_stmt(accessor_fn),
                            crate::return_stmt!(value_expr)
                        ]
                    ))]
                );
            }

            let mut stmts = vec![Stmt::Decl(crate::const_decl!(
                "r",
                crate::cond_expr!(
                    crate::bin_expr!(
                        json_key_name_field_member(&field),
                        quote_ident!("null").into(),
                        BinaryOp::EqEqEq
                    ),
                    field.default_value_expr(ctx, true),
                    json_key_name_field_member(&field)
                )
            ))];

            if !field.is_repeated() {
                stmts.push(field.value_check_stmt(accessor_fn))
            }
            stmts.push(crate::expr_stmt!(crate::assign_expr!(
                PatOrExpr::Expr(Box::new(crate::member_expr!("message", field.name()))),
                value_expr
            )));
            statements.push(crate::if_stmt!(
                field.default_value_bin_expr_for_json(ctx, json_key_name_field_member),
                crate::block_stmt!(stmts)
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
