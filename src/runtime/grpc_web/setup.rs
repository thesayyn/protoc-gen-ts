use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignOp, BinaryOp, BlockStmt, ClassMember, Constructor, Expr, ObjectLit, Param,
    ParamOrTsParamProp, PatOrExpr, PrivateName, PrivateProp, PropName,
};
use swc_ecma_utils::quote_ident;

use crate::context::Context;

use super::GrpcWebRuntime;

impl GrpcWebRuntime {
    pub fn print_props(&self, ctx: &mut Context) -> Vec<ClassMember> {
        vec![
            ClassMember::PrivateProp(PrivateProp {
                span: DUMMY_SP,
                key: PrivateName {
                    id: quote_ident!("url"),
                    span: DUMMY_SP,
                },
                value: None,
                type_ann: Some(Box::new(crate::type_annotation!("string"))),
                is_static: false,
                decorators: vec![],
                accessibility: None,
                is_optional: false,
                is_override: false,
                readonly: false,
                definite: false,
            }),
            ClassMember::PrivateProp(PrivateProp {
                span: DUMMY_SP,
                key: PrivateName {
                    id: quote_ident!("client"),
                    span: DUMMY_SP,
                },
                value: None,
                type_ann: Some(Box::new(crate::type_annotation!(crate::type_ref!(
                    crate::entity_name_qualified!(
                        ctx.get_import(&ctx.options.grpc_web_package).into(),
                        quote_ident!("GrpcWebClientBase")
                    )
                )))),
                is_static: false,
                decorators: vec![],
                accessibility: None,
                is_optional: false,
                is_override: false,
                readonly: false,
                definite: false,
            }),
        ]
    }
    pub fn print_constructor(&self, ctx: &mut Context) -> ClassMember {
        ClassMember::Constructor(Constructor {
            span: DUMMY_SP,
            accessibility: None,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    crate::expr_stmt!(crate::assign_expr!(
                        PatOrExpr::Expr(Box::new(crate::member_expr!("this", "#url"))),
                        quote_ident!("url").into(),
                        AssignOp::Assign
                    )),
                    crate::expr_stmt!(crate::assign_expr!(
                        PatOrExpr::Expr(Box::new(crate::member_expr!("this", "#client"))),
                        crate::new_expr!(
                            crate::member_expr!(ctx.get_import(&ctx.options.grpc_web_package).into(), "GrpcWebClientBase"),
                            vec![crate::expr_or_spread!(crate::bin_expr!(
                                quote_ident!("options").into(),
                                Expr::Object(ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![]
                                }),
                                BinaryOp::NullishCoalescing
                            ))]
                        ),
                        AssignOp::Assign
                    )),
                ],
            }),
            is_optional: false,
            key: PropName::Ident(quote_ident!("constructor")),
            params: vec![
                ParamOrTsParamProp::Param(Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: crate::pat_ident!(quote_ident!("url"), crate::type_annotation!("string")),
                }),
                ParamOrTsParamProp::Param(Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: crate::pat_ident!(
                        crate::quote_ident_optional!("options"),
                        crate::type_annotation!(crate::type_ref!(crate::entity_name_qualified!(
                            ctx.get_import(&ctx.options.grpc_web_package).into(),
                            quote_ident!("GrpcWebClientBaseOptions")
                        )))
                    ),
                }),
            ],
        })
    }
}
