

use protobuf::descriptor::{FieldDescriptorProto, DescriptorProto};
use protobuf::plugin::{CodeGeneratorRequest};
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::*;

lazy_static! {
    static ref LOOKUP_CACHE: Mutex<HashMap<String, &'static DescriptorProto>> = {
        let mut m = HashMap::new();
        Mutex::new(m)
    };
    static ref CURRENT_REQ: Option<Box<CodeGeneratorRequest>> = None;
}

fn get_type(type_name: &str) -> DescriptorProto {
    DescriptorProto::default()
}

impl FieldDescriptorProto {
    pub fn get_type_descriptor(&self) -> DescriptorProto {
        get_type(self.get_type_name())
    }
}