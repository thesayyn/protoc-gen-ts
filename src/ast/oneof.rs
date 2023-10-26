use crate::{
    context::Context,
    descriptor::FieldDescriptorProto,
    runtime::Runtime,
};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, BinaryOp, Bool, ClassMember, ClassProp, Expr, Lit, PropName, TsArrayType,
    TsEntityName, TsKeywordType, TsType, TsTypeAnn, TsTypeParamInstantiation, TsTypeRef, ClassMethod, MethodKind, Function, Param, BindingIdent, Pat, PatOrExpr,
};
use swc_ecma_utils::{quote_ident, quote_str, ExprFactory};

impl FieldDescriptorProto {

    pub fn print_oneof_getter<T: Runtime>(&self, ctx: &mut Context, _runtime: &T) -> ClassMember {
        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            key: quote_ident!(self.name()).into(),
            kind: MethodKind::Getter,
            function: Box::new(
                Function {
                    decorators: vec![],
                    is_async: false,
                    is_generator: false,
                    params: vec![],
                    return_type: self.nullish_type_annotation(ctx),
                    span: DUMMY_SP,
                    type_params: None,
                    body: Some(swc_ecma_ast::BlockStmt { span: DUMMY_SP, stmts: vec![
                        crate::return_stmt!(crate::member_expr!("this", self.prop_name()))
                    ] })
                }
            ),
            is_static: false,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        })
    }

    pub fn print_oneof_setter<T: Runtime>(&self, ctx: &mut Context, _runtime: &T, others: &Vec<FieldDescriptorProto>) -> ClassMember {

        let mut members = vec![];
        for other in others {
            members.push(
                crate::expr_stmt!(crate::assign_expr!(
                    crate::member_expr!("this", other.prop_name()).as_pat_or_expr(),
                    quote_ident!("undefined").into()
                ))
            )
        }
        members.push(
            crate::expr_stmt!(crate::assign_expr!(
                crate::member_expr!("this", self.prop_name()).as_pat_or_expr(),
                quote_ident!("value").into()
            ))
        );
        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            key: quote_ident!(self.name()).into(),
            kind: MethodKind::Setter,
            function: Box::new(
                Function {
                    decorators: vec![],
                    is_async: false,
                    is_generator: false,
                    return_type: None,
                    params: vec![
                        Param {
                        
                            span: DUMMY_SP,
                            decorators: vec![],
                            pat: Pat::Ident(BindingIdent{
                                id: quote_ident!("value"),
                                type_ann: self.nullish_type_annotation(ctx) 
                            })
                        }
                    ],
                    span: DUMMY_SP,
                    type_params: None,
                    body: Some(swc_ecma_ast::BlockStmt { span: DUMMY_SP, stmts: members })
                }
            ),
            is_static: false,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        })
    }
}
