load("@rules_proto//proto:defs.bzl", "ProtoInfo")
load("@bazel_skylib//lib:paths.bzl", "paths")

def _get_outputs(target, ctx):
    outputs = []
    root = target[ProtoInfo].proto_source_root
    for source in target[ProtoInfo].direct_sources:
        # test.proto -> {designated output dir}/test.ts
        name = source.basename.replace(source.extension, "ts") 
        dest = root
        # if the dest is pwd then make sure that we do not strip subdirectories.
        if dest == ".":
            dest = source.dirname[len(ctx.label.package) + 1:]
            if not dest:
                dest = "."
        output = ctx.actions.declare_file("/".join([dest, name]))
        outputs.append(output)
    return outputs

def _imported_protos(target, provided_sources = []):
    proto_info = target[ProtoInfo]
    source_root = proto_info.proto_source_root
    if source_root == ".":
        return [src.path for src in proto_info.direct_sources]

    offset = len(source_root) + 1  # + '/'.
    return [src.path[offset:] for src in proto_info.direct_sources]

def _as_path(path, is_windows_host):
    if is_windows_host:
        return path.replace("/", "\\")
    else:
        return path

def _ts_proto_library(ctx):
    all_outputs = []

    if len(ctx.attr.deps) > 1 and len(ctx.outputs.outs) > 0:
        fail("deps should only contain exactly one target when outs is declared.")

    is_windows_host = ctx.configuration.host_path_separator == ";"
        
    for target in ctx.attr.deps:
        args = ctx.actions.args()

        # Output and Plugin path
        args.add(_as_path(ctx.executable._protoc_gen_ts_bin.path, is_windows_host), format = "--plugin=protoc-gen-ts=%s")

        args.add(paths.join(ctx.bin_dir.path, ctx.label.workspace_root), format = "--ts_out=%s")

        # Set in descriptors
        descriptor_sets_paths = [desc.path for desc in target[ProtoInfo].transitive_descriptor_sets.to_list()]

        args.add_joined("--descriptor_set_in", descriptor_sets_paths, join_with = ctx.configuration.host_path_separator)

        # Features as options
        for feature in ctx.features:
            args.add("--ts_opt=%s" % feature)

        # Direct sources
        args.add_all(_imported_protos(target))

        if not len(ctx.outputs.outs):
            outputs = _get_outputs(target, ctx)
            all_outputs.extend(outputs)
        else:   
            outputs = ctx.outputs.outs
            all_outputs = ctx.outputs.outs        

        ctx.actions.run(
            inputs = depset(target[ProtoInfo].direct_sources, transitive = [target[ProtoInfo].transitive_descriptor_sets, depset(ctx.files._well_known_protos)]),
            tools = [ctx.executable._protoc_gen_ts_bin],
            executable = ctx.executable._protoc,
            outputs = outputs,
            arguments = [args],
            progress_message = "Generating Protocol Buffers for Typescript %s" % ctx.label,
        )

    return [
        DefaultInfo(files = depset(all_outputs))
    ]


ts_proto_library_ = rule(
    implementation = _ts_proto_library,
    attrs = {
        "deps": attr.label_list(
            doc = "List of proto_library targets.",
            providers = [ProtoInfo],
            mandatory = True
        ),
        "outs": attr.output_list(),
        "_protoc_gen_ts_bin": attr.label(
            executable = True,
            cfg = "host",
            default = (
                "//protoc-gen-ts/bin:protoc-gen-ts"
            ),
        ),
        "_protoc": attr.label(
            cfg = "host",
            executable = True,
            allow_single_file = True,
            default = (
                "@com_google_protobuf//:protoc"
            ),
        ),
        "_well_known_protos": attr.label(
            allow_files = True,
            default = (
                "@com_google_protobuf//:well_known_protos"
            ),
        ),
    }
)


def ts_proto_library(name, grpc_package_name = None, experimental_features = None,  **kwargs):
    features = kwargs.pop("features", [])

    if experimental_features != None:
        print("""experimental_features attribute is deprecated. use features = ["unary_rpc_promise"]""")
        features.append("unary_rpc_promise")

    if grpc_package_name != None:
        print("""grpc_package_name attribute is deprecated. use features = ["grpc_package=@grpc/grpc-js"]""")
        features.append("grpc_package=%s" % grpc_package_name)
    
    ts_proto_library_(
        name = name,
        features = features,
        **kwargs
    )
