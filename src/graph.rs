use crate::context::Context;
use pathdiff::diff_paths;
use std::path::PathBuf;
use swc_ecma_ast::{TsEntityName, TsQualifiedName};
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{as_folder, Folder, VisitMut};

pub trait ImportStrategy {
    fn resolve(&self, from: PathBuf, to: PathBuf) -> PathBuf;
}

pub struct RelativeImportStrategy {}

impl ImportStrategy for RelativeImportStrategy {
    fn resolve(&self, from: PathBuf, to: PathBuf) -> PathBuf {
        let common_root = diff_paths(
            from.parent().unwrap_or(PathBuf::from("").as_path()),
            to.parent().unwrap_or(PathBuf::from("").as_path()),
        );

        let root: PathBuf = match common_root {
            None => PathBuf::from("./"),
            Some(cr) if cr.as_os_str().is_empty() => PathBuf::from("./"),
            Some(cr) if !cr.starts_with(".") => PathBuf::from(format!("./{}", cr.display())),
            Some(cr) => cr,
        };

        root.join(
            from.file_name()
                .expect("expected path to have filename")
                .to_string_lossy()
                .strip_suffix(".proto")
                .expect("expected path to have .proto extension"),
        )
    }
}

pub struct GraphMutator<'a, 'b, T>
where
    T: ImportStrategy + Sized,
{
    ctx: &'a mut Context<'a>,
    path: &'b str,
    import_strategy: &'b T,
}

impl<'a, 'b, T> GraphMutator<'a, 'b, T>
where
    T: ImportStrategy + Sized,
{
    pub fn new(ctx: &'a mut Context<'a>, import_strategy: &'b T, path: &'b str) -> Folder<Self> {
        as_folder(Self {
            ctx,
            import_strategy,
            path,
        })
    }
}

impl<'a, 'b, T> VisitMut for GraphMutator<'a, 'b, T>
where
    T: ImportStrategy + Sized,
{
    fn visit_mut_ts_qualified_name(&mut self, n: &mut TsQualifiedName) {
        if let TsEntityName::Ident(_) = &n.left {
            let looking_for = &n.right.sym.to_string();
            let provided_by = self.ctx.find_type_provider(&looking_for);
            if let Some(provided_by) = provided_by {
                let import_from = self
                    .import_strategy
                    .resolve(provided_by.into(), self.path.into());

                let import_id = self
                    .ctx
                    .get_import(import_from.to_str().expect("invalid path conversion"));
                let type_name = self.ctx.normalize_type_name(
                    looking_for
                        .strip_prefix(".")
                        .expect("expected type name to have leading dot")
                );
                
                n.left = TsEntityName::Ident(import_id);
                n.right = quote_ident!(type_name);
            } else {
                panic!("no proto provides {}", looking_for)
            }
        }
    }
}
