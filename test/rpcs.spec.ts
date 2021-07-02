import * as grpc from "@grpc/grpc-js";
import { Query, StorageClient, UnimplementedStorageService, _Object } from "./rpcs";
import * as util from "util";

describe("RPCs", () => {
  let server: grpc.Server;

  let storageServer: jasmine.SpyObj<UnimplementedStorageService>;

  let client: StorageClient;

  beforeEach(async () => {
    server = new grpc.Server();
    storageServer = jasmine.createSpyObj<UnimplementedStorageService>(["query", "get", "put", "chunk"]);
    server.addService(UnimplementedStorageService.definition, storageServer);
    await util.promisify(server.bindAsync).bind(server)("0.0.0.0:4884", grpc.ServerCredentials.createInsecure());
    server.start();
    client = new StorageClient("0.0.0.0:4884", grpc.credentials.createInsecure(), {
      'grpc.lb_policy_name': 'round_robin',
      'grpc.keepalive_time_ms': 1500,
      'grpc.keepalive_timeout_ms': 1500,
      'grpc.max_connection_idle_ms': 500,
      'grpc.max_connection_age_ms': 999,
      'grpc.keepalive_permit_without_calls': 1
    });
  });

  afterEach(() => {
    server.forceShutdown();
  })

  it("should set channel options", () => {
    expect((<any>client.getChannel()).options).toEqual({
      'grpc.lb_policy_name': 'round_robin',
      'grpc.keepalive_time_ms': 1500,
      'grpc.keepalive_timeout_ms': 1500,
      'grpc.max_connection_idle_ms': 500,
      'grpc.max_connection_age_ms': 999,
      'grpc.keepalive_permit_without_calls': 1
    });
  });

  it("should make unary call", async () => {
    storageServer.get.and.callFake((call, callback) => {
      callback(null, new _Object({ id: "1", size: 1000 }));
    })

    const metadata = new grpc.Metadata();
    metadata.set("test", "value");
    const response = await client.get(new Query(), metadata);

    expect(response.toObject()).toEqual({ id: "1", size: 1000 });

    expect(storageServer.get).toHaveBeenCalledTimes(1);
    const [serviceCall] = storageServer.get.calls.argsFor(0);
    expect(serviceCall.metadata.get("test")).toEqual(["value"]);
  });

  it("should make unary call without metadata", async () => {
    storageServer.get.and.callFake((call, callback) => {
      callback(null, new _Object({ id: "1", size: 1000 }));
    })
    const response = await client.get(new Query());
    expect(response.toObject()).toEqual({ id: "1", size: 1000 });

    expect(storageServer.get).toHaveBeenCalledTimes(1);
  });
});
