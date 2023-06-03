use crate::{context::Context, descriptor::FieldDescriptorProto, runtime::Runtime};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, Bool, ClassMember, ClassProp, Expr, Lit, Number, PropName, TsArrayType, TsEntityName,
    TsKeywordType, TsType, TsTypeAnn, TsTypeParamInstantiation, TsTypeRef, BinExpr, BinaryOp,
};
use swc_ecma_utils::{quote_ident, quote_str};

pub type FieldAccessorFn = fn(name: &str) -> Expr;

pub(crate) fn this_field_member(name: &str) -> Expr {
    crate::member_expr!("this", name)
}

pub(crate) fn bare_field_member(name: &str) -> Expr {
    Expr::Ident(quote_ident!(name))
}

pub(crate) fn message_field_member(name: &str) -> Expr {
    crate::member_expr!("message", name)
}

impl FieldDescriptorProto {
    pub(crate) fn into_accessor(&self, ctx: &Context) -> FieldAccessorFn {
        if self.is_repeated() && self.is_map(ctx) {
            bare_field_member
        } else if self.is_repeated() && !self.is_packed(ctx) {
            bare_field_member
        } else {
            this_field_member
        }
    }
}

impl FieldDescriptorProto {

    pub fn default_value_bin_expr(&self, ctx: &mut Context,  accessor: FieldAccessorFn,) -> Expr {
        if self.is_bytes() || self.is_repeated() {
            Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::NotEqEq,
                left: Box::new(crate::member_expr_bare!(accessor(self.name()), "length")),
                right: Box::new(Expr::Lit(crate::lit_num!(0))),
            })
        } else {
            Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::NotEqEq,
                left: Box::new(accessor(self.name())),
                right: Box::new(self.default_value_expr(ctx)),
            })
        }

    }

    fn default_value_expr(&self, ctx: &mut Context) -> Expr {
        // TODO: proto3 defaults
        // TODO: proto2 defaults

        if self.is_repeated() && self.is_map(ctx) {
            crate::new_expr!(Expr::Ident(quote_ident!("Map")))
        } else if self.is_repeated() {
            Expr::Array(ArrayLit {
                elems: vec![],
                span: DUMMY_SP,
            })
        } else if self.is_string() {
            Expr::Lit(Lit::Str(quote_str!(
                self.default_value()
            )))
        } else if self.is_number() {
            Expr::Lit(crate::lit_num!(self
                .default_value
                .clone()
                .unwrap_or("0".to_string())
                .parse::<f64>()
                .expect("can not parse the default")))
        } else if self.is_booelan() {
            Expr::Lit(Lit::Bool(Bool {
                value: self
                .default_value
                .clone()
                .unwrap_or("false".to_string())
                .parse()
                .expect("can not parse the default"),
                span: DUMMY_SP,
            }))
        } else if self.is_bytes() {
            crate::new_expr!(Expr::Ident(quote_ident!(
                "Uint8Array"
            )))
        } else {
            Expr::Ident(quote_ident!(
                "undefined"
            ))
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
            value: Some(Box::new(self.default_value_expr(ctx))),
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
