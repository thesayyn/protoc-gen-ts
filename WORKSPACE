workspace(
    name = "protoc_gen_ts",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "new_git_repository")


# Setup NodeJS toolchain
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "d63ecec7192394f5cc4ad95a115f8a6c9de55c60d56c1f08da79c306355e4654",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.6.1/rules_nodejs-4.6.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    node_version = "16.3.0"
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock"
)

# Setup Protocol Buffers toolchain
http_archive(
    name = "rules_proto",
    sha256 = "66bfdf8782796239d3875d37e7de19b1d94301e8972b3cbd2446b332429b4df1",
    strip_prefix = "rules_proto-4.0.0",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
        "https://github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()


# Lib
http_archive(
    name = "bazel_skylib",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
    ],
    sha256 = "c6966ec828da198c5d9adbaa94c05e3a1c7f21bd012a0b29ba8ddbccb2c93b0d",
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")
bazel_skylib_workspace()

# 3rd party: protobuf
new_git_repository(
    name = "third_party_protobuf",
    remote = "https://github.com/protocolbuffers/protobuf.git",
    commit = "41e22cde8d8a44c35127a26c19e08b180e0b30a4",
    strip_prefix = "src/google/protobuf",
    shallow_since = "1642118709 -0800",
    build_file_content = """
load("@protoc_gen_ts//:index.bzl", "ts_proto_library")
load("@rules_proto//proto:defs.bzl", "proto_library")

genrule(
    name = "plugin_proto",
    srcs = ["compiler/plugin.proto"],
    outs = ["plugin.proto"],
    cmd = 'sed "s/google\\\\/protobuf\\\\/descriptor.proto/descriptor.proto/" "$<" > "$@"',
)

proto_library(
    name = "protos",
    srcs = [
        "descriptor.proto",
        "plugin.proto",
    ]
)

ts_proto_library(
    name = "codegen",
    experimental_features = True,
    visibility = ["//visibility:public"],
    outs = ["plugin.ts", "descriptor.ts"],
    deps = [
        ":protos",
    ],
)
    """
)