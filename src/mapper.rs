use crate::{
    context::{self, Context, Syntax},
    descriptor::{DescriptorProto, EnumDescriptorProto, FileDescriptorProto},
    plugin::CodeGeneratorRequest,
};

pub trait Mapper {
    fn map(&self, ctx: &mut Context);
}

impl Mapper for CodeGeneratorRequest {
    fn map(&self, ctx: &mut Context) {
        for file in &self.proto_file {
            let mut ctx = ctx.fork(file.name().to_string(), &Syntax::Unspecified);
            file.map(&mut ctx)
        }
    }
}

impl Mapper for FileDescriptorProto {
    fn map(&self, ctx: &mut Context) {
        let mut ctx = context::descend_if_necessary!(ctx, self);

        for r#enum in &self.enum_type {
            r#enum.map(&mut ctx)
        }

        for message in &self.message_type {
            message.map(&mut ctx)
        }
    }
}

impl Mapper for EnumDescriptorProto {
    fn map(&self, ctx: &mut Context) {
        ctx.register_type_name(self.name())
    }
}

impl Mapper for DescriptorProto {
    fn map(&self, ctx: &mut Context) {
        ctx.register_type_name(self.name());

        if self.nested_type.len() == 0 && self.enum_type.len() == 0 {
            return;
        }

        let mut ctx = ctx.descend(self.name().to_string());

        for nested in &self.nested_type {
            ctx.register_type_name(nested.name());
            nested.map(&mut ctx)
        }

        for r#enum in &self.enum_type {
            ctx.register_type_name(r#enum.name());
        }
    }
}
