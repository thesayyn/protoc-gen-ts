use swc_common::DUMMY_SP;
use swc_ecma_ast::{TsEntityName, TsKeywordTypeKind, TsTypeRef};

use crate::{
    context::Context,
    descriptor::{
        field_descriptor_proto::Label, field_descriptor_proto::Type, field_options::JSType,
        FieldDescriptorProto,
    },
};

impl FieldDescriptorProto {
    pub fn keyword_type_kind(&self) -> Option<TsKeywordTypeKind> {
        let mut kind: Option<TsKeywordTypeKind> = None;
        if self.is_string() {
            kind = Some(TsKeywordTypeKind::TsStringKeyword);
        } else if self.is_number() {
            kind = Some(TsKeywordTypeKind::TsNumberKeyword);
        } else if self.is_booelan() {
            kind = Some(TsKeywordTypeKind::TsBooleanKeyword);
        }
        kind
    }
    pub fn typeref(&self, ctx: &mut Context) -> Option<TsTypeRef> {
        if self.has_type_name() {
            return Some(TsTypeRef {
                span: DUMMY_SP,
                type_name: TsEntityName::TsQualifiedName(ctx.lazy_type_ref(self.type_name())),
                type_params: None,
            });
        }
        None
    }
}

impl FieldDescriptorProto {
    // field type
    pub fn is_message(&self) -> bool {
        self.type_() == Type::TYPE_MESSAGE
    }

    pub fn is_enum(&self) -> bool {
        self.type_() == Type::TYPE_ENUM
    }

    pub fn is_string(&self) -> bool {
        self.type_() == Type::TYPE_STRING
    }

    pub fn is_booelan(&self) -> bool {
        self.type_() == Type::TYPE_BOOL
    }

    pub fn is_number(&self) -> bool {
        self.type_() == Type::TYPE_DOUBLE
            || self.type_() == Type::TYPE_FLOAT
            || self.type_() == Type::TYPE_INT32
            || self.type_() == Type::TYPE_INT64
            || self.type_() == Type::TYPE_UINT32
            || self.type_() == Type::TYPE_UINT64
            || self.type_() == Type::TYPE_SINT32
            || self.type_() == Type::TYPE_SINT64
            || self.type_() == Type::TYPE_FIXED32
            || self.type_() == Type::TYPE_FIXED64
            || self.type_() == Type::TYPE_SFIXED32
            || self.type_() == Type::TYPE_SFIXED64
            || self.type_() == Type::TYPE_SFIXED64
    }

    // TODO
    pub fn is_map(&self) -> bool {
        todo!("is_map")
    }

    // Label
    pub fn is_repeated(&self) -> bool {
        self.label() == Label::LABEL_REPEATED
    }

    pub fn is_optional(&self) -> bool {
        // TODO: proto3 optional
        self.label() == Label::LABEL_REPEATED
    }

    // TODO: remove
    pub fn is_oneof(&self) -> bool {
        self.has_oneof_index()
    }

    pub fn has_jstype_string(&self) -> bool {
        self.options.jstype() == JSType::JS_STRING
    }
}
