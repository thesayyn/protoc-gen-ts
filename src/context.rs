use crate::{ast, options::Options};
use std::{
    cell::RefCell,
    collections::HashMap,
    fmt::Error,
    rc::Rc,
    str::FromStr,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    }, path::PathBuf,
};
use pathdiff::diff_paths;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Ident, ImportDecl, ImportSpecifier, ImportStarAsSpecifier, ModuleDecl, ModuleItem, Str,
};
use swc_ecma_utils::quote_ident;

macro_rules! descend_if_necessary {
    ($ctx:ident, $self:ident) => {
        match $self.has_package() {
            true => $ctx.descend($self.package().to_string()),
            false => $ctx.clone(),
        }
    };
}

pub(crate) use descend_if_necessary;

#[derive(PartialEq, Debug)]
pub enum Syntax {
    Proto3,
    Proto2,
    Unspecified,
}

impl FromStr for Syntax {
    type Err = ();
    fn from_str(input: &str) -> Result<Syntax, Self::Err> {
        match input {
            "proto3" => Ok(Syntax::Proto3),
            "proto2" | "" => Ok(Syntax::Proto2),
            _ => Err(()),
        }
    }
}

fn resolve_relative(from: PathBuf, to: PathBuf) -> PathBuf {
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

    root.join(from.file_name().expect("expected path to have filename"))
}

#[derive(Debug)]
pub struct Context<'a> {
    pub options: &'a Options,
    pub syntax: &'a Syntax,
    namespace: Vec<String>,
    name: String,
    counter: Arc<AtomicU64>,
    imports: Rc<RefCell<Vec<ImportDecl>>>,
    import_identifier_map: Rc<RefCell<HashMap<String, u64>>>,
    type_reg: Rc<RefCell<HashMap<String, String>>>,
}

impl<'a> Clone for Context<'a> {
    fn clone(&self) -> Self {
        Self {
            options: self.options,
            syntax: self.syntax,
            namespace: self.namespace.clone(),
            name: self.name.clone(),
            counter: self.counter.clone(),
            imports: Rc::new(RefCell::new(Vec::new())),
            import_identifier_map: Rc::new(RefCell::new(HashMap::new())),
            type_reg: Rc::clone(&self.type_reg),
        }
    }
}

impl<'a> Context<'a> {
    pub fn new(options: &'a Options, syntax: &'a Syntax) -> Self {
        Self {
            counter: Arc::new(AtomicU64::new(0)),
            options,
            syntax,
            namespace: vec![],
            name: String::new(),
            imports: Rc::new(RefCell::new(Vec::new())),
            import_identifier_map: Rc::new(RefCell::new(HashMap::new())),
            type_reg: Rc::new(RefCell::new(HashMap::new())),
        }
    }

    pub fn fork(&self, name: String, syntax: &'a Syntax) -> Self {
        eprintln!("forking {}", name);
        Self {
            options: self.options,
            name,
            namespace: self.namespace.clone(),
            syntax,
            counter: self.counter.clone(),
            imports: Rc::new(RefCell::new(Vec::new())),
            import_identifier_map: Rc::new(RefCell::new(HashMap::new())),
            type_reg: Rc::clone(&self.type_reg),
        }
    }

    pub fn descend(&self, ns: String) -> Self {
        eprintln!("descending {}", ns);
        let mut namespace = self.namespace.clone();
        namespace.push(ns);

        Self {
            options: self.options,
            name: self.name.clone(),
            namespace: namespace,
            syntax: self.syntax,
            counter: self.counter.clone(),
            import_identifier_map: self.import_identifier_map.clone(),
            imports: self.imports.clone(),
            type_reg: self.type_reg.clone(),
        }
    }

    pub fn drain_imports(&mut self) -> Vec<ModuleItem> {
        let mut imports = vec![];
        for import in self.imports.borrow().to_vec() {
            imports.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)))
        }
        self.imports.borrow_mut().clear();

        imports
    }
    pub fn get_import(&mut self, source: &str) -> Ident {
        let import_identifier_map = self.import_identifier_map.borrow();
        let cached_counter = import_identifier_map.get(&String::from(source));

        if let Some(counter) = cached_counter {
            return quote_ident!(format!("imp_{}", counter));
        }

        drop(import_identifier_map);

        let counter = self.counter.fetch_add(1, Ordering::Relaxed);
        let name = quote_ident!(format!("imp_{}", counter));

        let decl = ImportDecl {
            span: DUMMY_SP,
            specifiers: vec![ImportSpecifier::Namespace(ImportStarAsSpecifier {
                local: name,
                span: DUMMY_SP,
            })],
            src: Box::new(Str {
                span: DUMMY_SP,
                raw: None,
                value: source.into(),
            }),
            type_only: false,
            asserts: None,
        };
        self.imports.borrow_mut().push(decl);
        self.import_identifier_map
            .borrow_mut()
            .insert(String::from(source), counter);

        return quote_ident!(format!("imp_{}", counter));
    }

    pub fn wrap_if_needed(&mut self, modules: Vec<ModuleItem>) -> Vec<ModuleItem> {
        if !self.options.namespaces || self.namespace.len() == 0 {
            return modules;
        }
        let last_item = self.namespace.last().unwrap().clone();
        let name = last_item.as_str();
        vec![ast::util::wrap(name, modules)]
    }

    pub fn normalize_type_name(&mut self, name: &str) -> String {
        if self.options.namespaces {
            return name.to_string();
        }
        return name.to_string().replace(".", "_")
    }

    pub fn normalize_name(&mut self, name: &str) -> String {
        if self.options.namespaces {
            return name.to_string();
        }
        let mut ns = vec![];
        ns.extend(self.namespace.clone());
        ns.push(name.to_string());
        ns.join(".")
        .replace(".", "_")
    }

    fn find_type_provider(&self, type_name: &String) -> Option<String> {
        if let Some(val) = self.type_reg.borrow().get(type_name) {
            return Some(val.clone());
        }
        None
    }

    pub fn lazy_type_ref(&mut self, type_name: &str) -> Ident {
        let provided_by = self.find_type_provider(&type_name.to_string());
        if let Some(provided_by) = provided_by {
            eprintln!("{} {}", provided_by, self.name);
            if self.name == provided_by {
        
                return quote_ident!(type_name
                    .strip_prefix(".")
                    .expect("expected type to have leading dot")
                .replace(".", "_"));
            } else {
                let import_from = resolve_relative(provided_by.into(), PathBuf::from_str(&self.name).unwrap());
                let mut import_from = import_from
                    .to_str()
                    .expect("invalid path conversion")
                    .strip_suffix(".proto")
                    .expect("expected path to have .proto suffix.")
                    .to_string();

                import_from.push_str(self.options.import_suffix.as_str());


                let import_id = self.get_import(import_from.as_str());
                let type_name = self.normalize_type_name(
                    type_name
                        .strip_prefix(".")
                        .expect("expected type name to have leading dot"),
                );
                return quote_ident!(format!("{}.{}", import_id.sym.to_string(), type_name));
            }
        } else {
            panic!("no proto provides {}", &type_name)
        }
    }

    pub fn register_type_name(&mut self, type_name: &str) {
        let mut fns = String::from(".");
        if self.namespace.len() > 0 {
            fns.push_str(self.namespace.join(".").as_str());
            fns.push('.');
        }
        fns.push_str(type_name);
        eprintln!("{} provides {}", self.name, fns);
        self.type_reg.borrow_mut().insert(fns, self.name.clone());
    }
}
