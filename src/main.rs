use std::collections::HashMap;
use std::io::prelude::*;
use std::io::*;
use std::string::*;
use std::iter::IntoIterator;

use protobuf::Message;
use protoc_gen_ts::graph::GraphMutator;
use protoc_gen_ts::graph::RelativeImportStrategy;
use swc_common::FilePathMapping;
use swc_common::{source_map::SourceMap, sync::Lrc, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};

use swc_ecma_visit::FoldWith;

use crate::context::Context;
use crate::options::Options;
use crate::plugin::{code_generator_response::File, CodeGeneratorRequest, CodeGeneratorResponse};
use crate::runtime::GooglePBRuntime;
use crate::print::Print;
use protoc_gen_ts::*;

fn main() {
    let mut buffer: Vec<u8> = Vec::new();
    stdin().read_to_end(&mut buffer).expect("expected data in stdin");

    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();
    let mut response = CodeGeneratorResponse::new();

    let options: Options = Options::parse(request.parameter());
    
    let mut ctx = Context::new(&options);
    let mut runtime = GooglePBRuntime::new();

    let mut outputs: HashMap<String, Module> = HashMap::new();

    for descriptor in request.proto_file.to_vec() {
        
        let mut ctx = ctx.fork(descriptor.name().to_string());

        let body = descriptor.print(&mut ctx, &mut runtime);

        let module = Module {
            span: DUMMY_SP,
            body,
            shebang: None,
        };

        outputs.insert(descriptor.name().to_string(), module);
    }

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let import_strategy = RelativeImportStrategy{};

    for (path, module) in outputs.into_iter() {


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

        let mut module = {
            let mut ctx = ctx.fork(path.clone());
            let mut graph_mutator = GraphMutator::new(&mut ctx, &import_strategy, &path);
            module.fold_with(&mut graph_mutator)
        };
        let imports = ctx.drain_imports();
        module.body.splice(0..0, imports);
        emitter.emit_module(&module).unwrap();

        let mut file = File::new();
        file.set_name(format!("{}.ts", path.replace(".proto", "")));
        file.set_content(String::from_utf8_lossy(&buf).to_string());
        response.file.push(file);
    }
    
    let bytes = &response.write_to_bytes().expect("");
    stdout().write(bytes).unwrap();
}
