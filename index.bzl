load("@rules_proto//proto:defs.bzl", "ProtoInfo")
load("@build_bazel_rules_nodejs//third_party/github.com/bazelbuild/bazel-skylib:lib/paths.bzl", "paths")

TSProtoOutputInfo = provider(
    fields = {
        "deps_outputs": "The transitive typescript files.",
        "outputs": "The transitive typescript files.",
    },
)

def _get_inputs(target):
    inputs = []
    inputs += target[ProtoInfo].direct_sources
    inputs += target[ProtoInfo].transitive_descriptor_sets.to_list()
    return inputs

def _get_outputs(target, ctx):
    outputs = []
    for source in target[ProtoInfo].direct_sources:
        # test.proto -> test
        name = source.path.replace(ctx.label.package, "").lstrip("/")[:-len(source.extension) - 1]
        output = ctx.actions.declare_file("%s.ts" % (name))
        outputs.append(output)
    return outputs

def _proto_path_infos(proto_info, provided_sources = []):
    """Returns sequence of `ProtoFileInfo` for `proto_info`'s direct sources.
    Files that are both in `proto_info`'s direct sources and in
    `provided_sources` are skipped. This is useful, e.g., for well-known
    protos that are already provided by the Protobuf runtime.
    Args:
      proto_info: An instance of `ProtoInfo`.
      provided_sources: Optional. A sequence of files to ignore.
          Usually, these files are already provided by the
          Protocol Buffer runtime (e.g. Well-Known protos).
    Returns: A sequence of `ProtoFileInfo` containing information about
        `proto_info`'s direct sources.
    """

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

def _ts_proto_library_aspect(target, ctx):

    is_windows_host = ctx.configuration.host_path_separator == ";"
    
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

    outputs = _get_outputs(target, ctx)

    ctx.actions.run(
        inputs = depset(
            direct = _get_inputs(target),
            transitive = [depset(ctx.files._well_known_protos)]
        ),
        tools = [ctx.executable._protoc_gen_ts_bin],
        executable = ctx.executable._protoc,
        outputs = outputs,
        arguments = [args],
        progress_message = "Generating Protocol Buffers for Typescript %s" % ctx.label,
    )

    return TSProtoOutputInfo(
        outputs = outputs
    )

ts_proto_library_aspect = aspect(
    implementation = _ts_proto_library_aspect,
    attr_aspects = ["deps"],
    provides = [TSProtoOutputInfo],
    required_providers = [ProtoInfo],
    attrs = {
        "experimental_features": attr.string(
            doc = "Enable experimental features.",
            default = "false",
            values = ["true", "false"]
        ),
        "grpc_package_name": attr.string(
            doc = "Configures name of the grpc package to use. '@grpc/grpc-js' or 'grpc'",
            default = "@grpc/grpc-js",
            values = ["@grpc/grpc-js", "grpc"]
        ),
        "_protoc": attr.label(
            cfg = "host",
            executable = True,
            allow_single_file = True,
            default = (
                "@com_google_protobuf//:protoc"
            ),
        ),
        "_protoc_gen_ts_bin": attr.label(
            executable = True,
            cfg = "host",
            default = (
                "//protoc-gen-ts/bin:protoc-gen-ts"
            ),
        ),
        "_well_known_protos": attr.label(
            allow_files = True,
            default = (
                "@com_google_protobuf//:well_known_protos"
            ),
        ),
    },
)





def _ts_proto_library(ctx):
    outputs = []

    for target in ctx.attr.deps:
        # if ProtoInfo not in target:
        #     fail("All targets in the deps attribute should be proto_library target.")
        # else:
        #     info = target[ProtoInfo]
        #     transitive_descriptors.extend(info.transitive_descriptor_sets.to_list())
        outputs.extend(target[TSProtoOutputInfo].outputs)

    return [
        DefaultInfo(files = depset(outputs))
    ]


ts_proto_library_ = rule(
    implementation = _ts_proto_library,
    attrs = {
        "deps": attr.label_list(
            doc = "List of proto_library targets.",
            providers = [ProtoInfo],
            aspects = [ts_proto_library_aspect],
            mandatory = True
        ),
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
