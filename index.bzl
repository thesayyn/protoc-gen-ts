load("@rules_proto//proto:defs.bzl", "ProtoInfo")
load("@build_bazel_rules_nodejs//third_party/github.com/bazelbuild/bazel-skylib:lib/paths.bzl", "paths")

def _get_outputs(target, ctx):
    outputs = []
    for source in target[ProtoInfo].direct_sources:
        # test.proto -> test
        if source.is_source:
            name = source.path.replace(ctx.label.workspace_root, "").lstrip("/")[:-len(source.extension) - 1]
        else:  
            name = source.path.replace(target[ProtoInfo].proto_source_root, "").lstrip("/")[:-len(source.extension) - 1]
        output = ctx.actions.declare_file("%s.ts" % (name))
        outputs.append(output)
    return outputs

def _proto_path_infos(proto_info, provided_sources = []):
    source_root = proto_info.proto_source_root
    if "." == source_root:
        return [struct(file = src, import_path = src.path) for src in proto_info.direct_sources]

    offset = len(source_root) + 1  # + '/'.

    infos = []
    for src in proto_info.direct_sources:
        infos.append(struct(file = src, import_path = src.path[offset:]))

    return infos

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

        # Options
        args.add(ctx.attr.grpc_package_name, format = "--ts_opt=grpc_package=%s")
        
        if ctx.attr.experimental_features == "true":
            args.add("--ts_opt=unary_rpc_promise")

        # Direct sources
        for f in _proto_path_infos(target[ProtoInfo]):
            args.add(f.import_path)

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
        "experimental_features": attr.string(
            doc = "Enable experimental features.",
            default = "false"
        ),
        "grpc_package_name": attr.string(
            doc = "Configures name of the grpc package to use. '@grpc/grpc-js' or 'grpc'",
            default = "@grpc/grpc-js"
        ),
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


def ts_proto_library(name, **kwargs):
    experimental_features = kwargs.pop("experimental_features", False)
    
    ts_proto_library_(
        name = name,
        experimental_features = "true" if experimental_features else "false",
        **kwargs
    )
