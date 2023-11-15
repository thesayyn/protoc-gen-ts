use crate::descriptor::MethodDescriptorProto;
use crate::member_expr;
use crate::{context::Context, descriptor::ServiceDescriptorProto};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, ClassMember, ClassMethod, Function, MethodKind, Param, PrivateName, PrivateProp,
    PropName,
};
use swc_ecma_utils::{quote_ident, quote_str};

use super::GrpcWebRuntime;

impl GrpcWebRuntime {
    pub fn print_descriptor(
        &self,
        ctx: &mut Context,
        method: &MethodDescriptorProto,
        service: &ServiceDescriptorProto,
    ) -> ClassMember {
        let import = ctx.get_import("grpc-web");

        let typ = if method.is_unary() {
            "UNARY"
        } else if method.is_server_stream() {
            "SERVER_STREAMING"
        } else {
            "UNSUPPORTED"
        };

        ClassMember::PrivateProp(PrivateProp {
            span: DUMMY_SP,
            key: PrivateName {
                id: quote_ident!(method.name()),
                span: DUMMY_SP,
            },
            value: Some(Box::new(crate::new_expr!(
                crate::member_expr!(import.clone(), "MethodDescriptor"),
                vec![
                    crate::expr_or_spread!(quote_str!(method.path(ctx, service)).into()),
                    crate::expr_or_spread!(crate::member_expr_bare!(
                        crate::member_expr!(import.clone(), "MethodType"),
                        typ
                    )),
                    crate::expr_or_spread!(ctx.lazy_type_ref(method.input_type()).into()),
                    crate::expr_or_spread!(ctx.lazy_type_ref(method.output_type()).into()),
                    crate::expr_or_spread!(crate::arrow_func_short!(
                        crate::call_expr!(member_expr!("r", "toBinary")),
                        vec![crate::pat_ident!(quote_ident!("r"))]
                    )),
                    crate::expr_or_spread!(crate::member_expr!(
                        ctx.lazy_type_ref(method.output_type()),
                        "fromBinary"
                    ))
                ]
            ))),
            type_ann: None,
            is_static: false,
            decorators: vec![],
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        })
    }
    pub fn print_method(
        &self,
        ctx: &mut Context,
        method: &MethodDescriptorProto,
        service: &ServiceDescriptorProto,
    ) -> ClassMember {
        let import = ctx.get_import("grpc-web");
        let mut metadata = quote_ident!("metadata");
        metadata.optional = true;

        let mut params = vec![
            Param {
                span: DUMMY_SP,
                decorators: vec![],
                pat: crate::pat_ident!(
                    quote_ident!("req"),
                    crate::type_annotation!(ctx.lazy_type_ref(method.input_type()).into())
                ),
            },
            Param {
                span: DUMMY_SP,
                decorators: vec![],
                pat: crate::pat_ident!(
                    metadata,
                    crate::type_annotation!(crate::entity_name_qualified!(
                        import.clone().into(),
                        quote_ident!("Metadata")
                    ))
                ),
            },
        ];

        let mut return_type = None;

        if method.server_streaming() && !method.client_streaming() {
            return_type = Some(Box::new(crate::type_annotation!(
                crate::entity_name_qualified!(import.into(), quote_ident!("ClientReadableStream"))
            )))
        }

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
                params,
                return_type,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}
