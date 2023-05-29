use swc_ecma_ast::Stmt;
use crate::{context::Context, descriptor::DescriptorProto};

pub trait Runtime {
    fn deserialize_setup(&self, ctx: &mut Context) -> Vec<Stmt>;
    fn deserialize_assign_field(
        &self,
        ctx: &mut Context,
        descriptor: &DescriptorProto,
    ) -> Vec<Stmt>;
}

pub mod google_protobuf;
pub mod macros;