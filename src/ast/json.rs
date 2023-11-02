use std::vec;

use crate::descriptor::DescriptorProto;
use crate::{context::Context, descriptor::FieldDescriptorProto};

use convert_case::{Case, Casing};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, ClassMember, ClassMethod, Expr, Function, MethodKind, ObjectLit, PatOrExpr,
    PropName, Stmt,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
    pub fn json_key_name(&self) -> String {
        if self.has_json_name() {
            self.json_name().to_string()
        } else {
            self.name().to_case(Case::Camel)
        }
    }
}

impl DescriptorProto {
    pub(super) fn print_to_json(&self, ctx: &mut Context) -> ClassMember {
        let mut statements = vec![Stmt::Decl(crate::const_decl!(
            "json",
            Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![]
            })
        ))];

        for field in self.field.clone() {
            let mut value_expr = crate::member_expr!("this", field.name());

            if field.is_enum() {
                value_expr = crate::member_expr_computed!(
                    ctx.lazy_type_ref(field.type_name()).into(),
                    value_expr
                )
            }

            statements.push(crate::if_stmt!(
                field.default_value_bin_expr(ctx, super::field::this_field_member),
                crate::expr_stmt!(crate::assign_expr!(
                    PatOrExpr::Expr(Box::new(crate::member_expr!("json", field.json_key_name()))),
                    value_expr
                ))
            ))
        }

        statements.push(crate::return_stmt!(quote_ident!("json").into()));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("toJson")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: false,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}
