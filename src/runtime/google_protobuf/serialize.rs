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
    pub fn serialize_primitive_field_stmt(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: field::FieldAccessorFn,
    ) -> Stmt {
        crate::expr_stmt!(crate::call_expr!(
            crate::member_expr!("bw", self.rw_function_name("write", false, ctx, field)),
            vec![
                crate::expr_or_spread!(crate::lit_num!(field.number()).into()),
                crate::expr_or_spread!(field_accessor(field.name())),
            ]
        ))
    }

    pub fn serialize_message_field_stmt(
        &self,
        field: &descriptor::FieldDescriptorProto,
        field_accessor: field::FieldAccessorFn,
    ) -> Stmt {
        crate::expr_stmt!(crate::call_expr!(
            crate::member_expr!("bw", "writeBytes"),
            vec![
                crate::expr_or_spread!(crate::lit_num!(field.number()).into()),
                crate::expr_or_spread!(crate::call_expr!(crate::member_expr_bare!(
                    Expr::TsNonNull(TsNonNullExpr {
                        expr: Box::new(field_accessor(field.name())),
                        span: DUMMY_SP
                    }),
                    "serialize"
                ))),
            ]
        ))
    }

    fn serialize_map_field_stmt(
        &self,
        ctx: &mut Context,
        field: &descriptor::FieldDescriptorProto,
    ) -> Stmt {
        let descriptor = ctx
            .get_map_type(field.type_name())
            .expect(format!("can not find the map type {}", field.type_name()).as_str());

        let mut stmts = vec![crate::expr_stmt!(crate::call_expr!(
            crate::member_expr!("bw", "beginSubMessage"),
            vec![crate::expr_or_spread!(
                crate::lit_num!(field.number()).into()
            )]
        ))];

        stmts.append(&mut self.serialize_setup_inner(
            ctx,
            &descriptor,
            field::bare_field_member,
            false,
            false,
        ));

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

            let mut field_stmt: Stmt;
            
            if field.is_message() {
                field_stmt = self.serialize_message_field_stmt(field, field_accessor)
            } else {
                field_stmt = self.serialize_primitive_field_stmt(ctx, field, field_accessor)
            };

            if field.is_map(ctx) {
                field_stmt = self.serialize_map_field_stmt(ctx, field)
            } else if field.is_repeated() && !field.is_packed(ctx) {
                field_stmt = Stmt::ForOf(ForOfStmt {
                    is_await: false,
                    left: ForHead::VarDecl(Box::new(crate::const_decl_uinit!(field.name()))),
                    right: Box::new(accessor(field.name())),
                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![field_stmt],
                    })),
                    span: DUMMY_SP,
                })
            }

            if prevent_defaults {
                stmts.push(crate::if_stmt!(
                    field.default_value_bin_expr(ctx, accessor),
                    Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![field_stmt]
                    })
                ));
            } else {
                stmts.push(field_stmt);
            }
        }

        stmts
    }
}
