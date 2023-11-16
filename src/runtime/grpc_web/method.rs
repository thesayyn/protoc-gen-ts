use crate::descriptor::MethodDescriptorProto;
use crate::member_expr;
use crate::{context::Context, descriptor::ServiceDescriptorProto};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BinaryOp, BlockStmt, ClassMember, ClassMethod, Expr, Function, MethodKind, ObjectLit, Param,
    PrivateName, PrivateProp, PropName, TsKeywordTypeKind, TsTypeParamInstantiation,
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
        let import = ctx.get_import(&ctx.options.grpc_web_package);

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
        let import = ctx.get_import(&ctx.options.grpc_web_package);

        let return_type = if method.is_server_stream() {
            crate::type_annotation!(crate::type_ref!(crate::entity_name_qualified!(
                import.clone().into(),
                quote_ident!("ClientReadableStream")
            )))
        } else if method.is_unary() {
            crate::type_annotation!(crate::type_ref!(
                crate::entity_name_ident!("Promise"),
                TsTypeParamInstantiation {
                    params: vec![Box::new(crate::type_ref!(crate::entity_name_ident!(
                        ctx.lazy_type_ref(method.output_type())
                    )))],
                    span: DUMMY_SP
                }
            ))
        } else {
            crate::type_annotation!(crate::keyword_type!(TsKeywordTypeKind::TsNeverKeyword))
        };

        let call_args = vec![
            crate::expr_or_spread!(crate::bin_expr!(
                crate::member_expr!("this", "#url"),
                crate::lit_str!(method.path(ctx, service)).into(),
                BinaryOp::Add
            )),
            crate::expr_or_spread!(quote_ident!("req").into()),
            crate::expr_or_spread!(crate::bin_expr!(
                quote_ident!("metadata").into(),
                Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![]
                }),
                BinaryOp::NullishCoalescing
            )),
            crate::expr_or_spread!(crate::member_expr!("this", format!("#{}", method.name()))),
        ];

        let call_stmt = if method.is_server_stream() {
            crate::return_stmt!(crate::call_expr!(
                crate::member_expr_bare!(crate::member_expr!("this", "#client"), "serverStreaming"),
                call_args
            ))
        } else if method.is_unary() {
            crate::return_stmt!(crate::call_expr!(
                crate::member_expr_bare!(crate::member_expr!("this", "#client"), "thenableCall"),
                call_args
            ))
        } else {
            crate::throw_stmt!(crate::new_expr!(
                quote_ident!("Error").into(),
                vec![crate::expr_or_spread!(crate::lit_str!(format!(
                    "grpc-web does not support this call type. server_streaming: {}, client_streaming: {}",
                    method.server_streaming(),
                    method.client_streaming()
                ))
                .into())]
            ))
        };

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
                    stmts: vec![call_stmt],
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![
                    Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: crate::pat_ident!(
                            quote_ident!("req"),
                            crate::type_annotation!(crate::type_ref!(crate::entity_name_ident!(
                                ctx.lazy_type_ref(method.input_type())
                            )))
                        ),
                    },
                    Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: crate::pat_ident!(
                            crate::quote_ident_optional!("metadata"),
                            crate::type_annotation!(crate::type_ref!(
                                crate::entity_name_qualified!(
                                    import.clone().into(),
                                    quote_ident!("Metadata")
                                )
                            ))
                        ),
                    },
                ],
                return_type: Some(Box::new(return_type)),
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}
