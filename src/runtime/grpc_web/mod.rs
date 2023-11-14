use swc_ecma_ast::ClassMember;

use crate::{context::Context, descriptor::{ServiceDescriptorProto, MethodDescriptorProto}};

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
        ctx: &mut Context,
        method: &MethodDescriptorProto,
        service: &ServiceDescriptorProto
    ) -> Vec<ClassMember> {
        vec![
            self.print_descriptor(ctx, method, service),
            self.print_method(ctx, method, service)
        ]
    }
}

pub mod method;
