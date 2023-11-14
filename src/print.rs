use crate::context::Context;
use swc_ecma_ast::ModuleItem;

pub trait Print<T>
where
    T: Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &T) -> Vec<ModuleItem>;
}
