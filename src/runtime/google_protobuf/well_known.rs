use crate::context::Context;
use swc_ecma_ast::Ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub struct LazyTypeRefWkt<'a, 'b> {
    pub ctx: &'a mut Context<'b>,
}

impl<'a, 'b> VisitMut for LazyTypeRefWkt<'a, 'b> {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, s: &mut Ident) {
        if s.sym.starts_with("$wkt_") {
            let v = format!(
                ".{}",
                s.sym
                    .to_string()
                    .trim_start_matches("$wkt_")
                    .replace("_", ".")
            );
            *s = self.ctx.lazy_type_ref(&v);
        } else if s.sym.to_string() == "$base64$" {
            *s = self
                .ctx
                .get_import(self.ctx.options.base64_package.as_str())
        } else if s.sym.to_string() == "$type_registry$" {
            *s = quote_ident!("globalThis.protobuf")
        }
    }
}

include!(concat!(env!("OUT_DIR"), "/wkt/mod.rs"));

