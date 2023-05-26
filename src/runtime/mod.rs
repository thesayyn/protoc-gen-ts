use crate::{context::Context, descriptor::FieldDescriptorProto};
use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignExpr, AssignOp, BlockStmt, CallExpr, Callee, Class, ClassExpr, Expr, ExprOrSpread,
    ExprStmt, Ident, Lit, MemberExpr, MemberProp, NewExpr, Number, PatOrExpr, PrivateName, Stmt,
    Str, ThisExpr,
};
use swc_ecma_utils::quote_ident;

pub trait Runtime {
    fn super_class(&self, ctx: &mut Context) -> Option<Expr>;
    fn constructor_stmts(&self, ctx: &mut Context) -> Vec<Stmt>;
    fn getter_expr(&self, ctx: &mut Context, field: &FieldDescriptorProto) -> Expr;
    fn setter_expr(&self, ctx: &mut Context, field: &FieldDescriptorProto) -> Expr;
}

pub struct GooglePBRuntime {}

impl GooglePBRuntime {
    pub fn new() -> Self {
        GooglePBRuntime {}
    }
}

impl Runtime for GooglePBRuntime {
    fn constructor_stmts(&self, ctx: &mut Context) -> Vec<Stmt> {
        let class_expr = Box::new(Expr::Class(ClassExpr {
            ident: None,
            class: Box::new(Class {
                decorators: vec![],
                body: vec![],
                span: DUMMY_SP,
                implements: vec![],
                is_abstract: false,
                super_class: Some(Box::new(self.super_class(ctx).expect(""))),
                super_type_params: None,
                type_params: None,
            }),
        }));

        let new_expr = Expr::New(NewExpr {
            args: None,
            callee: class_expr,
            span: DUMMY_SP,
            type_args: None,
        });

        let assign_expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                prop: MemberProp::PrivateName(PrivateName {
                    span: DUMMY_SP,
                    id: Ident {
                        optional: false,
                        span: DUMMY_SP,
                        sym: "runtime".into(),
                    },
                }),
            }))),
            right: Box::new(new_expr),
        });
        let assign_stmt = Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(assign_expr),
        });

        vec![Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            stmts: vec![assign_stmt],
        })]
    }

    fn super_class(&self, ctx: &mut Context) -> Option<Expr> {
        let import = ctx.get_import("google-protobuf");
        Some(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(import)),
            prop: MemberProp::Ident(quote_ident!("Message")),
            span: DUMMY_SP,
        }))
    }

    fn getter_expr(&self, ctx: &mut Context, field: &FieldDescriptorProto) -> Expr {
        let import = ctx.get_import("google-protobuf");
        let field_getter = Expr::Member(MemberExpr {
            obj: Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(import)),
                prop: MemberProp::Ident(quote_ident!("Message")),
            })),
            prop: MemberProp::Ident(quote_ident!("getFieldWithDefault")),
            span: DUMMY_SP,
        });

        let mut args: Vec<ExprOrSpread> = vec![
            ExprOrSpread {
                expr: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                spread: None,
            },
            ExprOrSpread {
                expr: Box::new(Expr::Lit(Lit::Num(Number {
                    raw: None,
                    span: DUMMY_SP,
                    value: field.number() as f64,
                }))),
                spread: None,
            },
        ];

        if field.is_string() {
            args.push(ExprOrSpread {
                expr: Box::new(Expr::Lit(Lit::Str(Str {
                    raw: None,
                    span: DUMMY_SP,
                    value: "".into(),
                }))),
                spread: None,
            })
        }

        Expr::Call(CallExpr {
            span: DUMMY_SP,
            args,
            type_args: None,
            callee: Callee::Expr(Box::new(field_getter)),
        })
    }

    fn setter_expr(&self, ctx: &mut Context, field: &FieldDescriptorProto) -> Expr {
        let import = ctx.get_import("google-protobuf");
        let field_getter = Expr::Member(MemberExpr {
            obj: Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(import)),
                prop: MemberProp::Ident(quote_ident!("Message")),
            })),
            prop: MemberProp::Ident(quote_ident!("setField")),
            span: DUMMY_SP,
        });

        let args: Vec<ExprOrSpread> = vec![
            ExprOrSpread {
                expr: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                spread: None,
            },
            ExprOrSpread {
                expr: Box::new(Expr::Lit(Lit::Num(Number {
                    raw: None,
                    span: DUMMY_SP,
                    value: field.number() as f64,
                }))),
                spread: None,
            },
            ExprOrSpread {
                expr: Box::new(Expr::Ident(quote_ident!("value"))),
                spread: None,
            },
        ];

        Expr::Call(CallExpr {
            span: DUMMY_SP,
            args,
            type_args: None,
            callee: Callee::Expr(Box::new(field_getter)),
        })
    }
}
