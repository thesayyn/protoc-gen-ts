workspace(
    name = "protoc_gen_ts",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "new_git_repository", "git_repository")


# Setup NodeJS toolchain
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "6b951612ce13738516398a8057899394e2b7a779be91e1a68f75f25c0a938864",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.0.0/rules_nodejs-5.0.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")


node_repositories(
    node_version = "16.3.0"
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
    # See: https://github.com/bazelbuild/rules_nodejs/issues/3280
    exports_directories_only = False
)

# Setup Protocol Buffers toolchain
git_repository(
    name = "rules_proto",
    remote = "https://github.com/bazelbuild/rules_proto.git",
    commit = "11bf7c25e666dd7ddacbcd4d4c4a9de7a25175f8",
    shallow_since = "1637060833 +0100"
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()


# skylib
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
    strip_prefix = "src/google",
    shallow_since = "1642118709 -0800",
    build_file = "//tools:BUILD.protobuf"
)