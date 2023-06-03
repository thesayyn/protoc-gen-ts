use super::{
    GooglePBRuntime,
};
use crate::ast::field;
use crate::{context::Context, descriptor};

use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BinExpr, BinaryOp, BlockStmt, BreakStmt, Decl, Expr, ExprStmt, Lit,
    Number, PatOrExpr, Stmt, SwitchCase, SwitchStmt, WhileStmt,
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
            let br_decl = Stmt::Decl(crate::const_decl!("br", br_decl_init));
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
                crate::member_expr_bare!(
                    crate::call_expr!(crate::member_expr!("br", "getFieldDecoder")),
                    "getBuffer"
                )
            ))]
        )
    }

    fn deserialize_primitive_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
    ) -> Expr {
        crate::call_expr!(crate::member_expr!(
            "br",
            self.rw_function_name("read", ctx, field)
        ))
    }

    pub fn deserialize_stmt(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        accessor: field::FieldAccessorFn,
    ) -> Stmt {
        let mut cases: Vec<SwitchCase> = vec![];
        for field in &descriptor.field {
            let read_expr = if field.is_message() {
                self.deserialize_message_field_expr(ctx, field)
            } else {
                self.deserialize_primitive_field_expr(ctx, field)
            };

            let read_stmt = if field.is_repeated() && field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());

                Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        Stmt::Decl(Decl::Var(Box::new(crate::let_decl_uinit!("key")))),
                        Stmt::Decl(Decl::Var(Box::new(crate::let_decl_uinit!("value")))),
                        self.deserialize_stmt(ctx, &descriptor, field::bare_field_member),
                        crate::expr_stmt!(crate::call_expr!(
                            crate::member_expr_bare!(accessor(field.name()), "set"),
                            vec![
                                crate::expr_or_spread!(Expr::Ident(quote_ident!("key"))),
                                crate::expr_or_spread!(Expr::Ident(quote_ident!("value")))
                            ]
                        )),
                    ],
                })
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
            cons: vec![Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(crate::call_expr!(crate::member_expr!("br", "skipField"))),
            })],
        });

        let switch_stmt = Stmt::Switch(SwitchStmt {
            span: DUMMY_SP,
            discriminant: Box::new(crate::call_expr!(crate::member_expr!(
                "br",
                "getFieldNumber"
            ))),
            cases,
        });

        let while_stmt_test_expr = Expr::Bin(BinExpr {
            op: BinaryOp::LogicalAnd,
            left: Box::new(crate::call_expr!(crate::member_expr!("br", "nextField"))),
            right: Box::new(crate::unary_expr!(crate::call_expr!(crate::member_expr!(
                "br",
                "isEndGroup"
            )))),
            span: DUMMY_SP,
        });
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
