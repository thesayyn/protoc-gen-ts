use protobuf::Message;
use protobuf_parse::{pure::parse_and_typecheck::*, ProtoPath, ProtoPathBuf};
use protoc_gen_ts::context::{Context, Syntax};
use protoc_gen_ts::descriptor::FileDescriptorProto;
use protoc_gen_ts::emit::emit;
use protoc_gen_ts::options::Options;
use protoc_gen_ts::runtime::google_protobuf::GooglePBRuntime;
use protoc_gen_ts::runtime::grpc_web::GrpcWebRuntime;
use std::fmt;
use std::str::FromStr;

fn in_memory_resolver(source: String) -> impl ProtoPathResolver {
    struct Impl {
        source: String,
    }

    impl fmt::Display for Impl {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            write!(f, "{:?}", self.source)
        }
    }

    impl ProtoPathResolver for Impl {
        fn resolve(&self, _: &ProtoPath) -> anyhow::Result<Option<ResolvedProtoFile>> {
            Ok(Some(ResolvedProtoFile {
                path: "unit_test.proto".to_string(),
                content: self.source.clone().into_bytes(),
            }))
        }
    }

    Impl { source }
}

#[allow(unused)]
pub(crate) fn compile(proto: &str) -> String {
    let resolver = in_memory_resolver(proto.to_string());
    let parsed = parse_and_typecheck_custom(
        &[ProtoPathBuf::new("unit_test.proto".to_owned()).unwrap()],
        resolver,
    )
    .unwrap();
    let bytes = parsed.get(0).unwrap().write_to_bytes().unwrap();
    let descriptor = FileDescriptorProto::parse_from_bytes(&bytes).unwrap();
    let options = Options::parse("");
    let syntax = Syntax::from_str(descriptor.syntax()).unwrap();
    let runtime = GooglePBRuntime::new();
    let grpc_runtime = GrpcWebRuntime::new();

    let mut ctx = Context::new(&options, &syntax);

    let mut body = descriptor.print(&mut ctx, &runtime, &grpc_runtime);
    body.splice(0..0, ctx.drain_imports());

    emit(body)
}