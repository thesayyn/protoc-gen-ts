
use protobuf::descriptor::DescriptorProto;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, Class, ClassDecl, ClassMember, ClassMethod, Decl, Function, MethodKind, ModuleItem,
    PropName, Stmt,
};
use swc_ecma_utils::quote_ident;
use crate::field_getter;
use crate::field_setter;

pub fn create(descriptor: &DescriptorProto) -> ModuleItem {
    let mut members: Vec<ClassMember> = Vec::new();

    for member in descriptor.get_field() {
        members.push(field_getter::create(member));
        members.push(field_setter::create(member));
    }

    ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
        ident: quote_ident!(descriptor.get_name()),
        declare: false,
        class: Class {
            span: DUMMY_SP,
            body: members,
            decorators: vec![],
            implements: vec![],
            is_abstract: false,
            type_params: None,
            super_class: None,
            super_type_params: None,
        },
    })))
}
