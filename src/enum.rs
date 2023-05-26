use crate::{context::Context, descriptor::EnumDescriptorProto, print::Print, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, Expr, Lit, ModuleItem, Number, Stmt, TsEnumDecl, TsEnumMember, TsEnumMemberId,
};
use swc_ecma_utils::quote_ident;

impl<T> Print<T> for EnumDescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, _ctx: &mut Context, _runtime: &mut T) -> swc_ecma_ast::ModuleItem {
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

        ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(Box::new(TsEnumDecl {
            span: DUMMY_SP,
            declare: false,
            is_const: false,
            id: quote_ident!(self.name()),
            members,
        }))))
    }
}
