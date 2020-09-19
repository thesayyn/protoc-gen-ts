# Client-Server gRPC Example

## To run this example follow the following steps

- Clone this repository
- `cd` into `examples/rpc`
- Run `yarn install`
- Run `yarn server` to start the gRPC server
- Run `yarn client` to make a request to the server

### After you complete the steps above, you will see an output like below;

**Server**

```
INFO: Analyzed target //server:server (116 packages loaded, 3969 targets configured).
INFO: Found 1 target...
Target //server:server up-to-date:
  bazel-bin/server/server-layer.tar
INFO: Elapsed time: 1.201s, Critical Path: 0.24s
INFO: 2 processes: 2 worker.
INFO: Build completed successfully, 3 total actions
INFO: Build completed successfully, 3 total actions
0e293f848eda: Loading layer [==================================================>]  317.4kB/317.4kB
Loaded image ID: sha256:1e2c2b60d79a03135e2b374ae451c7872c199e39b1281c8e1196eb37b113246b
Tagging 1e2c2b60d79a03135e2b374ae451c7872c199e39b1281c8e1196eb37b113246b as bazel/server:server
server running on port 9090
```

**Client**

```
INFO: Analyzed target //client:client (3 packages loaded, 17 targets configured).
INFO: Found 1 target...
Target //client:client up-to-date:
  bazel-bin/client/client-layer.tar
INFO: Elapsed time: 0.375s, Critical Path: 0.08s
INFO: 1 process: 1 worker.
INFO: Build completed successfully, 2 total actions
INFO: Build completed successfully, 2 total actions
Loaded image ID: sha256:ca11ec1b07f8fc31d60598c0ee1798c34b778ac462c02ba2806655e8641ac7d8
Tagging ca11ec1b07f8fc31d60598c0ee1798c34b778ac462c02ba2806655e8641ac7d8 as bazel/client:client
40 + 2 = 42
Done in 1.47s.
```

## Features

- Fully typed RPC requests and responses
- Types are auto-generated from `.proto` files
- IDE IntelliSense (configured in `tsconfig.json` and implemented with `rules_typescript`'s `module_name`)
