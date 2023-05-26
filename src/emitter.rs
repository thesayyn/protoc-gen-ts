use crate::context::Context;
use crate::descriptor::FileDescriptorProto;
use crate::namespace;
use crate::print::Print;
use crate::runtime::Runtime;
use swc_ecma_ast::ModuleItem;

pub trait Emittable<T>
where
    T: Runtime + Sized,
{
    fn emit(&self, ctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem>;
}

impl<T> Emittable<T> for FileDescriptorProto
where
    T: Runtime + Sized,
{
    fn emit(&self, ctx: &mut Context, runtime: &mut T) -> Vec<ModuleItem> {

        let namespace = match self.has_package() {
            true => Some(self.package()),
            false => None,
        };
        let mut ctx = ctx.child(namespace);

        eprintln!("{}", self.name());



        let mut body: Vec<ModuleItem> = Vec::new();

        for r#enum in &self.enum_type {
            body.push(r#enum.print(&mut ctx, runtime))
        }

        for message in &self.message_type {
            body.push(message.print(&mut ctx, runtime))
        }

        if self.has_package() && ctx.options.namespaces {
            body = vec![namespace::wrap(self.package(), body)];
        }
        
        ctx.reg_type_ref(".HelpTopic");

        let imports = ctx.drain_imports();
        // prepend imports
        body.splice(0..0, imports);

        body
    }
}
