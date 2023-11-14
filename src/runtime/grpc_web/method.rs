use crate::context::Context;
use crate::descriptor::MethodDescriptorProto;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{BlockStmt, ClassMember, ClassMethod, Function, MethodKind, Param, PropName};
use swc_ecma_utils::quote_ident;

use super::GrpcWebRuntime;

impl GrpcWebRuntime {
    pub fn print_method(&self, ctx: &mut Context, method: &MethodDescriptorProto) -> ClassMember {
        let mut params = vec![Param {
            span: DUMMY_SP,
            decorators: vec![],
            pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                id: quote_ident!("req"),
                type_ann: Some(crate::type_annotation!(
                    ctx.lazy_type_ref(method.input_type())
                )),
            }),
        },
        Param {
            span: DUMMY_SP,
            decorators: vec![],
            pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                id: quote_ident!("metadata"),
                type_ann: Some(crate::type_annotation!(
                    ctx.lazy_type_ref(method.input_type())
                )),
            }),
        }];

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!(method.name())),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: false,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: params,
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}
