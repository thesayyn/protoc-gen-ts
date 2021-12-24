use protobuf::descriptor::FieldDescriptorProto;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Expr, BlockStmt, Lit, ReturnStmt, ClassMember, ClassMethod, Function, MethodKind,
    Bool, Pat, PropName, Stmt,
};
use swc_ecma_utils::quote_ident;

pub fn create(descriptor: &FieldDescriptorProto) -> ClassMember {
    ClassMember::Method(ClassMethod {
        span: DUMMY_SP,
        kind: MethodKind::Getter,
        key: PropName::Ident(quote_ident!(descriptor.get_name())),
        function: Function {
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Lit(Lit::Bool(Bool{span: DUMMY_SP, value: false}))))
                    })
                ],
            }),
            params: vec![],
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
