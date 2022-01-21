load("@bazel_skylib//rules:diff_test.bzl", "diff_test")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def diff_and_update(name, srcs, checked):
    for i, src in enumerate(srcs):
        diff_test(
            name = "check_%s_%s" % (name, checked[i].replace("/", "_").replace(".", "_")),
            failure_message = "Please run:  bazel run //:update",
            file1 = src,
            file2 = checked[i],
        )

    write_file(
        name = "gen_update",
        out = "update.sh",
        content = [
            "#!/usr/bin/env bash",
            "cd $BUILD_WORKSPACE_DIRECTORY",
        ] + [
            "cp -fv bazel-bin/{0} {1}".format(
                src.replace("@", "external/").replace("//", "/").replace(":", "/"),
                "/".join([native.package_name(), checked[i]]),
            )
            for [
                i,
                src,
            ] in enumerate(srcs)
        ],
    )

    native.sh_binary(
        name = "update",
        srcs = ["update.sh"],
        data = srcs,
    )
