use swc_common::DUMMY_SP;
use swc_ecma_ast::{TsEntityName, TsKeywordTypeKind, TsTypeRef, TsUnionOrIntersectionType, TsUnionType};
use swc_ecma_utils::quote_ident;

use crate::{
    context::{Context, Syntax},
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
    pub fn type_ref(&self, ctx: &mut Context) -> Option<TsTypeRef> {
        if self.is_bytes() {
            return Some(TsTypeRef {
                span: DUMMY_SP,
                type_name: TsEntityName::Ident(quote_ident!("Uint8Array")),
                type_params: None,
            })
        }
        if self.has_type_name() {
            return Some(TsTypeRef {
                span: DUMMY_SP,
                type_name: TsEntityName::Ident(ctx.lazy_type_ref(self.type_name())),
                type_params: None,
            });
        }
        None
    }
}

impl FieldDescriptorProto {

    pub fn is_packable(&self) -> bool {
        return (!self.is_string() && !self.is_group() && !self.is_message() && !self.is_bytes()) && self.is_repeated()
    }

    pub fn is_packed(&self, ctx: &Context) -> bool {
        if !self.is_packable() {
            return false
        }
        if let Syntax::Proto2 = ctx.syntax {
            return self.options.has_packed() && self.options.packed()
        }
        !self.options.has_packed() || self.options.packed()
    }

    #[inline]
    pub fn is_bytes(&self) -> bool {
        self.type_() == Type::TYPE_BYTES
    }  

    #[inline]
    pub fn is_group(&self) -> bool {
        self.type_() == Type::TYPE_GROUP
    }  

    #[inline]
    pub fn is_message(&self) -> bool {
        self.type_() == Type::TYPE_MESSAGE
    }

    #[inline]
    pub fn is_enum(&self) -> bool {
        self.type_() == Type::TYPE_ENUM
    }

    #[inline]
    pub fn is_string(&self) -> bool {
        self.type_() == Type::TYPE_STRING
    }

    #[inline]
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

    pub fn is_map(&self, ctx: &Context) -> bool {
        if !self.is_repeated() {
            return false;
        }
        let r#type = ctx.get_map_type(self.type_name());
        return r#type.is_some()
    }

    // Label
    #[inline]
    pub fn is_repeated(&self) -> bool {
        self.label() == Label::LABEL_REPEATED
    }

    #[inline]
    pub fn is_optional(&self) -> bool {
        self.label() == Label::LABEL_OPTIONAL || self.proto3_optional()
    }

    #[inline]
    pub fn is_jstype_string(&self) -> bool {
        self.options.jstype() == JSType::JS_STRING
    }
}
