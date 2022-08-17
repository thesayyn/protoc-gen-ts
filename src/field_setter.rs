use descriptor::descriptor::FieldDescriptorProto;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, BlockStmt, ClassMember, ClassMethod, Function, MethodKind, Param, Pat, PropName,
};
use swc_ecma_utils::quote_ident;

pub fn create(descriptor: &FieldDescriptorProto) -> ClassMember {
    ClassMember::Method(ClassMethod {
        span: DUMMY_SP,
        kind: MethodKind::Setter,
        key: PropName::Ident(quote_ident!(descriptor.get_name())),
        function: Function {
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![],
            }),
            params: vec![Param {
                span: DUMMY_SP,
                pat: Pat::Ident(BindingIdent::from(quote_ident!("value"))),
                decorators: vec![],
            }],
            decorators: vec![],
            is_generator: false,
            is_async: false,
            type_params: None,
            return_type: None,
        },
        is_abstract: false,
        is_optional: true,
        is_override: false,
        is_static: false,
        accessibility: None,
    })
}
