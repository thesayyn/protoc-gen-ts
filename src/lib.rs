include!(concat!(env!("OUT_DIR"), "/protogen/mod.rs"));

pub mod options;
pub mod print;
pub mod runtime;
pub mod context;
pub mod ast;
pub mod mapper;
pub mod emit;
pub mod compile;


use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run(bytes: Vec<u8>) -> Vec<u8> {
    console_error_panic_hook::set_once();
    compile::compile(bytes)
}