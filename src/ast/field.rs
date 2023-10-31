use crate::{
    context::{Context, Syntax},
    descriptor::FieldDescriptorProto,
    runtime::Runtime,
};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    ArrayLit, BigInt, BinaryOp, ClassMember, ClassProp, Expr, Lit, PropName, TsArrayType,
    TsEntityName, TsKeywordType, TsKeywordTypeKind, TsType, TsTypeAnn, TsTypeParamInstantiation,
    TsTypeRef, TsUnionOrIntersectionType, TsUnionType,
};
use swc_ecma_utils::{quote_ident, quote_str};

pub type AccessNormalizerFn = fn(expr: &Expr) -> Expr;

pub(crate) fn map_to_string_normalizer(expr: &Expr) -> Expr {
    crate::call_expr!(
        crate::member_expr_bare!(expr.clone(), "map"),
        vec![crate::expr_or_spread!(crate::arrow_func_short!(
            crate::call_expr!(crate::member_expr!("v", "toString")),
            vec![crate::pat_ident!("v")]
        ))]
    )
}

pub(crate) fn to_string_normalizer(expr: &Expr) -> Expr {
    crate::call_expr!(crate::member_expr_bare!(expr.clone(), "toString"))
}

pub type FieldAccessorFn = fn(name: &str) -> Expr;

pub(crate) fn this_field_member(name: &str) -> Expr {
    crate::member_expr!("this", name)
}

pub(crate) fn bare_field_member(name: &str) -> Expr {
    Expr::Ident(quote_ident!(name))
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
    pub fn prop_name(&self) -> String {
        if self.has_oneof_index() {
            format!("#_{}", self.name())
        } else {
            self.name().to_string()
        }
    }

    pub fn default_value_bin_expr(&self, ctx: &mut Context, accessor: FieldAccessorFn) -> Expr {
        let neq_undefined_check = crate::bin_expr!(
            accessor(self.name()),
            quote_ident!("undefined").into(),
            BinaryOp::NotEqEq
        );

        // for oneof field we have to serialize the value unconditionally
        // even if the value is the default.
        if self.has_oneof_index() {
            return neq_undefined_check;
        }

        let presence_check = if self.is_map(ctx) {
            crate::bin_expr!(
                neq_undefined_check,
                crate::bin_expr!(
                    crate::member_expr_bare!(accessor(self.name()), "size"),
                    Expr::Lit(crate::lit_num!(0)),
                    BinaryOp::NotEqEq
                )
            )
        } else if
        /*self.is_bytes() TODO*/
        false || self.is_repeated() {
            crate::bin_expr!(
                neq_undefined_check,
                crate::bin_expr!(
                    crate::member_expr_bare!(accessor(self.name()), "length"),
                    Expr::Lit(crate::lit_num!(0)),
                    BinaryOp::NotEqEq
                )
            )
        } else {
            neq_undefined_check
        };

        if ctx.syntax == &Syntax::Proto3 {
            let default_expr = self.proto3_default(ctx);
            if let Some(default_expr) = default_expr {
                crate::bin_expr!(
                    presence_check,
                    crate::bin_expr!(accessor(self.name()), default_expr, BinaryOp::NotEqEq)
                )
            } else {
                presence_check
            }
        } else {
            presence_check
        }
    }

    pub fn proto3_default(&self, ctx: &mut Context) -> Option<Expr> {
        if self.is_repeated() {
            return None;
        }
        if self.is_string() {
            Some(crate::lit_str!("").into())
        } else if self.is_bigint() {
            Some(crate::lit_bigint!(0.into()).into())
        } else if self.is_number() {
            Some(crate::lit_num!(0).into())
        } else if self.is_booelan() {
            Some(crate::lit_bool!(false).into())
        } else if self.is_enum() {
            Some(crate::lit_num!(ctx.get_leading_enum_member(self.type_name())).into())
        } else {
            None
        }
    }

    pub fn default_value_expr(&self, ctx: &mut Context, primitives: bool) -> Expr {
        // TODO: primitives is not a good name. it should be something about the field.
        if self.is_map(ctx) {
            crate::new_expr!(Expr::Ident(quote_ident!("Map")))
        } else if self.is_repeated() {
            Expr::Array(ArrayLit {
                elems: vec![],
                span: DUMMY_SP,
            })
        } else if self.is_message() && primitives {
            crate::new_expr!(Expr::Ident(ctx.lazy_type_ref(self.type_name())))
        } else if self.is_bytes() && primitives {
            crate::new_expr!(Expr::Ident(quote_ident!("Uint8Array")))
        } else if self.is_string() && primitives {
            Expr::Lit(quote_str!(self.default_value()).into())
        } else if self.is_bigint()  && primitives {
            Expr::Lit(Lit::BigInt(BigInt {
                span: DUMMY_SP,
                value: Box::new(
                    self.default_value
                        .clone()
                        .unwrap_or("0".to_string())
                        .parse::<num_bigint::BigInt>()
                        .expect("can not parse the default")
                        .into(),
                ),
                raw: None,
            }))
        } else if self.is_number() && primitives {
            Expr::Lit(crate::lit_num!(self
                .default_value
                .clone()
                .unwrap_or("0".to_string())
                .parse::<f64>()
                .expect("can not parse the default")))
        } else if self.is_booelan() && primitives {
            Expr::Lit(crate::lit_bool!(self
                .default_value
                .clone()
                .unwrap_or("false".to_string())
                .parse::<bool>()
                .expect("can not parse the default")))
        } else {
            Expr::Ident(quote_ident!("undefined"))
        }
    }
    fn ts_type(&self, ctx: &mut Context) -> Option<TsType> {
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
        ts_type
    }
    pub fn type_annotation(&self, ctx: &mut Context) -> Option<Box<TsTypeAnn>> {
        Some(Box::new(TsTypeAnn {
            span: DUMMY_SP,
            type_ann: Box::new(self.ts_type(ctx)?),
        }))
    }
    pub fn nullish_type_annotation(&self, ctx: &mut Context) -> Option<Box<TsTypeAnn>> {
        let union = TsUnionOrIntersectionType::TsUnionType(TsUnionType {
            span: DUMMY_SP,
            types: vec![
                Box::new(self.ts_type(ctx)?),
                Box::new(TsType::TsKeywordType(TsKeywordType {
                    span: DUMMY_SP,
                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                })),
            ],
        });

        Some(Box::new(TsTypeAnn {
            span: DUMMY_SP,
            type_ann: Box::new(TsType::TsUnionOrIntersectionType(union)),
        }))
    }

    pub fn print_prop<T: Runtime>(&self, ctx: &mut Context, _runtime: &T) -> ClassMember {
        let mut ident = quote_ident!(self.prop_name());
        ident.optional = self.is_optional();
        ClassMember::ClassProp(ClassProp {
            span: DUMMY_SP,
            key: PropName::Ident(ident),
            value: Some(Box::new(self.default_value_expr(ctx, false))),
            type_ann: self.type_annotation(ctx),
            declare: false,
            is_static: false,
            decorators: vec![],
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        })
    }
}
