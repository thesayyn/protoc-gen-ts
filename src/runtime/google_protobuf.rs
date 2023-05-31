use super::Runtime;
use crate::{
    context::Context,
    descriptor::{self, field_descriptor_proto::Type, FieldDescriptorProto},
};
use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignOp, BinExpr, BinaryOp, BlockStmt, BlockStmtOrExpr, BreakStmt,
    Expr, ExprStmt, IfStmt, Lit, Number, PatOrExpr, Stmt, SwitchCase, SwitchStmt, WhileStmt,
};
use swc_ecma_utils::quote_ident;

pub struct GooglePBRuntime {}

// default
impl GooglePBRuntime {
    pub fn new() -> Self {
        GooglePBRuntime {}
    }

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

            Type::TYPE_GROUP => "todo_group",
            Type::TYPE_MESSAGE => "todo_group",
            // _ => unimplemented!("rw_function_name {:?}", field.type_()),
        }
        .replace("_placeholder_", placeholder.as_str())
    }
}

// deserialize
impl GooglePBRuntime {
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

    fn deserialize_stmt(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Stmt {
        let mut cases: Vec<SwitchCase> = vec![];
        for field in &descriptor.field {
            let read_expr = if field.is_message() {
                self.deserialize_message_field_expr(ctx, field)
            } else {
                self.deserialize_primitive_field_expr(ctx, field)
            };

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
                            right: Box::new(read_expr),
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

// serialize
impl GooglePBRuntime {
    fn serialize_primitive_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
    ) -> Expr {
        crate::call_expr!(
            crate::member_expr!("bw", self.rw_function_name("write", ctx, field)),
            vec![
                crate::expr_or_spread!(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None
                }))),
                crate::expr_or_spread!(crate::member_expr!("this", field.name())),
            ]
        )
    }

    fn serialize_message_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
    ) -> Expr {
        let arrow_func = Expr::Arrow(ArrowExpr {
            is_async: false,
            is_generator: false,
            params: vec![],
            return_type: None,
            span: DUMMY_SP,
            type_params: None,
            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    Stmt::Decl(crate::const_decl!(
                        "result",
                        crate::call_expr!(crate::member_expr_bare!(
                            crate::member_expr!("this", field.name()),
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
                ],
            })),
        });
        crate::call_expr!(
            crate::member_expr!("bw", "writeMessage"),
            vec![
                crate::expr_or_spread!(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: field.number() as f64,
                    raw: None
                }))),
                crate::expr_or_spread!(crate::member_expr!("this", field.name())),
                crate::expr_or_spread!(arrow_func),
            ]
        )
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
            Some(vec![crate::expr_or_spread!(Expr::Ident(quote_ident!(
                "bytes"
            )))])
        );
        let br_decl_stmt = Stmt::Decl(crate::const_decl!("br", br_decl_init));
        let deserialize_stmt = self.deserialize_stmt(ctx, descriptor);

        vec![br_decl_stmt, deserialize_stmt]
    }

    fn serialize_setup(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        let import = ctx.get_import(&ctx.options.runtime_package);
        let bw_decl_init = crate::new_expr!(crate::member_expr!(import, "BinaryWriter"));
        let bw_decl = Stmt::Decl(crate::const_decl!("bw", bw_decl_init));

        let mut stmts = vec![bw_decl];

        for field in &descriptor.field {
            // TODO:
            // bw.writeMessage(6, this.jspb_encoding_options, () => {
            //     const result = this.jspb_encoding_options.serialize();
            //     bw.writeSerializedMessage(result, 0, result.length);
            // });
            let write_expr = if field.is_message() {
                self.serialize_message_field_expr(ctx, field)
            } else {
                self.serialize_primitive_field_expr(ctx, field)
            };
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
                        expr: Box::new(write_expr),
                    })],
                })),
                span: DUMMY_SP,
                alt: None,
            }))
        }

        stmts
    }
}
