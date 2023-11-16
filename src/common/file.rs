use crate::context::{self, Context};
use crate::descriptor::FileDescriptorProto;
use crate::print::Print;
use crate::runtime::{GrpcRuntime, Runtime};
use swc_ecma_ast::ModuleItem;

impl FileDescriptorProto {
    pub fn print<RT: Runtime + Sized, GR: GrpcRuntime + Sized>(
        &self,
        ctx: &mut Context,
        runtime: &RT,
        grpc_runtime: &GR,
    ) -> Vec<ModuleItem> {
        let mut ctx = context::descend_if_necessary!(ctx, self);

        let mut modules: Vec<ModuleItem> = Vec::new();

        for r#enum in &self.enum_type {
            modules.append(&mut r#enum.print(&mut ctx, runtime))
        }

        for message in &self.message_type {
            modules.append(&mut message.print(&mut ctx, runtime))
        }

        for service in &self.service {
            modules.append(&mut service.print(&mut ctx, grpc_runtime))
        }

        let mut modules = ctx.wrap_if_needed(modules);

        let imports = ctx.drain_imports();
        // prepend imports
        modules.splice(0..0, imports);

        modules
    }
}
