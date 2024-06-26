use crate::{context::Context, descriptor::{DescriptorProto, MethodDescriptorProto, ServiceDescriptorProto}};
use swc_ecma_ast::{ClassMember, Stmt};

pub trait Runtime {
    // binary
    fn from_binary(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Vec<Stmt>;
    fn to_binary(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Vec<Stmt>;

    // json for well known types
    fn from_json(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Option<ClassMember>;
    fn to_json(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Option<ClassMember>;
}

pub trait GrpcRuntime {
    fn print_setup(&self, ctx: &mut Context) -> Vec<ClassMember>;

    // json for well known types
    fn print_method(&self, ctx: &mut Context, method: &MethodDescriptorProto, svc: &ServiceDescriptorProto) -> Vec<ClassMember>;
}

pub mod grpc_web;
pub mod google_protobuf;