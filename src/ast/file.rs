use crate::context::{Context, self};
use crate::descriptor::FileDescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_ecma_ast::ModuleItem;
 
impl<T> Print<T> for FileDescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem> {
        let mut ctx = context::descend_if_necessary!(ctx, self);

        let mut modules: Vec<ModuleItem> = Vec::new();

        for r#enum in &self.enum_type {
            modules.append(&mut r#enum.print(&mut ctx, runtime))
        }

        for message in &self.message_type {
            modules.append(&mut message.print(&mut ctx, runtime))
        }

        let mut modules = ctx.wrap_if_needed(modules);

        let imports = ctx.drain_imports();
        // prepend imports
        modules.splice(0..0, imports);

        modules
    }
}
