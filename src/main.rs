mod gen;

use swc_common::FilePathMapping;
use swc_common::{source_map::SourceMap, sync::Lrc, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};

use gen::*;
use protobuf::plugin::{CodeGeneratorRequest, CodeGeneratorResponse, CodeGeneratorResponse_File};
use protobuf::Message;
use std::io::prelude::*;
use std::io::*;
use std::string::*;

fn main() {
    let mut buffer: Vec<u8> = Vec::new();

    stdin().read_to_end(&mut buffer).unwrap();
    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();
    let mut response = CodeGeneratorResponse::new();

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    for descriptor in request.proto_file.into_vec() {

        let mut body: Vec<ModuleItem> = Vec::new();

        let mut buf = vec![];
        
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify: false },
            cm: cm.clone(),
            comments: None,
            wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
        };

        if descriptor.has_package() {
            body.push(namespace::namespaced(descriptor.get_package(), vec![]))
        }

        emitter
            .emit_module(&Module {
                span: DUMMY_SP,
                body: body,
                shebang: None,
            })
            .unwrap();
        
        let mut file = CodeGeneratorResponse_File::new();
        let name = String::from(descriptor.get_name());
        file.set_name(format!("{}.ts", name.replace(".proto", "")));
        let generated = String::from_utf8_lossy(&buf).to_string();
        file.set_content(generated);

        response.mut_file().push(file);
    }

    let bytes = &response.write_to_bytes().expect("");

    stdout().write(bytes).unwrap();
}
