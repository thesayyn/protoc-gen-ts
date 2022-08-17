use swc_common::FilePathMapping;
use swc_common::{source_map::SourceMap, sync::Lrc, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};

mod descriptor;
mod message;

use descriptor::descriptor::plugin::{CodeGeneratorRequest, CodeGeneratorResponse, code_generator_response::File};
use protobuf::Message;
use std::io::prelude::*;
use std::io::*;
use std::string::*;
use option::{Options};

fn main() {
    let mut buffer: Vec<u8> = Vec::new();
    stdin().read_to_end(&mut buffer).unwrap();

    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();
    let mut response = CodeGeneratorResponse::new();
    let options: Options = Options::parse(request.get_parameter());

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    for descriptor in request.proto_file.to_vec() {

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

        for enumtype in descriptor.get_enum_type() {
            body.push(enumtype::ast(enumtype))
        }

        for messagetype in descriptor.get_message_type() {
            body.push(message::create(messagetype))
        }

        emitter
            .emit_module(&Module {
                span: DUMMY_SP,
                body: body,
                shebang: None,
            })
            .unwrap();
        
        let mut file = File::new();
        let name = String::from(descriptor.get_name());
        file.set_name(format!("{}.ts", name.replace(".proto", "")));
        let generated = String::from_utf8_lossy(&buf).to_string();
        file.set_content(generated);

        response.mut_file().push(file);
    }

    let bytes = &response.write_to_bytes().expect("");

    stdout().write(bytes).unwrap();
}
