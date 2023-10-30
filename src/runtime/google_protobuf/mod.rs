use crate::{
    context::Context,
    descriptor::{self, field_descriptor_proto::Type, FieldDescriptorProto},
    runtime::Runtime
};
use crate::ast::field;
use swc_ecma_ast::Stmt;

#[derive(Clone)]
pub struct GooglePBRuntime {}


impl Runtime for GooglePBRuntime {
    fn deserialize_setup(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        self.deserialize_setup_inner(ctx, descriptor, true)
    }

    fn serialize_setup(
        &self,
        ctx: &mut Context,
        descriptor: &descriptor::DescriptorProto,
    ) -> Vec<Stmt> {
        self.serialize_setup_inner(ctx, descriptor, field::this_field_member, true, true)
    }
}

impl GooglePBRuntime {
    pub fn new() -> Self {
        GooglePBRuntime {}
    }

    fn rw_function_name(
        &self,
        rw: &str,
        ctx: &mut Context,
        field: &FieldDescriptorProto,

    ) -> String {
        let mut placeholder = format!("{}", rw);
        if field.is_packed(ctx) && rw == "write" {
            placeholder = format!("{}Packed", rw);
        } 
        match field.type_() {
            Type::TYPE_STRING => "_placeholder_String",
            Type::TYPE_BOOL => "_placeholder_Bool",
            Type::TYPE_FLOAT => "_placeholder_Float",
            Type::TYPE_DOUBLE => "_placeholder_Double",
            Type::TYPE_ENUM => "_placeholder_Int32",
            Type::TYPE_BYTES => "_placeholder_Bytes",

            Type::TYPE_INT32 => "_placeholder_Int32",
            Type::TYPE_INT64 => "_placeholder_Int64String",
            Type::TYPE_UINT32 => "_placeholder_Uint32",
            Type::TYPE_UINT64 => "_placeholder_Uint64String",
            Type::TYPE_SINT32 => "_placeholder_Sint32",
            Type::TYPE_SINT64 => "_placeholder_Sint64String",

            Type::TYPE_FIXED32 => "_placeholder_Fixed32",
            Type::TYPE_FIXED64 => "_placeholder_Fixed64String",
            Type::TYPE_SFIXED32 => "_placeholder_Sfixed32",
            Type::TYPE_SFIXED64 => "_placeholder_Sfixed64String",

            Type::TYPE_GROUP => "skipField",
            Type::TYPE_MESSAGE => "skipField",
            // _ => unimplemented!("rw_function_name {:?}", field.type_()),
        }
        .replace("_placeholder_", placeholder.as_str())
    }

    fn decoder_fn_name(
        &self,
        field: &FieldDescriptorProto,
    ) -> String {

        match field.type_() {
            Type::TYPE_BOOL => "readBool",
            Type::TYPE_FLOAT => "readFloat",
            Type::TYPE_DOUBLE => "readDouble",
            Type::TYPE_ENUM => "readInt32",

            Type::TYPE_INT32 => "readSignedVarint32",
            Type::TYPE_INT64 => "readSignedVarint64String",
            Type::TYPE_UINT32 => "readUnsignedVarint32",
            Type::TYPE_UINT64 => "readUnsignedVarint64String",
            Type::TYPE_SINT32 => "readZigzagVarint32",
            Type::TYPE_SINT64 => "readZigzagVarint64String",

            Type::TYPE_FIXED32 => "readUint32",
            Type::TYPE_FIXED64 => "readUint64String",
            Type::TYPE_SFIXED32 => "readInt32",
            Type::TYPE_SFIXED64 => "readInt64String",

            typ => unimplemented!("decoder_fn_name {:?}", typ),
        }.to_string()
    }
}

pub mod deserialize;
pub mod serialize;