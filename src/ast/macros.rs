#[macro_export]
macro_rules! call_expr {
    ($expr:expr) => {
        $crate::call_expr!($expr, vec![])
    };
    ($expr:expr, $args:expr) => {
        swc_ecma_ast::Expr::Call(swc_ecma_ast::CallExpr {
            span: swc_common::DUMMY_SP,
            callee: swc_ecma_ast::Callee::Expr(Box::new($expr)),
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
            obj: Box::new(swc_ecma_ast::Expr::Ident($left)),
            prop: swc_ecma_ast::MemberProp::Ident(swc_ecma_utils::quote_ident!($right)),
        })
    };
}

#[macro_export]
macro_rules! member_expr_bare {
    ($left:expr, $right:literal) => {
        swc_ecma_ast::Expr::Member(swc_ecma_ast::MemberExpr {
            span: swc_common::DUMMY_SP,
            obj: Box::new($left),
            prop: swc_ecma_ast::MemberProp::Ident(swc_ecma_utils::quote_ident!($right)),
        })
    };
}

#[macro_export]
macro_rules! member_expr_computed {
    ($left:expr, $right:expr) => {
        swc_ecma_ast::Expr::Member(swc_ecma_ast::MemberExpr {
            span: swc_common::DUMMY_SP,
            obj: Box::new($left),
            prop: swc_ecma_ast::MemberProp::Computed(swc_ecma_ast::ComputedPropName {
                span: DUMMY_SP,
                expr: Box::new($right),
            }),
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
macro_rules! pat_ident {
    ($name:expr) => {
        swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
            id: swc_ecma_utils::quote_ident!($name),
            type_ann: None,
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
                name: crate::pat_ident!($name),
                init: Some(Box::new($init)),
                span: DUMMY_SP,
            }],
            span: DUMMY_SP,
        }))
    };
}

#[macro_export]
macro_rules! const_decl_uinit {
    ($name:expr) => {
        swc_ecma_ast::VarDecl {
            kind: swc_ecma_ast::VarDeclKind::Const,
            declare: false,
            decls: vec![swc_ecma_ast::VarDeclarator {
                definite: false,
                name: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_utils::quote_ident!($name),
                    type_ann: None,
                }),
                init: None,
                span: DUMMY_SP,
            }],
            span: DUMMY_SP,
        }
    };
}

#[macro_export]
macro_rules! let_decl {
    ($name:expr) => {
        crate::let_decl!($name, None, None,)
    };
    ($name:expr, $type:expr) => {
        crate::let_decl!($name, $type, None,)
    };
    ($name:expr, $type:expr, $init:expr) => {
        crate::let_decl!($name, $type, Some(Box::new($init)),)
    };
    ($name:expr, $type:expr, $init:expr,) => {
        swc_ecma_ast::Decl::Var(Box::new(swc_ecma_ast::VarDecl {
            kind: swc_ecma_ast::VarDeclKind::Let,
            declare: false,
            decls: vec![swc_ecma_ast::VarDeclarator {
                definite: false,
                name: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_utils::quote_ident!($name),
                    type_ann: $type,
                }),
                init: $init,
                span: DUMMY_SP,
            }],
            span: DUMMY_SP,
        }))
    };
}

#[macro_export]
macro_rules! binding_ident {
    ($name:literal) => {
        swc_ecma_ast::Pat::Ident(BindingIdent {
            id: swc_ecma_utils::quote_ident!($name),
            type_ann: None,
        })
    };
}

#[macro_export]
macro_rules! array_var_decl {
    ($elems:expr) => {
        VarDecl {
            declare: false,
            kind: swc_ecma_ast::VarDeclKind::Const,
            span: DUMMY_SP,
            decls: vec![swc_ecma_ast::VarDeclarator {
                definite: false,
                init: None,
                name: swc_ecma_ast::Pat::Array(swc_ecma_ast::ArrayPat {
                    optional: false,
                    type_ann: None,
                    elems: $elems,
                    span: DUMMY_SP,
                }),
                span: DUMMY_SP,
            }],
        }
    };
}

#[macro_export]
macro_rules! new_expr {
    ($callee:expr) => {
        $crate::new_expr!($callee, None, never)
    };
    ($callee:expr, $args:expr) => {
        $crate::new_expr!($callee, Some($args), never)
    };
    ($callee:expr, $args:expr, never) => {
        swc_ecma_ast::Expr::New(swc_ecma_ast::NewExpr {
            span: DUMMY_SP,
            callee: Box::new($callee),
            args: $args,
            type_args: None,
        })
    };
}

#[macro_export]
macro_rules! return_stmt {
    ($expr:expr) => {
        swc_ecma_ast::Stmt::Return(swc_ecma_ast::ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new($expr)),
        })
    };
}

#[macro_export]
macro_rules! type_annotation {
    ($lit:literal) => {
        Box::new(swc_ecma_ast::TsTypeAnn {
            span: swc_common::DUMMY_SP,
            type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
                span: swc_common::DUMMY_SP,
                type_name: swc_ecma_ast::TsEntityName::Ident(quote_ident!($lit)),
                type_params: None,
            })),
        })
    };
}

