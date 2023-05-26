include!(concat!(env!("OUT_DIR"), "/protogen/mod.rs"));

pub mod namespace;
pub mod field;
pub mod field_type;
pub mod r#enum;
pub mod message;
pub mod options;
pub mod print;
pub mod runtime;
pub mod emitter;
pub mod context;