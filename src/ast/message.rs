use std::vec;

use crate::{context::Context, descriptor::FieldDescriptorProto};
use crate::descriptor::DescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, Class, ClassDecl, ClassMember, ClassMethod, Decl, ExportDecl, Expr, Function,
    MethodKind, ModuleDecl, ModuleItem, Param, PropName, Stmt
};
use swc_ecma_utils::quote_ident;

impl DescriptorProto {
    fn print_serialize<T: Runtime + Sized>(
        &self,
        ctx: &mut Context,
        runtime: &T,
    ) -> ClassMember {

        let mut statements = vec![];

        statements.extend(runtime.serialize_setup(ctx, &self));
        statements.push(crate::return_stmt!(crate::call_expr!(crate::member_expr!("bw", "getResultBuffer"))));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("serialize")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: false,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }

    fn print_deserialize<T: Runtime + Sized>(
        &self,
        ctx: &mut Context,
        runtime: &T,
    ) -> ClassMember {

        let message_const_init = crate::new_expr!(Expr::Ident(quote_ident!(ctx.normalize_name(self.name()))));
        let message_const = crate::const_decl!("message", message_const_init);

        let mut statements = vec![Stmt::Decl(message_const)];

        statements.extend(runtime.deserialize_setup(ctx, &self));
        statements.push(crate::return_stmt!(Expr::Ident(quote_ident!("message"))));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("deserialize")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: true,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                        id: quote_ident!("bytes"),
                        type_ann: Some(crate::type_annotation!("Uint8Array")),
                    }),
                }],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }

    pub fn get_oneof_fields(&self, index: i32, exclude: usize) -> Vec<FieldDescriptorProto> {
        let mut fields = vec![];
        for (i, field) in self.field.clone().into_iter().enumerate() {
            if i == exclude || field.oneof_index() != index {
                continue;
            }
            fields.push(field)
        }
        fields
    }
}

impl<T> Print<T> for DescriptorProto
where
    T: Runtime + Sized,
{   

    fn print(&self, ctx: &mut Context, runtime: &T) -> Vec<ModuleItem> {

        if self.options.map_entry() {
            return vec![]
        }

        let mut members: Vec<ClassMember> = Vec::new();

        for (i, member) in self.field.clone().into_iter().enumerate() {
            members.push(member.print_prop(ctx, runtime));
            
            if member.has_oneof_index() {
                let other_oneofs = self.get_oneof_fields(member.oneof_index(), i);
                members.push(member.print_oneof_getter(ctx, runtime));
                members.push(member.print_oneof_setter(ctx, runtime, &other_oneofs));
            }
        }

        members.push(self.print_deserialize(ctx, runtime));
        members.push(self.print_serialize(ctx, runtime));
        
        let class_decl = ClassDecl {
            ident: quote_ident!(ctx.normalize_name(self.name())),
            declare: false,
            class: Box::new(Class {
                span: DUMMY_SP,
                body: members,
                decorators: vec![],
                implements: vec![],
                is_abstract: false,
                type_params: None,
                super_class: None,
                super_type_params: None,
            }),
        };

        let module = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: Decl::Class(class_decl),
            span: DUMMY_SP,
        }));

        let mut modules = vec![module];

        if self.nested_type.len() != 0 || self.enum_type.len() != 0 {
            let mut ctx = ctx.descend(self.name().to_string());
            let mut nested_modules = vec![];

            for nested in &self.nested_type {
                nested_modules.append(&mut nested.print(&mut ctx, runtime));
            }

            for r#enum in &self.enum_type {
                nested_modules.append(&mut r#enum.print(&mut ctx, runtime));
            }

            modules.append(&mut ctx.wrap_if_needed(nested_modules));
        }

        modules
    }
}
