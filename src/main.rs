use std::io::prelude::*;
use std::io::*;
use std::str::FromStr;
use std::string::*;

use swc_common::FilePathMapping;
use swc_common::{source_map::SourceMap, sync::Lrc, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};


use crate::mapper::Mapper;
use crate::context::{Context, Syntax};
use crate::options::Options;
use crate::plugin::{code_generator_response::File, CodeGeneratorRequest, CodeGeneratorResponse};
use crate::print::Print;
use crate::runtime::google_protobuf::GooglePBRuntime;
use protobuf::Message;
use protoc_gen_ts::*;

fn main() {
    let mut buffer: Vec<u8> = Vec::new();
    stdin()
        .read_to_end(&mut buffer)
        .expect("expected data in stdin");

    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();
    let mut response = CodeGeneratorResponse::new();

    let options: Options = Options::parse(request.parameter());
    let mut ctx = Context::new(&options, &Syntax::Unspecified);
    request.map(&mut ctx);

    let mut runtime = GooglePBRuntime::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    for descriptor in request.proto_file.to_vec() {
        if !request.file_to_generate.contains(&descriptor.name().to_string()) {
            continue;
        }
        let syntax = Syntax::from_str(descriptor.syntax()).expect("unknown syntax");
        let mut ctx = ctx.fork(descriptor.name().to_string(), &syntax);

        let mut body = descriptor.print(&mut ctx, &mut runtime);

        let imports = ctx.drain_imports();
        body.splice(0..0, imports);

        let module = Module {
            span: DUMMY_SP,
            body,
            shebang: None,
        };

      
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

        emitter.emit_module(&module).unwrap();

        let mut file = File::new();
        file.set_name(descriptor.name().replace(".proto", ".ts"));
        file.set_content(String::from_utf8_lossy(&buf).to_string());
        response.file.push(file);

    }

    let bytes = &response.write_to_bytes().expect("");
    stdout().write(bytes).unwrap();
}
