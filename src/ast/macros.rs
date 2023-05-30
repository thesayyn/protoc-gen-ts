#[macro_export]
macro_rules! call_expr {
    ($expr:expr) => {
        $crate::call_expr!($expr, vec![])
    };
    ($expr:expr, $args:expr) => {
        swc_ecma_ast::Expr::Call( swc_ecma_ast::CallExpr {
            span: swc_common::DUMMY_SP,
            callee: swc_ecma_ast::Callee::Expr(Box::new(
                $expr
            )),
            args: $args,
            type_args: None,
        })
    };
}


#[macro_export]
macro_rules! member_expr {
    ($left:literal, $right:expr) => {
       $crate::member_expr!(swc_ecma_utils::quote_ident!($left), $right)
    };
    ($left:expr, $right:expr) => {
        swc_ecma_ast::Expr::Member(swc_ecma_ast::MemberExpr {
            span: swc_common::DUMMY_SP,
            obj: Box::new(
                swc_ecma_ast::Expr::Ident($left)
            ),
            prop: swc_ecma_ast::MemberProp::Ident(swc_ecma_utils::quote_ident!($right)),
        })
    };

}

#[macro_export]
macro_rules! unary_expr {
    ($arg:expr) => {
        swc_ecma_ast::Expr::Unary(swc_ecma_ast::UnaryExpr {
            span: swc_common::DUMMY_SP,
            op: swc_ecma_ast::UnaryOp::Bang,
            arg: Box::new($arg),
        })
    };
}


#[macro_export]
macro_rules! const_decl {
    ($name:expr, $init:expr) => {
        swc_ecma_ast::Decl::Var(Box::new(swc_ecma_ast::VarDecl {
            kind: swc_ecma_ast::VarDeclKind::Const,
            declare: false,
            decls: vec![swc_ecma_ast::VarDeclarator {
                definite: false,
                name: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_utils::quote_ident!($name),
                    type_ann: None,
                }),
                init: $init,
                span: DUMMY_SP,
            }],
            span: DUMMY_SP,
        }))
    };
}

#[macro_export]
macro_rules! new_expr {
    ($callee:expr) => {
        $crate::new_expr!($callee, None)
    };
    ($callee:expr, $args:expr) => {
        Box::new(swc_ecma_ast::Expr::New( swc_ecma_ast::NewExpr {
            span: DUMMY_SP,
            callee: Box::new($callee),
            args: $args,
            type_args: None,
        }))
    };
}

#[macro_export]
macro_rules! return_stmt {
    ($expr:expr) => {
        swc_ecma_ast::Stmt::Return(swc_ecma_ast::ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new($expr))
        })
    };
}


#[macro_export]
macro_rules! type_annotation {
    ($lit:literal) => {
        Box::new(TsTypeAnn {
            span: swc_common::DUMMY_SP,
            type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(TsTypeRef{
                span: swc_common::DUMMY_SP,
                type_name: swc_ecma_ast::TsEntityName::Ident(quote_ident!($lit)),
                type_params: None
            })),
        })
    };
}



