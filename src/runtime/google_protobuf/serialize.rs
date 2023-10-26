use super::GooglePBRuntime;
use crate::ast::field;
use crate::{context::Context, descriptor};

use std::vec;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, BlockStmt, Expr, ForHead, ForOfStmt, Stmt, TsNonNullExpr, VarDecl,
};
use swc_ecma_utils::quote_ident;

impl GooglePBRuntime {
    pub fn serialize_primitive_field_stmts(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: field::FieldAccessorFn,
    ) -> Vec<Stmt> {
        vec![crate::expr_stmt!(crate::call_expr!(
            crate::member_expr!("bw", self.rw_function_name("write", false, ctx, field)),
            vec![
                crate::expr_or_spread!(crate::lit_num!(field.number()).into()),
                crate::expr_or_spread!(field_accessor(field.name())),
            ]
        ))]
    }

    pub fn serialize_message_field_stmts(
        &self,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: field::FieldAccessorFn,
    ) -> Vec<Stmt> {
        vec![
            Stmt::Decl(crate::const_decl!(
                "result",
                crate::call_expr!(crate::member_expr_bare!(
                    Expr::TsNonNull(TsNonNullExpr {
                        expr: Box::new(field_accessor(field.name())),
                        span: DUMMY_SP
                    }),
                    "serialize"
                ))
            )),
            crate::expr_stmt!(crate::call_expr!(
                crate::member_expr!("bw", "writeSerializedMessage"),
                vec![
                    crate::expr_or_spread!(quote_ident!("result").into()),
                    crate::expr_or_spread!(crate::lit_num!(0).into()),
                    crate::expr_or_spread!(crate::member_expr!("result", "length")),
                ]
            )),
        ]
    }
}

impl GooglePBRuntime {
    pub(super) fn serialize_setup_inner(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
        accessor: field::FieldAccessorFn,
        create_bw: bool,
        prevent_defaults: bool,
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
            let write_stmts = if field.is_message() {
                self.serialize_message_field_stmts(field, field_accessor)
            } else {
                self.serialize_primitive_field_stmts(ctx, field, field_accessor)
            };

            let write_stmt = if field.is_map(ctx) {
                let descriptor = ctx
                    .get_map_type(field.type_name())
                    .expect(format!("can not find the map type {}", field.type_name()).as_str());
                let mut stmts = vec![crate::expr_stmt!(crate::call_expr!(
                    crate::member_expr!("bw", "beginSubMessage"),
                    vec![crate::expr_or_spread!(
                        crate::lit_num!(field.number()).into()
                    )]
                ))];
                let mut inner_stmts = self.serialize_setup_inner(
                    ctx,
                    &descriptor,
                    field::bare_field_member,
                    false,
                    false,
                );
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
                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: write_stmts,
                    })),
                    span: DUMMY_SP,
                })
            } else {
                Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: write_stmts,
                })
            };

            if prevent_defaults {
                stmts.push(crate::if_stmt!(
                    field.default_value_bin_expr(ctx, accessor),
                    write_stmt
                ));
            } else {
                stmts.push(write_stmt);
            }
        }

        stmts
    }
}
