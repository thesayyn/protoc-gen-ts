use std::io::prelude::*;
use std::io::*;
use std::string::*;

use protobuf::Message;
use swc_common::FilePathMapping;
use swc_common::{source_map::SourceMap, sync::Lrc, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};

use crate::context::Context;
use crate::emitter::Emittable;
use crate::options::Options;
use crate::plugin::{code_generator_response::File, CodeGeneratorRequest, CodeGeneratorResponse};
use crate::runtime::GooglePBRuntime;
use protoc_gen_ts::*;

fn main() {
    let mut buffer: Vec<u8> = Vec::new();
    stdin().read_to_end(&mut buffer).expect("expected data in stdin");

    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();
    let mut response = CodeGeneratorResponse::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let options: Options = Options::parse(request.parameter());
    
    let mut ctx = Context::new(options);
    let mut runtime = GooglePBRuntime::new();

    for descriptor in request.proto_file.to_vec() {
  
        let mut buf = vec![];
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config {
                minify: false,
                ascii_only: false,
                target: EsVersion::Es2022,
                omit_last_semi: true,
            },
            cm: cm.clone(),
            comments: None,
            wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
        };

        let body = descriptor.emit(&mut ctx, &mut runtime);

        emitter
            .emit_module(&Module {
                span: DUMMY_SP,
                body,
                shebang: None,
            })
            .unwrap();

        let mut file = File::new();
        let name = String::from(descriptor.name());
        let generated = String::from_utf8_lossy(&buf).to_string();
        file.set_name(format!("{}.ts", name.replace(".proto", "")));
        file.set_content(generated);
        response.file.push(file);
    }

    let bytes = &response.write_to_bytes().expect("");

    stdout().write(bytes).unwrap();
}
