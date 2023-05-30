use super::Runtime;
use crate::{
    context::Context,
    descriptor::{self, field_descriptor_proto::Type, FieldDescriptorProto},
    member_expr,
};
use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignExpr, AssignOp, BinExpr, BinaryOp, BindingIdent, BlockStmt, BreakStmt, CallExpr, Callee,
    Decl, Expr, ExprOrSpread, ExprStmt, IfStmt, Lit, MemberExpr, MemberProp, NewExpr, Number,
    PatOrExpr, Stmt, SwitchCase, SwitchStmt, UnaryExpr, UnaryOp, VarDecl, VarDeclarator, WhileStmt,
};
use swc_ecma_utils::quote_ident;

pub struct GooglePBRuntime {}

impl GooglePBRuntime {
    pub fn new() -> Self {
        GooglePBRuntime {}
    }
}

impl GooglePBRuntime {
    fn rw_function_name(
        &self,
        rw: &str,
        ctx: &mut Context,
        field: &FieldDescriptorProto,
    ) -> String {
        let mut placeholder = format!("{}", rw);
        if field.is_packed(ctx) {
            placeholder = format!("{}Packed", rw);
        }
        match field.type_() {
            Type::TYPE_STRING => "_placeholder_String",
            Type::TYPE_BOOL => "_placeholder_Bool",
            Type::TYPE_FLOAT => "_placeholder_Float",
            Type::TYPE_DOUBLE => "_placeholder_Double",
            Type::TYPE_ENUM => "_placeholder_Enum",
            Type::TYPE_BYTES => "_placeholder_Bytes",

            Type::TYPE_INT32 => "_placeholder_Int32",
            Type::TYPE_INT64 => "_placeholder_Int64",
            Type::TYPE_UINT32 => "_placeholder_Uint32",
            Type::TYPE_UINT64 => "_placeholder_Uint64",
            Type::TYPE_SINT32 => "_placeholder_Sint32",
            Type::TYPE_SINT64 => "_placeholder_Sint64",

            Type::TYPE_FIXED32 => "_placeholder_Fixed32",
            Type::TYPE_FIXED64 => "_placeholder_Fixed64",
            Type::TYPE_SFIXED32 => "_placeholder_Sfixed32",
            Type::TYPE_SFIXED64 => "_placeholder_Sfixed64",

            Type::TYPE_MESSAGE => "todo_message",
            Type::TYPE_GROUP => "todo_group",
        }
        .replace("_placeholder_", placeholder.as_str())
    }

    fn deserialize_while_loop(&self, ctx: &mut Context, stmt: Stmt) -> Stmt {
        let test_expr = Expr::Bin(BinExpr {
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
            test: Box::new(test_expr),
            body: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![stmt],
            })),
        })
    }

    fn deserialize_switch_case(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Stmt {
        let mut cases: Vec<SwitchCase> = vec![];
        for field in &descriptor.field {
            cases.push(SwitchCase {
                span: DUMMY_SP,
                test: Some(Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None,
                })))),
                cons: vec![
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: PatOrExpr::Expr(Box::new(crate::member_expr!(
                                "message",
                                field.name()
                            ))),
                            right: Box::new(crate::call_expr!(member_expr!(
                                "br",
                                self.rw_function_name("read", ctx, field)
                            ))),
                        })),
                    }),
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
        let discriminant = crate::call_expr!(member_expr!("br", "getFieldNumber"));
        Stmt::Switch(SwitchStmt {
            span: DUMMY_SP,
            discriminant: Box::new(discriminant),
            cases: cases,
        })
    }
}

impl Runtime for GooglePBRuntime {
    fn deserialize_setup(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        let import = ctx.get_import(&ctx.options.runtime_package);

        let br_decl_init = crate::new_expr!(
            crate::member_expr!(import, "BinaryReader"),
            Some(vec![ExprOrSpread {
                expr: Box::new(Expr::Ident(quote_ident!("bytes"))),
                spread: None
            }])
        );
        let bd_decl = Stmt::Decl(crate::const_decl!("br", Some(br_decl_init)));

        let switch_case = self.deserialize_switch_case(ctx, descriptor);

        vec![bd_decl, self.deserialize_while_loop(ctx, switch_case)]
    }

    fn serialize_setup(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        let import = ctx.get_import(&ctx.options.runtime_package);
        let bw_decl_init = crate::new_expr!(crate::member_expr!(import, "BinaryWriter"));
        let bw_decl = Stmt::Decl(crate::const_decl!("bw", Some(bw_decl_init)));

        let mut stmts = vec![bw_decl];

        for field in &descriptor.field {
            stmts.push(Stmt::If(IfStmt {
                test: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: BinaryOp::NotEqEq,
                    left: Box::new(crate::member_expr!("this", field.name())),
                    right: Box::new(Expr::Ident(quote_ident!("undefined"))),
                })),
                cons: Box::new(Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(crate::call_expr!(
                            crate::member_expr!("bw", self.rw_function_name("write", ctx, field)),
                            vec![
                                ExprOrSpread {
                                    expr: Box::new(Expr::Lit(Lit::Num(Number {
                                        span: DUMMY_SP,
                                        value: field.number() as f64,
                                        raw: None
                                    }))),
                                    spread: None
                                },
                                ExprOrSpread {
                                    expr: Box::new(
                                        crate::member_expr!("this", field.name())
                                    ),
                                    spread: None
                                }
                            ]
                        )),
                    })],
                })),
                span: DUMMY_SP,
                alt: None,
            }))
        }

        stmts
    }
}
