use std::vec;

use crate::context::Context;
use crate::descriptor::DescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, BlockStmt, Class, ClassDecl, ClassMember, ClassMethod, Decl, ExportDecl, Expr,
    Function, MethodKind, ModuleDecl, ModuleItem, Param, PrivateName, PrivateProp, PropName, Stmt, ClassProp,
};
use swc_ecma_utils::{quote_ident, quote_str};

impl DescriptorProto {
    fn print_unknown_fields(&self) -> ClassMember {
        ClassMember::PrivateProp(PrivateProp {
            span: DUMMY_SP,
            key: PrivateName {
                id: quote_ident!("unknown_fields"),
                span: DUMMY_SP,
            },
            value: Some(Box::new(Expr::Array(ArrayLit {
                elems: vec![],
                span: DUMMY_SP,
            }))),
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

    fn print_message_type(&self, ctx: &mut Context) -> ClassMember {
        let type_name = ctx.calculate_type_name(self.name());
        ClassMember::ClassProp(ClassProp {
            span: DUMMY_SP,
            key: PropName::Ident(quote_ident!("type")),
            value: Some(Box::new(crate::lit_str!(type_name.trim_start_matches(".")).into())),
            type_ann: None,
            declare: false,
            is_static: true,
            decorators: vec![],
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        })
    }

    fn print_serialize<T: Runtime + Sized>(&self, ctx: &mut Context, runtime: &T) -> ClassMember {
        let mut statements = vec![];

        statements.extend(runtime.serialize_setup(ctx, &self));
        statements.push(crate::return_stmt!(crate::call_expr!(crate::member_expr!(
            "bw",
            "getResultBuffer"
        ))));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("toBinary")),
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

    fn print_deserialize(&self, ctx: &mut Context) -> ClassMember {
        let statements = vec![
            Stmt::Decl(crate::const_decl!(
                "message",
                crate::new_expr!(Expr::Ident(quote_ident!(ctx.normalize_name(self.name()))))
            )),
            crate::expr_stmt!(crate::call_expr!(
                crate::member_expr!("message", "mergeFrom"),
                vec![crate::expr_or_spread!(quote_ident!("bytes").into())]
            )),
            crate::return_stmt!(quote_ident!("message").into()),
        ];

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("fromBinary")),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            is_static: true,
            function: Box::new(Function {
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: statements,
                }),
                decorators: vec![],
                is_async: false,
                is_generator: false,
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                        id: quote_ident!("bytes"),
                        type_ann: Some(crate::type_annotation!("Uint8Array")),
                    }),
                }],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }

    fn print_merge_from<T: Runtime + Sized>(&self, ctx: &mut Context, runtime: &T) -> ClassMember {
        let mut statements = runtime.deserialize_setup(ctx, &self);

        statements.push(crate::return_stmt!(quote_ident!("this").into()));

        ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            accessibility: None,
            key: PropName::Ident(quote_ident!("mergeFrom")),
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
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: vec![],
                    pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                        id: quote_ident!("bytes"),
                        type_ann: Some(crate::type_annotation!("Uint8Array")),
                    }),
                }],
                return_type: None,
                span: DUMMY_SP,
                type_params: None,
            }),
            kind: MethodKind::Method,
        })
    }
}

impl<T> Print<T> for DescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &T) -> Vec<ModuleItem> {
        if self.options.map_entry() {
            return vec![];
        }

        let mut members: Vec<ClassMember> = Vec::new();

        members.push(self.print_message_type(ctx));
        members.push(self.print_unknown_fields());

        for member in self.field.clone() {
            members.push(member.print_prop(ctx, runtime));

            if member.has_oneof_index() {
                let other_oneofs = self.get_oneof_fields(&member);
                members.push(member.print_oneof_getter(ctx, runtime));
                members.push(member.print_oneof_setter(ctx, runtime, &other_oneofs));
            }
        }
        members.push(self.print_merge_from(ctx, runtime));
        members.push(self.print_deserialize(ctx));
        members.push(self.print_serialize(ctx, runtime));

        members.push(
            runtime
                .to_json(ctx, self)
                .unwrap_or_else(|| self.print_to_json(ctx)),
        );
        members.push(
            runtime
                .from_json(ctx, self)
                .unwrap_or_else(|| self.print_from_json(ctx)),
        );

        let class_decl = ClassDecl {
            ident: quote_ident!(ctx.normalize_name(self.name())),
            declare: false,
            class: Box::new(Class {
                span: DUMMY_SP,
                body: members,
                decorators: vec![],
                implements: vec![],
                is_abstract: false,
                type_params: None,
                super_class: None,
                super_type_params: None,
            }),
        };

        let module = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: Decl::Class(class_decl),
            span: DUMMY_SP,
        }));

        let mut modules = vec![module];

        if self.nested_type.len() != 0 || self.enum_type.len() != 0 {
            let mut ctx = ctx.descend(self.name().to_string());
            let mut nested_modules = vec![];

            for nested in &self.nested_type {
                nested_modules.append(&mut nested.print(&mut ctx, runtime));
            }

            for r#enum in &self.enum_type {
                nested_modules.append(&mut r#enum.print(&mut ctx, runtime));
            }

            modules.append(&mut ctx.wrap_if_needed(nested_modules));
        }

        modules
    }
}
