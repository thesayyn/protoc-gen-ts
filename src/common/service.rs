use crate::context::Context;
use crate::descriptor::ServiceDescriptorProto;
use crate::print::Print;
use crate::runtime::GrpcRuntime;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{Class, ClassDecl, ClassMember, Decl, ExportDecl, ModuleDecl, ModuleItem};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for ServiceDescriptorProto
where
    T: GrpcRuntime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &T) -> Vec<ModuleItem> {
        let mut members: Vec<ClassMember> = Vec::new();

        for method in &self.method {
            members.push(runtime.method(ctx, method).unwrap())
        }
        vec![ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: Decl::Class(ClassDecl {
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
            }),
            span: DUMMY_SP,
        }))]
    }
}
