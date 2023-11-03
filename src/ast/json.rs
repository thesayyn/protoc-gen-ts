use std::vec;

use crate::descriptor::DescriptorProto;
use crate::{context::Context, descriptor::FieldDescriptorProto};
use crate::{member_expr, member_expr_bare};

use convert_case::{Case, Casing};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, ArrayPat, BlockStmt, ClassMember, ClassMethod, Expr, Function, MethodKind, ObjectLit,
    Pat, PatOrExpr, PropName, Stmt, Param,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
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

    pub(self) fn into_stringified_map_expr(&self, ctx: &mut Context) -> Expr {
        if self.is_string() {
            return Expr::Ident(quote_ident!(self.name()));
        }
        if self.name() == "key" {
            super::field::to_string_normalizer(&quote_ident!(self.name()).into())
        } else {
            self.into_json_expr(ctx, super::field::bare_field_member)
        }
    }

    pub(self) fn into_json_expr(
        &self,
        ctx: &mut Context,
        accessor_fn: super::field::FieldAccessorFn,
    ) -> Expr {
        let accessor = accessor_fn(self.name());
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

            let mut value_expr = field.into_json_expr(ctx, accessor_fn);

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
                                        key_field.into_stringified_map_expr(ctx)
                                    )),
                                    Some(crate::expr_or_spread!(
                                        value_field.into_stringified_map_expr(ctx)
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
        let mut statements = vec![
            Stmt::Decl(crate::const_decl!(
                "message",
                crate::new_expr!(Expr::Ident(quote_ident!(ctx.normalize_name(self.name()))))
            )),
        ];

        for field in self.field.clone() {

            let value_expr = super::field::json_field_member(&field.json_key_name());


            statements.push(crate::if_stmt!(
                field.default_value_bin_expr(ctx, super::field::json_field_member),
                crate::expr_stmt!(crate::assign_expr!(
                    PatOrExpr::Expr(Box::new(crate::member_expr!("message", field.name()))),
                    value_expr
                ))
            ))
        }

        statements.push(crate::return_stmt!(quote_ident!("json").into()));

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
