workspace(name = "protoc_gen_ts")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository", "new_git_repository")

# setup nodejs
http_archive(
    name = "aspect_rules_js",
    sha256 = "50ff9396e707b5fbf8c5e9dbd23777c7c999dddc53a39d511ffecf7c8b285cd6",
    strip_prefix = "rules_js-1.9.0",
    url = "https://github.com/aspect-build/rules_js/archive/refs/tags/v1.9.0.tar.gz",
)

load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

rules_js_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = DEFAULT_NODE_VERSION,
)

load("@aspect_rules_js//npm:npm_import.bzl", "npm_translate_lock")

npm_translate_lock(
    name = "npm",
    pnpm_lock = "//:pnpm-lock.yaml",
    verify_node_modules_ignored = "//:.bazelignore",
)

load("@npm//:repositories.bzl", "npm_repositories")

npm_repositories()

http_archive(
    name = "aspect_rules_ts",
    sha256 = "5b501313118b06093497b6429f124b973f99d1eb5a27a1cc372e5d6836360e9d",
    strip_prefix = "rules_ts-1.0.2",
    url = "https://github.com/aspect-build/rules_ts/archive/refs/tags/v1.0.2.tar.gz",
)

##################
# rules_ts setup #
##################
# Fetches the rules_ts dependencies.
# If you want to have a different version of some dependency,
# you should fetch it *before* calling this.
# Alternatively, you can skip calling this function, so long as you've
# already fetched all the dependencies.
load("@aspect_rules_ts//ts:repositories.bzl", "LATEST_VERSION", "rules_ts_dependencies")

rules_ts_dependencies(ts_version = LATEST_VERSION)

# load("@build_bazel_rules_nodejs//toolchains/cypress:cypress_repositories.bzl", "cypress_repositories")

# cypress_repositories(
#     name = "cypress",
#     darwin_arm64_sha256 = "101a0ced77fb74b356800cb3a3919f5288d23cc63fdd39a0c500673159e954fc",
#     darwin_sha256 = "101a0ced77fb74b356800cb3a3919f5288d23cc63fdd39a0c500673159e954fc",
#     linux_sha256 = "d8ea8d16fed33fdae8f17178bcae076aaf532fa7ccb48f377df1f143e60abd59",
#     version = "7.3.0",
#     windows_sha256 = "8a8809e4fd22fe7bfc3103c39df3f4fce9db0964450ce927558e9a09558cb26c",
# )

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
