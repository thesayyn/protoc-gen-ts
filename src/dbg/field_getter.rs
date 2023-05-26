use crate::{descriptor::FieldDescriptorProto, print::Context, runtime::Runtime};
use swc_common::{DUMMY_SP};
use swc_ecma_ast::{
    BlockStmt, ReturnStmt, ClassMember, ClassMethod, Function, MethodKind,
    PropName, Stmt,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
    pub fn print_getter<T: Runtime>(&self, ctx: &mut Context, runtime: &mut T) -> ClassMember {
        let return_expr = runtime.getter_expr(ctx, &self);
        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            kind: MethodKind::Getter,
            key: PropName::Ident(quote_ident!(self.name())),
            function: Box::new(
                Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(return_expr))
                            })
                        ],
                    }),
                    params: vec![],
                    decorators: vec![],
                    is_generator: false,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }
            ),
            is_abstract: false,
            is_optional: true,
            is_override: false,
            is_static: false,
            accessibility: None,
        })
    }
}