#[macro_export]
macro_rules! expr_or_spread {
    ($expr:expr, $spread:literal) => {
        swc_ecma_ast::ExprOrSpread {
            expr: Box::new($expr),
            spread: Some(DUMMY_SP),
        }
    };
    ($expr:expr) => {
        swc_ecma_ast::ExprOrSpread {
            expr: Box::new($expr),
            spread: None,
        }
    };
}

#[macro_export]
macro_rules! arrow_func {
    ($params:expr, $stmts:expr) => {
        swc_ecma_ast::Expr::Arrow(swc_ecma_ast::ArrowExpr {
            is_async: false,
            is_generator: false,
            params: $params,
            return_type: None,
            span: DUMMY_SP,
            type_params: None,
            body: Box::new(swc_ecma_ast::BlockStmtOrExpr::BlockStmt(
                swc_ecma_ast::BlockStmt {
                    span: DUMMY_SP,
                    stmts: $stmts,
                },
            )),
        })
    };
}

#[macro_export]
macro_rules! arrow_func_short {
    ($expr:expr) => {
        crate::arrow_func_short!($expr, vec![])
    };
    ($expr:expr, $params:expr) => {
        swc_ecma_ast::Expr::Arrow(swc_ecma_ast::ArrowExpr {
            is_async: false,
            is_generator: false,
            params: $params,
            return_type: None,
            span: DUMMY_SP,
            type_params: None,
            body: Box::new(swc_ecma_ast::BlockStmtOrExpr::Expr(Box::new($expr))),
        })
    };
}

#[macro_export]
macro_rules! expr_stmt {
    ($expr:expr) => {
        swc_ecma_ast::Stmt::Expr(swc_ecma_ast::ExprStmt {
            span: DUMMY_SP,
            expr: Box::new($expr),
        })
    };
}

#[macro_export]
macro_rules! block_stmt {
    ($stmts:expr) => {
        swc_ecma_ast::Stmt::Block(swc_ecma_ast::BlockStmt {
            span: DUMMY_SP,
            stmts: $stmts
        })
    };
}


#[macro_export]
macro_rules! assign_expr {
    ($left:expr, $right:expr) => {
        crate::assign_expr!($left, $right, swc_ecma_ast::AssignOp::Assign)
    };
    ($left:expr, $right:expr, $op:expr) => {
        swc_ecma_ast::Expr::Assign(swc_ecma_ast::AssignExpr {
            span: DUMMY_SP,
            op: $op,
            left: $left,
            right: Box::new($right),
        })
    };
}

#[macro_export]
macro_rules! lit_num {
    ($lit:expr) => {
        swc_ecma_ast::Lit::Num(swc_ecma_ast::Number {
            span: DUMMY_SP,
            value: $lit as f64,
            raw: None,
        })
    };
}

#[macro_export]
macro_rules! lit_bigint {
    ($lit:expr) => {
        swc_ecma_ast::Lit::BigInt(swc_ecma_ast::BigInt {
            span: DUMMY_SP,
            value: Box::new($lit),
            raw: None,
        })
    };
}

#[macro_export]
macro_rules! lit_str {
    ($lit:expr) => {
        swc_ecma_ast::Lit::Str(swc_ecma_utils::quote_str!($lit))
    };
}

#[macro_export]
macro_rules! lit_bool {
    ($lit:expr) => {
        swc_ecma_ast::Lit::Bool($lit.into())
    };
}

#[macro_export]
macro_rules! bin_expr {
    ($left:expr, $right:expr) => {
        crate::bin_expr!($left, $right, swc_ecma_ast::BinaryOp::LogicalAnd)
    };
    ($left:expr, $right:expr, $op:expr) => {
        swc_ecma_ast::Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: $op,
            left: Box::new($left),
            right: Box::new($right),
        })
    };
}

#[macro_export]
macro_rules! chain_bin_exprs_or {
    ($e1:expr, $e2:expr) => {
        crate::bin_expr!($e1, $e2, BinaryOp::LogicalOr)
    };
    ($e1:expr, $e2:expr, $($rest:tt)*) => {
        crate::chain_bin_exprs_or! { crate::bin_expr!($e1, $e2, BinaryOp::LogicalOr), $($rest)* }
    };
}

#[macro_export]
macro_rules! chain_bin_exprs_and {
    ($e1:expr, $e2:expr) => {
        crate::bin_expr!($e1, $e2)
    };
    ($e1:expr, $e2:expr, $($rest:tt)*) => {
        crate::chain_bin_exprs_and! { crate::bin_expr!($e1, $e2), $($rest)* }
    };
}

#[macro_export]
macro_rules! paren_expr {
    ($expr:expr) => {
        swc_ecma_ast::Expr::Paren(swc_ecma_ast::ParenExpr {
            span: DUMMY_SP,
            expr: Box::new($expr)
        })
    };
}



#[macro_export]
macro_rules! if_stmt {
    ($test:expr, $consequence:expr) => {
        crate::if_stmt!($test, $consequence, None, true)
    };
    ($test:expr, $consequence:expr, $alt:expr) => {
        crate::if_stmt!($test, $consequence, Some(Box::new($alt)), true)
    };
    ($test:expr, $consequence:expr, $alt:expr, $_:literal) => {
        swc_ecma_ast::Stmt::If(swc_ecma_ast::IfStmt {
            test: Box::new($test),
            cons: Box::new($consequence),
            span: DUMMY_SP,
            alt: $alt,
        })
    };
}
