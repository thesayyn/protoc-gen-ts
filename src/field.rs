use crate::{context::Context, descriptor::FieldDescriptorProto, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ClassMember, ClassProp, PropName, TsEntityName, TsKeywordType, TsQualifiedName, TsType,
    TsTypeAnn, TsTypeRef,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
    fn type_annotation(&self, ctx: &mut Context) -> Option<Box<TsTypeAnn>> {
        let mut ts_type: Option<TsType> = None;

        if let Some(typref) = self.typeref(ctx) {
            ts_type = Some(TsType::TsTypeRef(typref))
        }

        if let Some(kind) = self.keyword_type_kind() {
            ts_type = Some(TsType::TsKeywordType(TsKeywordType {
                span: DUMMY_SP,
                kind,
            }))
        }
        if let Some(ts_type) = ts_type {
            return Some(Box::new(TsTypeAnn {
                span: DUMMY_SP,
                type_ann: Box::new(ts_type),
            }));
        }
        None
    }
    pub fn print_prop<T: Runtime>(&self, _ctx: &mut Context, _runtime: &mut T) -> ClassMember {
        ClassMember::ClassProp(ClassProp {
            span: DUMMY_SP,
            key: PropName::Ident(quote_ident!(self.name())),
            value: None,
            type_ann: self.type_annotation(_ctx),
            declare: false,
            is_static: false,
            decorators: vec![],
            accessibility: None,
            is_abstract: false,
            is_optional: self.is_optional(),
            is_override: false,
            readonly: false,
            definite: false,
        })
    }
}
