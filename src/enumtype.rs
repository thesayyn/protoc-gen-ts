use descriptor::descriptor::EnumDescriptorProto;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, Expr, Lit, ModuleItem, Number, Stmt, TsEnumDecl, TsEnumMember, TsEnumMemberId,
};
use swc_ecma_utils::quote_ident;

pub fn ast(descriptor: &EnumDescriptorProto) -> ModuleItem {
    let mut members: Vec<TsEnumMember> = Vec::new();

    for member in descriptor.get_value() {
        members.push(TsEnumMember {
            span: DUMMY_SP,
            id: TsEnumMemberId::Ident(quote_ident!(member.get_name())),
            init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: member.get_number() as f64,
            })))),
        })
    }

    ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(TsEnumDecl {
        span: DUMMY_SP,
        declare: false,
        is_const: false,
        id: quote_ident!(descriptor.get_name()),
        members,
    })))
}
