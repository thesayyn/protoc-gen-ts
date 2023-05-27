use crate::context::Context;
use swc_ecma_ast::{Ident, TsQualifiedName};
use swc_ecma_visit::{as_folder, Folder, VisitMut};

pub struct GraphMutator<'a> {
    context: Context<'a>,
}

impl<'a> GraphMutator<'a> {
    pub fn new(context: Context<'a>) -> Folder<Self> {
        as_folder(Self { context })
    }
}

impl VisitMut for GraphMutator<'_> {
    fn visit_mut_ts_qualified_name(&mut self, n: &mut TsQualifiedName) {
      
        eprintln!("{:?}.{}", n.left, n.right.to_string())
    }
}
