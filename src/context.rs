use crate::{ast, options::Options, descriptor};
use dashmap::DashMap;
use pathdiff::diff_paths;
use std::{
    path::PathBuf,
    str::FromStr,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
};
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

pub struct Context<'a> {
    pub options: &'a Options,
    pub syntax: &'a Syntax,
    namespace: Vec<String>,
    name: String,
    counter: Arc<AtomicU64>,
    imports: Arc<Mutex<Vec<ImportDecl>>>,
    import_identifier_map: Arc<DashMap<String, u64>>,
    type_reg: Arc<DashMap<String, String>>,
    map_type_reg: Arc<DashMap<String, descriptor::DescriptorProto>>,
    leading_enum_member_reg: Arc<DashMap<String, i32>>,
}

impl<'a> Clone for Context<'a> {
    fn clone(&self) -> Self {
        Self {
            options: self.options,
            syntax: self.syntax,
            namespace: self.namespace.clone(),
            name: self.name.clone(),
            counter: self.counter.clone(),
            imports: Arc::new(Mutex::new(Vec::new())),
            import_identifier_map: Arc::new(DashMap::new()),
            type_reg: Arc::clone(&self.type_reg),
            map_type_reg: Arc::clone(&self.map_type_reg),
            leading_enum_member_reg: Arc::clone(&self.leading_enum_member_reg),
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
            imports: Arc::new(Mutex::new(Vec::new())),
            import_identifier_map: Arc::new(DashMap::new()),
            type_reg: Arc::new(DashMap::new()),
            map_type_reg: Arc::new(DashMap::new()),
            leading_enum_member_reg: Arc::new(DashMap::new()),
        }
    }

    pub fn fork(&self, name: String, syntax: &'a Syntax) -> Self {
        let mut copy = self.clone();
        copy.name = name;
        copy.syntax = syntax;
        copy
    }

    pub fn descend(&self, ns: String) -> Self {
        let mut namespace = self.namespace.clone();
        namespace.push(ns);

        Self {
            options: self.options,
            syntax: self.syntax,
            namespace,
            name: self.name.clone(),
            counter: self.counter.clone(),
            import_identifier_map: self.import_identifier_map.clone(),
            imports: self.imports.clone(),
            type_reg: self.type_reg.clone(),
            map_type_reg: self.map_type_reg.clone(),
            leading_enum_member_reg: self.leading_enum_member_reg.clone(),
        }
    }

    pub fn drain_imports(&mut self) -> Vec<ModuleItem> {
        let mut imps = vec![];
        let mut imports = self.imports.lock().unwrap();
        for import in imports.to_vec() {
            imps.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)))
        }
        imports.clear();
        imps
    }

    pub fn get_import(&self, source: &str) -> Ident {
        let cached_counter = self.import_identifier_map.get(&String::from(source));

        if let Some(counter) = cached_counter {
            return quote_ident!(format!("imp_{}", *counter));
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
        self.imports.lock().unwrap().push(decl);
        self.import_identifier_map.insert(String::from(source), counter);

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

    pub fn normalize_type_name(&self, name: &str) -> String {
        let name = name.strip_prefix(".").unwrap_or(name);
        if self.options.namespaces {
            return name.to_string();
        }
        return name.to_string().replace(".", "_");
    }

    pub fn normalize_name(&self, name: &str) -> String {
        if self.options.namespaces {
            return name.to_string();
        }
        let mut ns = vec![];
        ns.extend(self.namespace.clone());
        ns.push(name.to_string());
        ns.join(".").replace(".", "_")
    }

    pub fn find_type_provider(&self, type_name: &String) -> Option<String> {
        if let Some(val) = self.type_reg.get(type_name) {
            return Some(val.clone());
        }
        None
    }

    pub fn lazy_type_ref(&self, type_name: &str) -> Ident {
        let provided_by = self.find_type_provider(&type_name.to_string());
        if let Some(provided_by) = provided_by {
            if self.name == provided_by {
                return quote_ident!(type_name
                    .strip_prefix(".")
                    .expect("expected type to have leading dot")
                    .replace(".", "_"));
            } else {
                let import_from =
                    resolve_relative(provided_by.into(), PathBuf::from_str(&self.name).unwrap());
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

    pub fn calculate_type_name(&self, type_name: &str) -> String {
        let mut fns = String::from(".");
        if self.namespace.len() > 0 {
            fns.push_str(self.namespace.join(".").as_str());
            fns.push('.');
        }
        fns.push_str(type_name);
        fns
    }

    pub fn register_type_name(&mut self, type_name: &str) {
        let fns = self.calculate_type_name(type_name);
        self.type_reg.insert(fns, self.name.clone());
    }

    pub fn register_map_type(&mut self, descriptor: &descriptor::DescriptorProto) {
        let fns = self.calculate_type_name(descriptor.name());
        self.map_type_reg.insert(fns, descriptor.clone());
    }

    pub fn get_map_type(&self, type_name: &str) -> Option<descriptor::DescriptorProto> {
        let res = self.map_type_reg.get(type_name);
        if let Some(descriptor) = res {
            return Some(descriptor.clone());
        }
        None
    }

    pub fn register_leading_enum_member(&mut self, descriptor: &descriptor::EnumDescriptorProto) {
        let fns = self.calculate_type_name(descriptor.name());
        self.leading_enum_member_reg.insert(fns, descriptor.value.get(0).unwrap().number());
    }

    pub fn get_leading_enum_member(&self, type_name: &str) -> i32 {
        let res = self.leading_enum_member_reg.get(type_name);
        if let Some(num) = res {
            return *num
        }
        panic!("no proto provides enum {}", &type_name)
    }
}
