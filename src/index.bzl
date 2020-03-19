load("@rules_proto//proto:defs.bzl", "ProtoInfo")

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

    protoc_args.add("--plugin=protoc-gen-ts=%s" % ( ctx.executable.protoc_gen_ts_bin.path ))

    protoc_args.add("--ts_out=%s" % (ctx.bin_dir.path))

    protoc_args.add("--descriptor_set_in=%s" % (":".join([desc.path for desc in transitive_descriptors])))

    protoc_args.add_all(direct_sources)

    env = dict()
    
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
            doc = "Direct list of proto_library targets.",
            providers = [ProtoInfo],
            mandatory = True
        ),
        "experimental_features": attr.bool(
            doc = "Enable experimental features",
            default = False
        ),
        "protoc_gen_ts_bin": attr.label(
            allow_files = True,
            executable = True,
            cfg = "host",
            default = Label("@npm//protoc-gen-ts/bin:protoc-gen-ts"),
        ),
        "_protoc": attr.label(
            allow_single_file = True,
            executable = True,
            cfg = "host",
            default = Label("@com_google_protobuf//:protoc"),
        ),

    }
)