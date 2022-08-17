use protobuf_codegen::Codegen;

fn main() {
    Codegen::new()
        .pure()
        .cargo_out_dir("protogen")
        .input("src/descriptor/descriptor.proto")
        .input("src/descriptor/plugin.proto")
        .include("src/descriptor")
        .run_from_script();
}