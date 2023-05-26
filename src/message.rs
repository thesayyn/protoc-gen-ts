use crate::context::Context;
use crate::descriptor::DescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, Class, ClassDecl, ClassMember, Constructor, Decl, ExportDecl, Ident, ModuleDecl,
    ModuleItem,
};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for DescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &mut T) -> ModuleItem {
        let mut members: Vec<ClassMember> = Vec::new();

        // members.push(ClassMember::Constructor(
        //     Constructor {
        //         accessibility: None,
        //         body: Some(BlockStmt {
        //             span: DUMMY_SP,
        //             stmts: runtime.constructor_stmts(ctx),
        //         }),
        //         is_optional: false,
        //         params: vec![],
        //         span: DUMMY_SP,
        //         key: swc_ecma_ast::PropName::Ident(Ident {
        //             optional: false,
        //             span: DUMMY_SP,
        //             sym: "constructor".into()
        //         })
        //     }
        // ));

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

        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: Decl::Class(class_decl),
            span: DUMMY_SP,
        }))
    }
}
