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
    // binary
    fn constructor(&self, ctx: &mut Context, service: &ServiceDescriptorProto) -> Vec<ClassMember>;

    // json for well known types
    fn method(&self, ctx: &mut Context, method: &MethodDescriptorProto) -> Option<ClassMember>;
}

pub mod grpc_web;
pub mod google_protobuf;