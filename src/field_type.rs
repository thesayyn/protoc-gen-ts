use descriptor::descriptor::{
    FieldDescriptorProto, FieldDescriptorProto_Label, FieldDescriptorProto_Type,
    FieldOptions_JSType,
};

// field type
pub fn is_message(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_MESSAGE
}

pub fn is_enum(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_ENUM
}

// TODO
pub fn is_map(descriptor: FieldDescriptorProto) -> bool {
    false
}

pub fn is_string(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_STRING
}

pub fn is_booelan(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_BOOL
}

pub fn is_number(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_DOUBLE
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_FLOAT
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_INT32
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_INT64
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_UINT32
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_UINT64
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_SINT32
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_SINT64
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_FIXED32
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_FIXED64
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_SFIXED32
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_SFIXED64
        || descriptor.get_field_type() == FieldDescriptorProto_Type::TYPE_SFIXED64
}

// Label
pub fn is_repeated(descriptor: FieldDescriptorProto) -> bool {
    descriptor.get_label() == FieldDescriptorProto_Label::LABEL_REPEATED
}

pub fn is_optional(descriptor: FieldDescriptorProto) -> bool {
    // TODO: proto3 optional
    descriptor.get_label() == FieldDescriptorProto_Label::LABEL_REPEATED
}

// TODO: remove
pub fn is_oneof(descriptor: FieldDescriptorProto) -> bool {
    descriptor.has_oneof_index()
}

pub fn has_jstype_string(descriptor: FieldDescriptorProto) -> bool {
    descriptor.has_options()
        && descriptor.get_options().get_jstype() == FieldOptions_JSType::JS_STRING
}
