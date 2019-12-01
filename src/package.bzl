"Install toolchain dependencies"

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

def protoc_gen_ts_dependencies():
    yarn_install(
        name = "protoc_gen_ts_deps",
        package_json = "@protoc_gen_ts//:package.json",
        yarn_lock = "@protoc_gen_ts//:yarn.lock",
        symlink_node_modules = False,
    )