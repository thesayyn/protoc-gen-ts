use crate::{context::Context, descriptor::{FieldDescriptorProto, field_descriptor_proto::Type, self}};
use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignExpr, AssignOp, BinExpr, BinaryOp, BindingIdent, BlockStmt, BreakStmt, CallExpr, Callee,
    Decl, Expr, ExprStmt, Lit, MemberExpr, MemberProp, NewExpr, Number, PatOrExpr, Stmt,
    SwitchCase, SwitchStmt, UnaryExpr, UnaryOp, VarDecl, VarDeclarator, WhileStmt,
};
use swc_ecma_utils::quote_ident;
use super::{macros, Runtime};

pub struct GooglePBRuntime {}

impl GooglePBRuntime {
    pub fn new() -> Self {
        GooglePBRuntime {}
    }
}

impl GooglePBRuntime {
    fn read_function_name(&self, ctx: &mut Context, field: &FieldDescriptorProto) -> String {
        let mut read_prefix = "read";
        if field.is_packed(ctx) {
            read_prefix = "readPacked"
        }
        match field.type_() {
            Type::TYPE_STRING => "readString",
            Type::TYPE_BOOL => "readBool",
            Type::TYPE_FLOAT => "readFloat",
            Type::TYPE_DOUBLE => "readDouble",
            Type::TYPE_ENUM => "readEnum",
            Type::TYPE_BYTES => "readBytes",

            Type::TYPE_INT32 => "readInt32",
            Type::TYPE_INT64 => "readInt64",
            Type::TYPE_UINT32 => "readUint32",
            Type::TYPE_UINT64 => "readUint64",
            Type::TYPE_SINT32 => "readSint32",
            Type::TYPE_SINT64 => "readSint64",

            Type::TYPE_FIXED32 => "readFixed32",
            Type::TYPE_FIXED64 => "readFixed64",
            Type::TYPE_SFIXED32 => "readSfixed32",
            Type::TYPE_SFIXED64 => "readSfixed64",
            
            Type::TYPE_MESSAGE => "todo_message",
            Type::TYPE_GROUP => "todo_group",
        
        }.replace("read", read_prefix)
    }

    fn while_loop(&self, ctx: &mut Context, stmt: Stmt) -> Stmt {
        let import = ctx.get_import(&ctx.options.runtime_package);
        let test_expr = Expr::Bin(BinExpr {
            op: BinaryOp::LogicalAnd,
            left: Box::new(macros::argless_expr_call!("br", "nextField")),
            right: Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: UnaryOp::Bang,
                arg: Box::new(macros::argless_expr_call!("br", "isEndGroup")),
            })),
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

    fn switch_case(&self, ctx: &mut Context, descriptor: &descriptor::DescriptorProto) -> Stmt {
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
                            left: PatOrExpr::Expr(Box::new(macros::member!("br", field.name()))),
                            right: Box::new(macros::argless_expr_call!("br", self.read_function_name(ctx, field))),
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
                expr: Box::new(macros::argless_expr_call!("br", "skipField")),
            })],
        });
        let discriminant = macros::argless_expr_call!("br", "getFieldNumber");
        Stmt::Switch(SwitchStmt {
            span: DUMMY_SP,
            discriminant: Box::new(discriminant),
            cases: cases,
        })
    }
}

impl Runtime for GooglePBRuntime {
    fn deserialize_assign_field(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        let switch_case = self.switch_case(ctx, descriptor);
        vec![self.while_loop(ctx, switch_case)]
    }

    fn deserialize_setup(&self, ctx: &mut Context) -> Vec<Stmt> {
        let import = ctx.get_import(&ctx.options.runtime_package);
        let binary_decoder = Expr::New(NewExpr {
            span: DUMMY_SP,
            callee: Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(import)),
                prop: MemberProp::Ident(quote_ident!("BinaryReader")),
            })),
            args: None,
            type_args: None,
        });
        let binary_decoder_decl = Decl::Var(Box::new(VarDecl {
            kind: swc_ecma_ast::VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                definite: false,
                name: swc_ecma_ast::Pat::Ident(BindingIdent {
                    id: quote_ident!("br"),
                    type_ann: None,
                }),
                init: Some(Box::new(binary_decoder)),
                span: DUMMY_SP,
            }],
            span: DUMMY_SP,
        }));
        vec![Stmt::Decl(binary_decoder_decl)]
    }
}
