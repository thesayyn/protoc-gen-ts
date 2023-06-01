use crate::{context::Context, descriptor::FieldDescriptorProto, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{ClassMember, ClassProp, PropName, TsKeywordType, TsType, TsTypeAnn, TsArrayType, Expr, ArrayLit};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {

    fn default_value_expr(&self) -> Option<Box<Expr>> {
        // TODO: proto3 defaults
        // TODO: proto2 defaults
        if self.is_repeated() {
            return Some(Box::new(Expr::Array(ArrayLit{elems: vec![], span: DUMMY_SP})))
        }
        None
    }

    fn type_annotation(&self, ctx: &mut Context) -> Option<Box<TsTypeAnn>> {
        let mut ts_type: Option<TsType> = None;

        if let Some(typref) = self.type_ref(ctx) {
            ts_type = Some(TsType::TsTypeRef(typref))
        }

        if let Some(kind) = self.keyword_type_kind() {
            ts_type = Some(TsType::TsKeywordType(TsKeywordType {
                span: DUMMY_SP,
                kind,
            }))
        }
        if ts_type.is_some() && self.is_repeated() {
            ts_type = Some(TsType::TsArrayType(TsArrayType{
                elem_type: Box::new(ts_type.unwrap()),
                span: DUMMY_SP
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
            value: self.default_value_expr(),
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
