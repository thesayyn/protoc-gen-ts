load(":index.bzl", _ts_proto_library = "ts_proto_library")


def ts_proto_library(**kwargs):
    _ts_proto_library(
        protoc_gen_ts_bin = "@protoc_gen_ts//:protoc_gen_ts",
        **kwargs,
    )



