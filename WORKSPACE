workspace(name = "protoc_gen_ts")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository", "new_git_repository")

# setup nodejs
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "5aae76dced38f784b58d9776e4ab12278bc156a9ed2b1d9fcd3e39921dc88fda",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.7.1/rules_nodejs-5.7.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")
build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")
node_repositories(node_version = "16.3.0")

yarn_install(
    name = "npm",
    exports_directories_only = False,
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@build_bazel_rules_nodejs//toolchains/cypress:cypress_repositories.bzl", "cypress_repositories")

cypress_repositories(
    name = "cypress",
    darwin_arm64_sha256 = "101a0ced77fb74b356800cb3a3919f5288d23cc63fdd39a0c500673159e954fc",
    darwin_sha256 = "101a0ced77fb74b356800cb3a3919f5288d23cc63fdd39a0c500673159e954fc",
    linux_sha256 = "d8ea8d16fed33fdae8f17178bcae076aaf532fa7ccb48f377df1f143e60abd59",
    version = "7.3.0",
    windows_sha256 = "8a8809e4fd22fe7bfc3103c39df3f4fce9db0964450ce927558e9a09558cb26c",
)

# setup proto
git_repository(
    name = "rules_proto",
    commit = "11bf7c25e666dd7ddacbcd4d4c4a9de7a25175f8",
    remote = "https://github.com/bazelbuild/rules_proto.git",
    shallow_since = "1637060833 +0100",
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")
rules_proto_dependencies()
rules_proto_toolchains()

# setup go
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "099a9fb96a376ccbbb7d291ed4ecbdfd42f6bc822ab77ae6f1b5cb9e914e94fa",
    urls = [
        "https://github.com/bazelbuild/rules_go/releases/download/v0.35.0/rules_go-v0.35.0.zip",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
go_rules_dependencies()
go_register_toolchains(version = "1.19.1")

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")
protobuf_deps()

# setup gazelle
http_archive(
    name = "bazel_gazelle",
    sha256 = "501deb3d5695ab658e82f6f6f549ba681ea3ca2a5fb7911154b5aa45596183fa",
    urls = [
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.26.0/bazel-gazelle-v0.26.0.tar.gz",
    ],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")
gazelle_dependencies()

load("//:deps.bzl", "go_dependencies")
# gazelle:repository_macro deps.bzl%go_dependencies
go_dependencies()


# setup skylib
http_archive(
    name = "bazel_skylib",
    sha256 = "c6966ec828da198c5d9adbaa94c05e3a1c7f21bd012a0b29ba8ddbccb2c93b0d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.1.1/bazel-skylib-1.1.1.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")
bazel_skylib_workspace()

# setup bazel-lib
http_archive(
    name = "aspect_bazel_lib",
    sha256 = "3534a27621725fbbf1d3e53daa0c1dda055a2732d9031b8c579f917d7347b6c4",
    strip_prefix = "bazel-lib-1.16.1",
    url = "https://github.com/aspect-build/bazel-lib/archive/refs/tags/v1.16.1.tar.gz",
)

load("@aspect_bazel_lib//lib:repositories.bzl", "aspect_bazel_lib_dependencies")
aspect_bazel_lib_dependencies()


# 3rd party: protobuf
new_git_repository(
    name = "third_party_protobuf",
    build_file = "//third-party/protobuf:BUILD.protobuf",
    commit = "41e22cde8d8a44c35127a26c19e08b180e0b30a4",
    remote = "https://github.com/protocolbuffers/protobuf.git",
    shallow_since = "1642118709 -0800",
    strip_prefix = "src/google",
)
