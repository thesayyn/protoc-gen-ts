use std::vec;

use crate::context::Context;
use crate::descriptor::DescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, Class, ClassDecl, ClassMember, ClassMethod, Decl, ExportDecl, Function, MethodKind,
    ModuleDecl, ModuleItem, PropName,
};
use swc_ecma_utils::quote_ident;

impl DescriptorProto {
    fn print_deserialize<T: Runtime + Sized>(
        &self,
        ctx: &mut Context,
        runtime: &mut T,
    ) -> ClassMember {
        let mut body_stmts = runtime.deserialize_setup(ctx);
        body_stmts.extend(runtime.deserialize_assign_field(ctx, &self));

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
                    stmts: body_stmts,
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
}

impl<T> Print<T> for DescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem> {

        let mut members: Vec<ClassMember> = Vec::new();

        for member in &self.field {
            members.push(member.print_prop(ctx, runtime));
        }

        members.push(self.print_deserialize(ctx, runtime));

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
