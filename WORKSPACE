workspace(
    name = "protoc_gen_ts",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Setup NodeJS toolchain
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "cfc289523cf1594598215901154a6c2515e8bf3671fd708264a6f6aefe02bf39",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.4.6/rules_nodejs-4.4.6.tar.gz"],
    patch_args = ["-p1"],
    # See: https://github.com/bazelbuild/rules_nodejs/pull/3088
    patches = [
        "//:3088.patch"
    ]
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

# Setup cypress
load("@build_bazel_rules_nodejs//toolchains/cypress:cypress_repositories.bzl", "cypress_repositories")

cypress_repositories(
    name = "cypress",
    version = "7.3.0",
)

# Set up rust
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_rust",
    sha256 = "531bdd470728b61ce41cf7604dc4f9a115983e455d46ac1d0c1632f613ab9fc3",
    strip_prefix = "rules_rust-d8238877c0e552639d3e057aadd6bfcf37592408",
    urls = [
        # `main` branch as of 2021-08-23
        "https://github.com/bazelbuild/rules_rust/archive/d8238877c0e552639d3e057aadd6bfcf37592408.tar.gz",
    ],
)

load("@rules_rust//rust:repositories.bzl", "rust_repositories")

rust_repositories()

load("@rules_rust//crate_universe:defs.bzl", "crate", "crate_universe")

crate_universe(
    name = "crates",
    cargo_toml_files = [
        "//test/web/server:Cargo.toml",
    ],
    resolver_download_url_template = "https://github.com/bazelbuild/rules_rust/releases/download/crate_universe-13/crate_universe_resolver-{host_triple}{extension}",
    resolver_sha256s = {
        "aarch64-apple-darwin": "c6017cd8a4fee0f1796a8db184e9d64445dd340b7f48a65130d7ee61b97051b4",
        "aarch64-unknown-linux-gnu": "d0a310b03b8147e234e44f6a93e8478c260a7c330e5b35515336e7dd67150f35",
        "x86_64-apple-darwin": "762f1c77b3cf1de8e84d7471442af1314157efd90720c7e1f2fff68556830ee2",
        "x86_64-pc-windows-gnu": "c44bd97373d690587e74448b13267077d133f04e89bedfc9d521ae8ba55dddb9",
        "x86_64-unknown-linux-gnu": "aebf51af6a3dd33fdac463b35b0c3f4c47ab93e052099199673289e2025e5824",
    }
    #lockfile = "//:crate_universe.lock",
)

load("@crates//:defs.bzl", "pinned_rust_install")

pinned_rust_install()