use crate::{context::Context, runtime::Runtime};
use swc_ecma_ast::ModuleItem;

pub trait Print<T>
where
    T: Runtime + Sized,
{
    fn print(&self, ctx: &mut Context, runtime: &T) -> Vec<ModuleItem>;
}
