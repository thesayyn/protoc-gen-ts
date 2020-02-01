# Example usage of protoc-gen-ts package with bazel

## To run this example follow the following steps

- Clone this repository
- `cd` into `examples/bazel` directory
- Run `yarn install` command
- Run `yarn start` command

### After you complete the steps above, you will see an output like below;

```
INFO: Analyzed target //src:bin (1 packages loaded, 8 targets configured).
INFO: Found 1 target...
Target //src:bin up-to-date:
  bazel-bin/src/bin.sh
  bazel-bin/src/bin_loader.js
  bazel-bin/src/bin_require_patch.js
INFO: Elapsed time: 0.134s, Critical Path: 0.00s
INFO: 0 processes.
INFO: Build completed successfully, 1 total action
INFO: Build completed successfully, 1 total action
{
  name: 'protoc_gen_ts',
  author: 'thesayyn',
  release_date: '2020-02-01T20:20:20.282Z',
  vcs_url: 'https://github.com/thesayyn/protoc-gen-ts',
  tags: [ 'grpc-node', 'protocolbuffers', 'grpc', 'grpc-web', 'typescript' ]
}
{
  name: 'protoc_gen_ts',
  author: 'thesayyn',
  release_date: '2020-02-01T20:20:20.282Z',
  vcs_url: 'https://github.com/thesayyn/protoc-gen-ts',
  tags: [ 'grpc-node', 'protocolbuffers', 'grpc', 'grpc-web', 'typescript' ]
}
```