use std::io::prelude::*;
use std::io::*;

pub mod runtime;

use protoc_gen_ts::*;
use crate::compile::compile;

fn main() {
    let mut buffer: Vec<u8> = Vec::new();
    stdin()
        .read_to_end(&mut buffer)
        .expect("expected data in stdin");

    let bytes = compile(buffer);

    stdout().write(&bytes).unwrap();
}

