ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
    span: DUMMY_SP,
    declare: false,
    kind: VarDeclKind::Const,
    decls: vec![VarDeclarator {
        span: DUMMY_SP,
        name: Pat::Ident(BindingIdent::from(quote_ident!("test"))),
        init: Some(Box::new(Expr::Lit(Lit::Str(quote_str!("hehehehehe"))))),
        definite: false,
    }],
})))