load("@bazel_skylib//rules:diff_test.bzl", "diff_test")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def _make_absolute(label):
    fragments = []
    if not label.startswith("//") and not label.startswith("@"):
        fragments.append(native.package_name())
    fragments.append(label.replace("@", "external/").replace("//", "/").replace(":", "/").lstrip("/"))
    return "/".join(fragments)

def _normalize_name(name):
    return name.replace("/", "_").replace(".", "_")

def diff_and_update(name, srcs, checked, **kwargs):

    for i, src in enumerate(srcs):
        diff_test(
            name = "%s_check_%s" % (name, _normalize_name(checked[i])),
            failure_message = "Please run:  bazel run //%s:%s_update" % (native.package_name(), name),
            file1 = src,
            file2 = checked[i],
            **kwargs
        )

    write_file(
        name = "%s_gen_update" % name,
        out = "update.sh",
        content = [
            "#!/usr/bin/env bash",
            "cd $BUILD_WORKSPACE_DIRECTORY",
        ] + [
            "cp -fv bazel-bin/{0} {1}".format(
                _make_absolute(src),
                "/".join([native.package_name(), checked[i]]),
            )
            for [
                i,
                src,
            ] in enumerate(srcs)
        ],
    )

    native.sh_binary(
        name = "%s_update" % name,
        srcs = ["update.sh"],
        tags = ["checked_in_update"],
        data = srcs,
    )
