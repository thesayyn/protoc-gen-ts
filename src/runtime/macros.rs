macro_rules! argless_expr_call {
    ($left:expr, $right:expr) => {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(quote_ident!($left))),
                prop: MemberProp::Ident(quote_ident!($right)),
            }))),
            args: vec![],
            type_args: None,
        })
    };
}

macro_rules! member {
    ($left:expr, $right:expr) => {
        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(quote_ident!($left))),
            prop: MemberProp::Ident(quote_ident!($right)),
        })
    };
}

pub(crate) use argless_expr_call;   
pub(crate) use member;    