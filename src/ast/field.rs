use crate::{context::Context, descriptor::FieldDescriptorProto, runtime::Runtime};
use std::iter::Map;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, ClassMember, ClassProp, Expr, PropName, TsArrayType, TsEntityName, TsKeywordType,
    TsType, TsTypeAnn, TsTypeParamInstantiation, TsTypeRef,
};
use swc_ecma_utils::quote_ident;

impl FieldDescriptorProto {
    fn default_value_expr(&self, ctx: &mut Context) -> Option<Box<Expr>> {
        // TODO: proto3 defaults
        // TODO: proto2 defaults
        if self.is_repeated() && self.is_map(ctx) {
            Some(Box::new(crate::new_expr!(Expr::Ident(quote_ident!("Map")))))
        } else if self.is_repeated() {
            Some(Box::new(Expr::Array(ArrayLit {
                elems: vec![],
                span: DUMMY_SP,
            })))
        } else {
            None
        }
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

        if self.is_repeated() && self.is_map(ctx) {
            let descriptor = ctx
                .get_map_type(self.type_name())
                .expect(format!("can not find the map type {}", self.type_name()).as_str());
            ts_type = Some(TsType::TsTypeRef(TsTypeRef {
                span: DUMMY_SP,
                type_name: TsEntityName::Ident(quote_ident!("Map")),
                type_params: Some(Box::new(TsTypeParamInstantiation {
                    span: DUMMY_SP,
                    params: descriptor
                        .field
                        .into_iter()
                        .map(|x: FieldDescriptorProto| {
                            x.type_annotation(ctx)
                                .expect("expect map fields to have corresponding type")
                                .type_ann
                        })
                        .collect(),
                })),
            }))
        } else if ts_type.is_some() && self.is_repeated() && !self.is_map(ctx) {
            ts_type = Some(TsType::TsArrayType(TsArrayType {
                elem_type: Box::new(ts_type.unwrap()),
                span: DUMMY_SP,
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
    pub fn print_prop<T: Runtime>(&self, ctx: &mut Context, _runtime: &mut T) -> ClassMember {
        ClassMember::ClassProp(ClassProp {
            span: DUMMY_SP,
            key: PropName::Ident(quote_ident!(self.name())),
            value: self.default_value_expr(ctx),
            type_ann: self.type_annotation(ctx),
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
