use super::{
    field::{self, FieldAccessorFn},
    GooglePBRuntime,
};
use crate::{context::Context, descriptor};

use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BinExpr, BinaryOp, BindingIdent, BlockStmt, Expr, ExprStmt, ForHead, ForOfStmt, IfStmt, Lit,
    Number, Stmt, VarDecl,
};
use swc_ecma_utils::quote_ident;

impl GooglePBRuntime {
    pub fn serialize_primitive_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: FieldAccessorFn,
    ) -> Expr {
        crate::call_expr!(
            crate::member_expr!("bw", self.rw_function_name("write", ctx, field)),
            vec![
                crate::expr_or_spread!(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None
                }))),
                crate::expr_or_spread!(field_accessor(field.name())),
            ]
        )
    }

    pub fn serialize_message_field_expr(
        &self,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: FieldAccessorFn,
    ) -> Expr {
        let arrow_func = crate::arrow_func!(
            vec![],
            vec![
                Stmt::Decl(crate::const_decl!(
                    "result",
                    crate::call_expr!(crate::member_expr_bare!(
                        field_accessor(field.name()),
                        "serialize"
                    ))
                )),
                Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(crate::call_expr!(
                        crate::member_expr!("bw", "writeSerializedMessage"),
                        vec![
                            crate::expr_or_spread!(Expr::Ident(quote_ident!("result"))),
                            crate::expr_or_spread!(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 0 as f64,
                                raw: None
                            }))),
                            crate::expr_or_spread!(crate::member_expr!("result", "length")),
                        ]
                    )),
                }),
            ]
        );

        crate::call_expr!(
            crate::member_expr!("bw", "writeMessage"),
            vec![
                crate::expr_or_spread!(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None
                }))),
                crate::expr_or_spread!(field_accessor(field.name())),
                crate::expr_or_spread!(arrow_func),
            ]
        )
    }
}

impl GooglePBRuntime {
    pub(super) fn serialize_setup_inner(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        accessor: FieldAccessorFn,
        create_bw: bool,
    ) -> Vec<Stmt> {
        let mut stmts = vec![];

        if create_bw {
            let import = ctx.get_import(&ctx.options.runtime_package);
            let bw_decl_init = crate::new_expr!(crate::member_expr!(import, "BinaryWriter"));
            let bw_decl = Stmt::Decl(crate::const_decl!("bw", bw_decl_init));
            stmts.push(bw_decl)
        }

        for field in &descriptor.field {
            let field_accessor = if descriptor.options.map_entry() {
                accessor
            } else {
                field.into_accessor(ctx)
            };
            let write_expr = if field.is_message() {
                self.serialize_message_field_expr(field, field_accessor)
            } else {
                self.serialize_primitive_field_expr(ctx, field, field_accessor)
            };

            let write_stmt = if field.is_repeated() && field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());
                let mut stmts = vec![crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr!("bw", "beginSubMessage"),
                    vec![crate::expr_or_spread!(Expr::Lit(crate::lit_num!(
                        field.number()
                    )))]
                ))];
                let mut inner_stmts =
                    self.serialize_setup_inner(ctx, &descriptor, field::bare_field_member, false);
                stmts.append(&mut inner_stmts);
                stmts.push(crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr!("bw", "endSubMessage"),
                    vec![crate::expr_or_spread!(Expr::Lit(crate::lit_num!(
                        field.number()
                    )))]
                )));

                Stmt::ForOf(ForOfStmt {
                    is_await: false,
                    left: ForHead::VarDecl(Box::new(crate::array_var_decl!(vec![
                        Some(crate::binding_ident!("key")),
                        Some(crate::binding_ident!("value"))
                    ]))),
                    right: Box::new(crate::member_expr!("this", field.name())),
                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    })),
                    span: DUMMY_SP,
                })
            } else if field.is_repeated() && !field.is_packed(ctx) {
                Stmt::ForOf(ForOfStmt {
                    is_await: false,
                    left: ForHead::VarDecl(Box::new(crate::const_decl_uinit!(field.name()))),
                    right: Box::new(accessor(field.name())),
                    body: Box::new(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(write_expr),
                    })),
                    span: DUMMY_SP,
                })
            } else {
                Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(write_expr),
                })
            };

            stmts.push(Stmt::If(IfStmt {
                test: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: BinaryOp::NotEqEq,
                    left: Box::new(accessor(field.name())),
                    right: Box::new(Expr::Ident(quote_ident!("undefined"))),
                })),
                cons: Box::new(Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![write_stmt],
                })),
                span: DUMMY_SP,
                alt: None,
            }))
        }

        stmts
    }
}
