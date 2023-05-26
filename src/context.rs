use crate::options::Options;
use once_cell::sync::Lazy;
use std::{
    collections::HashMap,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
};
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Ident, ImportDecl, ImportSpecifier, ImportStarAsSpecifier, ModuleDecl, ModuleItem, Str,
    TsEntityName, TsQualifiedName,
};
use swc_ecma_utils::quote_ident;

static GLOBAL_TYPE_REG: Lazy<Mutex<Vec<TsQualifiedName>>> = Lazy::new(|| {
    Mutex::new(vec![
        TsQualifiedName {
            left: TsEntityName::Ident(quote_ident!("default")),
            right: quote_ident!("default"),
        }
    ])
});

pub struct Context {
    pub options: Options,
    namespace: Option<String>,
    counter: Arc<AtomicU64>,
    imports: Box<Vec<ImportDecl>>,
    import_identifier_map: Box<HashMap<String, u64>>,
    type_reg: Box<HashMap<String, usize>>,
}

impl Context {
    pub fn new(options: Options) -> Self {
        Self {
            counter: Arc::new(AtomicU64::new(0)),
            options,
            namespace: None,
            imports: Box::new(Vec::new()),
            import_identifier_map: Box::new(HashMap::new()),
            type_reg: Box::new(HashMap::new()),
        }
    }

    pub fn child(&self, namespace: Option<&str>) -> Self {
        let mut nsparts = vec![];
        if let Some(ns) = &self.namespace {
            nsparts.push(ns.as_str())
        }
        if let Some(ns) = &namespace {
            nsparts.push(ns)
        }
        let namespace = match &nsparts.len() {
            0 => None,
            _ => Some(nsparts.join("#")),
        };
        Self {
            options: self.options.clone(),
            counter: self.counter.clone(),
            import_identifier_map: self.import_identifier_map.clone(),
            imports: self.imports.clone(),
            type_reg: self.type_reg.clone(),
            namespace,
        }
    }

    pub fn drain_imports(&mut self) -> Vec<ModuleItem> {
        let mut imports = vec![];
        for import in self.imports.to_vec() {
            imports.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)))
        }
        self.imports.clear();

        imports
    }
    pub fn get_import(&mut self, source: &str) -> Ident {
        let cached_counter = self.import_identifier_map.get(&String::from(source));
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
        self.imports.push(decl);
        self.import_identifier_map
            .insert(String::from(source), counter);

        return quote_ident!(format!("imp_{}", counter));
    }

    pub fn wrap_if_needed(&mut self, _module: ModuleItem) -> Vec<ModuleItem> {
        if self.options.namespaces {
            todo!()
        }
        todo!()
    }

    pub fn normalize_type_name(&mut self, name: &str) -> String {
        if self.options.namespaces {
            return name.to_string();
        }
        if let Some(namespace) = &self.namespace {
            return format!("{}_{}", namespace, name);
        }
        name.to_string()
    }

    pub fn lazy_type_ref(&mut self, type_name: &str) -> Box<TsQualifiedName> {
        let mut global_type_reg = GLOBAL_TYPE_REG.lock().unwrap();
        let i = global_type_reg.get_mut(0).unwrap();

        let ptr = i as *mut TsQualifiedName;

        self.type_reg.insert(String::from(type_name), 0);
        unsafe { Box::from_raw(ptr) }
    }

    pub fn reg_type_ref(&mut self, type_name: &str) {
        let yy = self.type_reg.get(&String::from(type_name));
        if let Some(xd) = yy {
            let ii = xd.to_owned();
            let mut aa = GLOBAL_TYPE_REG.lock().unwrap();
            let i = aa.get_mut(ii).unwrap();
            i.left = TsEntityName::Ident(quote_ident!("hmmmmm"))
        }
    }
}
