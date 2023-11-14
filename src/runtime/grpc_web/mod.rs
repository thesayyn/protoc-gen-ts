use swc_ecma_ast::ClassMember;

use crate::{context::Context, descriptor::ServiceDescriptorProto};

use super::GrpcRuntime;

#[derive(Clone)]
pub struct GrpcWebRuntime {}

impl GrpcWebRuntime {
    pub fn new() -> Self {
        GrpcWebRuntime {}
    }
}

impl GrpcRuntime for GrpcWebRuntime {
    fn constructor(&self, ctx: &mut Context, service: &ServiceDescriptorProto) -> Vec<ClassMember> {
        vec![]
    }

    fn method(
        &self,
        ctx: &mut crate::context::Context,
        method: &crate::descriptor::MethodDescriptorProto,
    ) -> Option<swc_ecma_ast::ClassMember> {
        Some(self.print_method(ctx, method))
    }
}

pub mod method;
