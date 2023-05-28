use crate::{options::Options, ast};
use std::{
    cell::RefCell,
    collections::HashMap,
    rc::Rc,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Ident, ImportDecl, ImportSpecifier, ImportStarAsSpecifier, ModuleDecl, ModuleItem, Str,
    TsEntityName, TsQualifiedName,
};
use swc_ecma_utils::quote_ident;

pub struct Context<'a> {
    pub options: &'a Options,
    namespace: Vec<String>,
    name: String,
    counter: Arc<AtomicU64>,
    imports: Rc<RefCell<Vec<ImportDecl>>>,
    import_identifier_map: Rc<RefCell<HashMap<String, u64>>>,
    type_reg: Rc<RefCell<HashMap<String, String>>>,
}

impl<'a> Context<'a> {
    pub fn new(options: &'a Options) -> Self {
        Self {
            counter: Arc::new(AtomicU64::new(0)),
            options,
            namespace: vec![],
            name: String::new(),
            imports: Rc::new(RefCell::new(Vec::new())),
            import_identifier_map: Rc::new(RefCell::new(HashMap::new())),
            type_reg: Rc::new(RefCell::new(HashMap::new())),
        }
    }

    pub fn fork(&self, name: String) -> Self {
        eprintln!("forking {}", name);
        Self {
            options: self.options,
            name,
            namespace: self.namespace.clone(),
            counter: self.counter.clone(),
            import_identifier_map: Rc::clone(&self.import_identifier_map),
            imports: Rc::clone(&self.imports),
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
        let type_reg = self.type_reg.borrow();
        let cached_counter = type_reg.get(&String::from(source));
        if let Some(counter) = cached_counter {
            return quote_ident!(format!("imp_{}", counter));
        }

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
        let mut ns = vec![];
        ns.extend(self.namespace.clone());
        ns.push(name.to_string());
        ns.join(".").replace(".", "_")
    }

    pub fn lazy_type_ref(&mut self, type_name: &str) -> Box<TsQualifiedName> {
        let qn = Box::new(TsQualifiedName {
            left: TsEntityName::Ident(quote_ident!("$unresolved$")),
            right: quote_ident!(type_name),
        });
        qn
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

    pub fn find_type_provider(&self, type_name: &String) -> Option<String> {
        if let Some(val) = self.type_reg.borrow().get(type_name) {
            return Some(val.clone());
        }
        None
    }
}
