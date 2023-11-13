use super::GooglePBRuntime;
use crate::ast::field;
use crate::descriptor::field_descriptor_proto;
use crate::{context::Context, descriptor};

use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignOp, BinaryOp, BlockStmt, BreakStmt, Expr, KeyValueProp, ObjectLit, PatOrExpr, Prop,
    PropName, PropOrSpread, Stmt, SwitchCase, SwitchStmt, ThrowStmt, TsNonNullExpr, WhileStmt,
};
use swc_ecma_utils::{quote_ident, quote_str};

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
                vec![crate::expr_or_spread!(quote_ident!("bytes").into())]
            );
            let br_decl = Stmt::Decl(crate::const_decl!("br", br_decl_init));
            stmts.push(br_decl)
        }

        stmts.push(self.deserialize_stmt(ctx, descriptor, field::this_field_member, true));

        stmts
    }

    fn deserialize_message_field_preread_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        accessor: field::FieldAccessorFn,
    ) -> Expr {
        crate::assign_expr!(
            PatOrExpr::Expr(Box::new(accessor(field))),
            crate::new_expr!(ctx.lazy_type_ref(field.type_name()).into()),
            AssignOp::NullishAssign
        )
    }

    fn deserialize_message_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        accessor: field::FieldAccessorFn,
    ) -> Expr {
        let member_expr = if field.is_repeated() {
            crate::member_expr!(ctx.lazy_type_ref(field.type_name()), "fromBinary")
        } else {
            crate::member_expr_bare!(accessor(field).into(), "mergeFrom")
        };
        crate::call_expr!(
            member_expr,
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
            self.rw_function_name("read", ctx, field)
        ));
        if (field.is_packed(ctx) || field.is_packable()) && !force_unpacked {
            call = crate::call_expr!(crate::member_expr!(
                "br.decoder_",
                self.decoder_fn_name(field)
            ));
        }
        if field.is_bigint() {
            call = crate::call_expr!(
                quote_ident!("BigInt").into(),
                vec![crate::expr_or_spread!(call)]
            );
        } else if field.type_() == field_descriptor_proto::Type::TYPE_UINT32 {
            call = crate::bin_expr!(call, crate::lit_num!(0).into(), BinaryOp::ZeroFillRShift)
        } else if field.is_booelan() {
            call = crate::bin_expr!(call, crate::lit_num!(0).into(), BinaryOp::NotEqEq)
        }
        if (field.is_packed(ctx) || field.is_packable()) && !force_unpacked {
            call = crate::call_expr!(
                crate::member_expr!("br", "readPackedField_"),
                vec![crate::expr_or_spread!(crate::arrow_func_short!(call))]
            )
        }
        call
    }

    fn deserialize_map_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        accessor: field::FieldAccessorFn,
    ) -> Expr {
        let descriptor = ctx
            .get_map_type(field.type_name())
            .expect(format!("can not find the map type {}", field.type_name()).as_str());
        let key_field = &descriptor.field[0];
        let value_field = &descriptor.field[1];

        crate::call_expr!(
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
                        self.deserialize_stmt(ctx, &descriptor, field::bare_field_member, false),
                        crate::expr_stmt!(crate::call_expr!(
                            crate::member_expr_bare!(accessor(field), "set"),
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
        )
    }

    fn deserialize_field_expr(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        accessor: field::FieldAccessorFn,
        force_unpacked: bool,
    ) -> Expr {
        if field.is_map(ctx) {
            self.deserialize_map_field_expr(ctx, field, accessor)
        } else if field.is_message() {
            self.deserialize_message_field_expr(ctx, field, accessor)
        } else {
            self.deserialize_primitive_field_expr(ctx, field, force_unpacked)
        }
    }

    pub fn deserialize_stmt(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        accessor: field::FieldAccessorFn,
        add_unknown_fields: bool,
    ) -> Stmt {
        let mut cases: Vec<SwitchCase> = vec![];
        for field in &descriptor.field {
            let read_expr = self.deserialize_field_expr(ctx, field, accessor, false);
            let read_stmt = if field.is_map(ctx) {
                crate::expr_stmt!(read_expr)
            } else if field.is_message() && !field.is_repeated() {
                crate::expr_stmt!(read_expr)
            } else if field.is_packable() {
                crate::if_stmt!(
                    crate::call_expr!(crate::member_expr!("br", "isDelimited")),
                    crate::expr_stmt!(crate::assign_expr!(
                        PatOrExpr::Expr(Box::new(accessor(field))),
                        self.deserialize_field_expr(ctx, field, accessor, false)
                    )),
                    crate::expr_stmt!(crate::call_expr!(
                        crate::member_expr_bare!(accessor(field), "push"),
                        vec![crate::expr_or_spread!(
                            self.deserialize_field_expr(ctx, field, accessor, true)
                        )]
                    ))
                )
            } else if field.is_repeated() && !field.is_packed(ctx) {
                crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr_bare!(accessor(field), "push"),
                    vec![crate::expr_or_spread!(read_expr)]
                ))
            } else {
                crate::expr_stmt!(crate::assign_expr!(
                    PatOrExpr::Expr(Box::new(accessor(field))),
                    read_expr
                ))
            };

            let mut stmts = vec![
                read_stmt,
                Stmt::Break(BreakStmt {
                    label: None,
                    span: DUMMY_SP,
                }),
            ];
            if field.is_message() && !field.is_repeated() {
                stmts.insert(
                    0,
                    crate::expr_stmt!(
                        self.deserialize_message_field_preread_expr(ctx, field, accessor)
                    ),
                )
            }

            cases.push(SwitchCase {
                span: DUMMY_SP,
                test: Some(Box::new(crate::lit_num!(field.number() as f64).into())),
                cons: stmts,
            })
        }
        // illegal zero case
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(Box::new(crate::lit_num!(0.0).into())),
            cons: vec![Stmt::Throw(ThrowStmt {
                span: DUMMY_SP,
                arg: Box::new(crate::new_expr!(
                    quote_ident!("Error").into(),
                    vec![crate::expr_or_spread!(
                        crate::lit_str!("illegal zero tag.").into()
                    )]
                )),
            })],
        });

        // unknown fields

        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: None,
            cons: if add_unknown_fields {
                vec![
                    Stmt::Decl(crate::const_decl!(
                        "prev",
                        crate::call_expr!(crate::member_expr!("br", "getCursor"))
                    )),
                    crate::expr_stmt!(crate::call_expr!(crate::member_expr!("br", "skipField"))),
                    crate::expr_stmt!(crate::call_expr!(
                        crate::member_expr_bare!(
                            crate::member_expr!("this", "#unknown_fields"),
                            "push"
                        ),
                        vec![crate::expr_or_spread!(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("no")),
                                    value: Box::new(crate::call_expr!(crate::member_expr!(
                                        "br",
                                        "getFieldNumber"
                                    )))
                                }))),
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("wireType")),
                                    value: Box::new(crate::call_expr!(crate::member_expr!(
                                        "br",
                                        "getWireType"
                                    )))
                                }))),
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("data")),
                                    value: Box::new(crate::call_expr!(
                                        crate::member_expr!("bytes", "subarray"),
                                        vec![
                                            crate::expr_or_spread!(quote_ident!("prev").into()),
                                            crate::expr_or_spread!(crate::call_expr!(
                                                crate::member_expr!("br", "getCursor")
                                            ))
                                        ]
                                    ))
                                })))
                            ]
                        }))]
                    )),
                ]
            } else {
                // just skip the field.
                vec![crate::expr_stmt!(crate::call_expr!(crate::member_expr!(
                    "br",
                    "skipField"
                )))]
            },
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
