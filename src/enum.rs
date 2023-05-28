use crate::{context::Context, descriptor::EnumDescriptorProto, print::Print, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, Expr, Lit, ModuleItem, Number, TsEnumDecl, TsEnumMember, TsEnumMemberId, ModuleDecl, ExportDecl,
};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for EnumDescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, _runtime: &mut T) -> Vec<ModuleItem> {
        ctx.register_type_name(self.name());
        let mut members: Vec<TsEnumMember> = Vec::new();
        for member in &self.value {
            members.push(TsEnumMember {
                span: DUMMY_SP,
                id: TsEnumMemberId::Ident(quote_ident!(member.name())),
                init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: member.number() as f64,
                    raw: None,
                })))),
            })
        }
        let r#enum = Decl::TsEnum(Box::new(
            TsEnumDecl {
                span: DUMMY_SP,
                declare: false,
                is_const: false,
                id: quote_ident!(ctx.normalize_type_name(self.name())),
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
