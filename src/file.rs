use crate::context::Context;
use crate::descriptor::FileDescriptorProto;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_ecma_ast::ModuleItem;
 
impl<T> Print<T> for FileDescriptorProto
where
    T: Runtime + Sized,
{
    fn print(&self, pctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem> {
    
        let mut dctx = pctx.descend(self.package().to_string());
        
        let ctx = match self.has_package() {
            true => &mut dctx,
            false => pctx
        };

        let mut modules: Vec<ModuleItem> = Vec::new();

        for r#enum in &self.enum_type {
            modules.append(&mut r#enum.print(ctx, runtime))
        }

        for message in &self.message_type {
            modules.append(&mut message.print(ctx, runtime))
        }

        let mut modules = ctx.wrap_if_needed(modules);

        let imports = ctx.drain_imports();
        // prepend imports
        modules.splice(0..0, imports);

        modules
    }
}
