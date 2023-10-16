use crate::{context::Context, descriptor::EnumDescriptorProto, print::Print, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, ModuleItem, TsEnumDecl, TsEnumMember, TsEnumMemberId, ModuleDecl, ExportDecl,
};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for EnumDescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, _runtime: &T) -> Vec<ModuleItem> {
        let mut members: Vec<TsEnumMember> = Vec::new();
        for member in &self.value {
            members.push(TsEnumMember {
                span: DUMMY_SP,
                id: TsEnumMemberId::Ident(quote_ident!(member.name())),
                init: Some(Box::new(crate::lit_num!(member.number()).into())),
            })
        }
        let r#enum = Decl::TsEnum(Box::new(
            TsEnumDecl {
                span: DUMMY_SP,
                declare: false,
                is_const: false,
                id: quote_ident!(ctx.normalize_name(self.name())),
                members,
            },
        ));
        let module = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: r#enum,
            span: DUMMY_SP,
        }));

        vec![module]
    }
}
