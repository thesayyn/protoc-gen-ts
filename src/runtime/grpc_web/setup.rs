use swc_common::DUMMY_SP;
use swc_ecma_ast::{ClassMember, Constructor, PropName, BlockStmt, ParamOrTsParamProp, Param};
use swc_ecma_utils::quote_ident;

use crate::context::Context;

use super::GrpcWebRuntime;

impl GrpcWebRuntime {
    pub fn print_constructor(&self, ctx: &mut Context) -> ClassMember {
        let mut stmts = vec![];
        ClassMember::Constructor(Constructor {
            span: DUMMY_SP,
            accessibility: None,
            body: Some(BlockStmt{
                span: DUMMY_SP,
                stmts
            }),
            is_optional: false,
            key: PropName::Ident(quote_ident!("constructor")),
            params: vec![
                ParamOrTsParamProp::Param(
                    Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: crate::pat_ident!(
                            quote_ident!("host"),
                            crate::type_annotation!("string")
                        ),
                    },
                )
            ],
        })
    }
}
