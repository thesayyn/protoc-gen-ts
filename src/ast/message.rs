use crate::context::Context;
use crate::descriptor::DescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{Class, ClassDecl, ClassMember, Decl, ExportDecl, ModuleDecl, ModuleItem};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for DescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem> {
        ctx.register_type_name(self.name());
 
        let mut members: Vec<ClassMember> = Vec::new();

        for member in &self.field {
            members.push(member.print_prop(ctx, runtime));
        }

        let class_decl = ClassDecl {
            ident: quote_ident!(ctx.normalize_type_name(self.name())),
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
                ctx.register_type_name(nested.name());
                nested_modules.append(&mut nested.print(&mut ctx, runtime));
            }

            for r#enum in &self.enum_type {
                ctx.register_type_name(r#enum.name());
                nested_modules.append(&mut r#enum.print(&mut ctx, runtime));
            }


            modules.append(&mut ctx.wrap_if_needed(nested_modules));
        }

        modules
    }
}
