use super::GooglePBRuntime;
use crate::ast::field;
use crate::{context::Context, descriptor};

use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BinaryOp, BlockStmt, BreakStmt, Expr, Lit, Number, PatOrExpr, Stmt, SwitchCase, SwitchStmt,
    TsNonNullExpr, WhileStmt,
};
use swc_ecma_utils::quote_ident;

impl GooglePBRuntime {
    pub(super) fn deserialize_setup_inner(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        create_br: bool,
    ) -> Vec<Stmt> {
        let mut stmts = vec![];

        if create_br {
            let import = ctx.get_import(&ctx.options.runtime_package);
            let br_decl_init = crate::new_expr!(
                crate::member_expr!(import, "BinaryReader"),
                Some(vec![crate::expr_or_spread!(Expr::Ident(quote_ident!(
                    "bytes"
                )))])
            );
            let br_decl = Stmt::Decl(crate::let_decl!("br", None, br_decl_init));
            stmts.push(br_decl)
        }

        stmts.push(self.deserialize_stmt(ctx, descriptor, field::message_field_member));

        stmts
    }

    fn deserialize_message_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
    ) -> Expr {
        crate::call_expr!(
            crate::member_expr!(ctx.lazy_type_ref(field.type_name()), "deserialize"),
            vec![crate::expr_or_spread!(crate::call_expr!(
                crate::member_expr!("br", "readBytes")
            ))]
        )
    }

    fn deserialize_primitive_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        force_unpacked: bool,
    ) -> Expr {
        let mut call = crate::call_expr!(crate::member_expr!(
            "br",
            self.rw_function_name("read", field.is_bigint() || force_unpacked, ctx, field)
        ));
        if field.is_bigint() {
            call = crate::call_expr!(
                quote_ident!("BigInt").into(),
                vec![crate::expr_or_spread!(call)]
            );
            if (field.is_packed(ctx) || field.is_packable()) && !force_unpacked {
                call = crate::call_expr!(
                    crate::member_expr!("br", "readPackedField_"),
                    vec![crate::expr_or_spread!(crate::arrow_func_short!(call))]
                )
            }
        }
        call
    }

    fn deserialize_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        force_unpacked: bool,
    ) -> Expr {
        if field.is_message() {
            self.deserialize_message_field_expr(ctx, field)
        } else {
            self.deserialize_primitive_field_expr(ctx, field, force_unpacked)
        }
    }

    pub fn deserialize_stmt(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        accessor: field::FieldAccessorFn,
    ) -> Stmt {
        let mut cases: Vec<SwitchCase> = vec![];
        for field in &descriptor.field {
            let read_expr = self.deserialize_field_expr(ctx, field, false);

            let read_stmt = if field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());
                let key_field = &descriptor.field[0];
                let value_field = &descriptor.field[1];
                crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr!("br", "readMessage"),
                    vec![
                        crate::expr_or_spread!(quote_ident!("undefined").into()),
                        crate::expr_or_spread!(crate::arrow_func!(
                            vec![],
                            vec![
                                Stmt::Decl(crate::let_decl!(
                                    "key",
                                    key_field.type_annotation(ctx),
                                    key_field.default_value_expr(ctx, true)
                                )),
                                Stmt::Decl(crate::let_decl!(
                                    "value",
                                    value_field.type_annotation(ctx),
                                    value_field.default_value_expr(ctx, true)
                                )),
                                self.deserialize_stmt(ctx, &descriptor, field::bare_field_member),
                                crate::expr_stmt!(crate::call_expr!(
                                    crate::member_expr_bare!(accessor(field.name()), "set"),
                                    vec![
                                        crate::expr_or_spread!(Expr::TsNonNull(TsNonNullExpr {
                                            expr: Box::new(Expr::Ident(quote_ident!("key"))),
                                            span: DUMMY_SP
                                        })),
                                        crate::expr_or_spread!(Expr::TsNonNull(TsNonNullExpr {
                                            expr: Box::new(Expr::Ident(quote_ident!("value"))),
                                            span: DUMMY_SP
                                        })),
                                    ]
                                ))
                            ]
                        ))
                    ]
                ))
            } else if field.is_packable() {
                crate::if_stmt!(
                    crate::call_expr!(crate::member_expr!("br", "isDelimited")),
                    crate::expr_stmt!(crate::call_expr!(
                        crate::member_expr_bare!(accessor(field.name()), "push"),
                        vec![crate::expr_or_spread!(
                            self.deserialize_field_expr(ctx, field, false),
                            true
                        )]
                    )),
                    crate::expr_stmt!(crate::call_expr!(
                        crate::member_expr_bare!(accessor(field.name()), "push"),
                        vec![crate::expr_or_spread!(
                            self.deserialize_field_expr(ctx, field, true)
                        )]
                    ))
                )
            } else if field.is_repeated() && !field.is_packed(ctx) {
                crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr_bare!(accessor(field.name()), "push"),
                    vec![crate::expr_or_spread!(read_expr)]
                ))
            } else {
                crate::expr_stmt!(crate::assign_expr!(
                    PatOrExpr::Expr(Box::new(accessor(field.name()))),
                    read_expr
                ))
            };

            cases.push(SwitchCase {
                span: DUMMY_SP,
                test: Some(Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None,
                })))),
                cons: vec![
                    read_stmt,
                    Stmt::Break(BreakStmt {
                        label: None,
                        span: DUMMY_SP,
                    }),
                ],
            })
        }
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: None,
            cons: vec![crate::expr_stmt!(crate::call_expr!(crate::member_expr!(
                "br",
                "skipField"
            )))],
        });

        let switch_stmt = Stmt::Switch(SwitchStmt {
            span: DUMMY_SP,
            discriminant: Box::new(crate::call_expr!(crate::member_expr!(
                "br",
                "getFieldNumber"
            ))),
            cases,
        });

        let while_stmt_test_expr = crate::bin_expr!(
            crate::call_expr!(crate::member_expr!("br", "nextField")),
            crate::unary_expr!(crate::call_expr!(crate::member_expr!("br", "isEndGroup"))),
            BinaryOp::LogicalAnd
        );
        Stmt::While(WhileStmt {
            span: DUMMY_SP,
            test: Box::new(while_stmt_test_expr),
            body: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![switch_stmt],
            })),
        })
    }
}
