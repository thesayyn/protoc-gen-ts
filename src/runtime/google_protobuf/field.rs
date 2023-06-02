use swc_ecma_ast::Expr;
use swc_ecma_utils::quote_ident;

use crate::{descriptor::FieldDescriptorProto, context::Context};


pub type FieldAccessorFn = fn(name: &str) -> Expr;

pub(super) fn this_field_member(name: &str) -> Expr {
    crate::member_expr!("this", name)
}

pub(super) fn bare_field_member(name: &str) -> Expr {
    Expr::Ident(quote_ident!(name))
}

pub(super) fn message_field_member(name: &str) -> Expr {
    crate::member_expr!("message", name)
}

impl FieldDescriptorProto {
    pub(super) fn into_accessor(&self, ctx: &Context) -> FieldAccessorFn {
        if self.is_repeated() && self.is_map(ctx) {
            bare_field_member
        } else if self.is_repeated() && !self.is_packed(ctx) {
            bare_field_member
        } else {
            this_field_member
        }
    }
}