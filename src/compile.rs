use protobuf::Message;
use std::str::FromStr;
use std::string::*;
use std::sync::{Arc, Mutex};
use std::thread;

use crate::context::{Context, Syntax};
use crate::emit::emit;
use crate::mapper::Mapper;
use crate::options::Options;
use crate::plugin::{code_generator_response::File, CodeGeneratorRequest, CodeGeneratorResponse};
use crate::print::Print;
use crate::runtime::google_protobuf::GooglePBRuntime;

pub fn compile(buffer: Vec<u8>) -> Vec<u8> {
    let request = CodeGeneratorRequest::parse_from_bytes(&buffer).unwrap();

    let options: Options = Options::parse(request.parameter());
    let mut ctx = Context::new(&options, &Syntax::Unspecified);
    // walk the descriptor recursively to make a map of what symbols are exported by proto files.
    request.map(&mut ctx);

    let runtime = GooglePBRuntime::new();
    let outputs = Arc::new(Mutex::new(vec![]));

    thread::scope(|_s| {
        for descriptor in request.proto_file.to_vec() {
            if !request
                .file_to_generate
                .contains(&descriptor.name().to_string())
            {
                continue;
            }

            let ctx = ctx.clone();
            let runtime = runtime.clone();
            let outputs = outputs.clone();

            let closure = move || {
                let syntax = Syntax::from_str(descriptor.syntax()).expect("unknown syntax");
                let mut ctx = ctx.fork(descriptor.name().to_string(), &syntax);

                let mut body = descriptor.print(&mut ctx, &runtime);

                let imports = ctx.drain_imports();
                body.splice(0..0, imports);

                let ts = emit(body);

                let mut file = File::new();
                file.set_name(descriptor.name().replace(".proto", ".ts"));
                file.set_content(ts);
                outputs.lock().unwrap().push(file)
            };

            #[cfg(not(target_family = "wasm"))]
            _s.spawn(move || closure());

            #[cfg(target_family = "wasm")]
            closure();
        }
    });

    let mut response = CodeGeneratorResponse::new();
    response.file = outputs.lock().unwrap().to_vec();

    response.write_to_bytes().unwrap()
}
