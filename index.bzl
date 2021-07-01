load("@rules_proto//proto:defs.bzl", "ProtoInfo")

def _get_bin(): 
    # BEGIN-INTERNAL
    return "//bin"
    # END-INTERNAL
    return "//protoc-gen-ts/bin:protoc-gen-ts"

def _proto_path(proto):
    """
    The proto path is not really a file path
    It's the path to the proto that was seen when the descriptor file was generated.
    """
    path = proto.path
    root = proto.root.path
    ws = proto.owner.workspace_root
    if path.startswith(root):
        path = path[len(root):]
    if path.startswith("/"):
        path = path[1:]
    if path.startswith(ws):
        path = path[len(ws):]
    if path.startswith("/"):
        path = path[1:]
    return path
    
def _ts_proto_library(ctx):

    transitive_descriptors = []
    direct_sources = []

    for target in ctx.attr.deps:
        if ProtoInfo not in target:
            fail("All targets in the deps attribute should be proto_library target.")
        else:
            info = target[ProtoInfo]
            transitive_descriptors.extend(info.transitive_descriptor_sets.to_list())
            direct_sources.extend(info.direct_sources)

    ts_outputs = []


    for proto in direct_sources:
        normalizedProtoName = proto.path.replace(ctx.label.package, "").lstrip("/")[:-len(proto.extension) - 1]
        ts_outputs.append(ctx.actions.declare_file("%s.ts" % (normalizedProtoName)))

    protoc_args = ctx.actions.args()

    protoc_args.add("--plugin=protoc-gen-ts=%s" % ( ctx.expand_location(ctx.executable.protoc_gen_ts_bin.path) ))

    protoc_args.add("--ts_out=%s" % (ctx.bin_dir.path))

    protoc_args.add("--descriptor_set_in=%s" % (":".join([desc.path for desc in transitive_descriptors])))

    protoc_args.add_all(direct_sources)

    env = dict()

    env["GRPC_PACKAGE_NAME"] = ctx.attr.grpc_package_name
    
    if ctx.attr.experimental_features:
        env['EXPERIMENTAL_FEATURES'] = "true"

    ctx.actions.run(
        inputs = direct_sources + transitive_descriptors,
        tools = ctx.files.protoc_gen_ts_bin,
        executable = ctx.executable._protoc,
        outputs = ts_outputs,
        arguments = [protoc_args],
        env = env,
        progress_message = "Generating Protocol Buffers for Typescript %s" % ctx.label,
    )

    return [
        DefaultInfo(files = depset(ts_outputs))
    ]





ts_proto_library = rule(
    implementation = _ts_proto_library,
    attrs = {
        "deps": attr.label_list(
            doc = "List of proto_library targets.",
            providers = [ProtoInfo],
            mandatory = True
        ),
        "experimental_features": attr.bool(
            doc = "Enable experimental features.",
            default = False
        ),
        "grpc_package_name": attr.string(
            doc = "Configures name of the grpc package to use. '@grpc/grpc-js' or 'grpc'",
            default = "@grpc/grpc-js"
        ),
        "protoc_gen_ts_bin": attr.label(
            executable = True,
            cfg = "exec",
            default = _get_bin(),
        ),
        "_protoc": attr.label(
            executable = True,
            cfg = "exec",
            default = (
                "@com_google_protobuf//:protoc"
            ),
        ),

    }
)