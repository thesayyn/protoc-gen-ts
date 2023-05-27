use crate::{descriptor::FieldDescriptorProto, print::Context, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, BlockStmt, ClassMember, ClassMethod, Function, MethodKind, Param, Pat, PropName, Stmt, ExprStmt,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
    pub fn print_setter<T: Runtime>(&self, ctx: &mut Context, runtime: &mut T) -> ClassMember {
        let expr = runtime.setter_expr(ctx, &self);
        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            kind: MethodKind::Setter,
            key: PropName::Ident(quote_ident!(self.name())),
            function: Box::new(Function {
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        Stmt::Expr(
                            ExprStmt {
                                expr: Box::new(expr),
                                span: DUMMY_SP
                            }
                        )
                    ],
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
            }),
            is_abstract: false,
            is_optional: true,
            is_override: false,
            is_static: false,
            accessibility: None,
        })
    }
}
