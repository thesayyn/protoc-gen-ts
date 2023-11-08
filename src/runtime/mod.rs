use crate::{context::Context, descriptor::DescriptorProto};
use swc_ecma_ast::{ClassMember, Stmt};

pub trait Runtime {
    fn deserialize_setup(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Vec<Stmt>;

    fn serialize_setup(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Vec<Stmt>;

    fn from_json(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Option<ClassMember>;
    fn to_json(&self, ctx: &mut Context, descriptor: &DescriptorProto) -> Option<ClassMember>;
}

pub mod google_protobuf;
