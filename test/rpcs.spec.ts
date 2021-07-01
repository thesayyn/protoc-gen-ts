import * as grpc from "@grpc/grpc-js";
import { Chunk, Object, Put, Query, UnimplementedStorageServer, StorageClient } from "./rpcs";
import * as util from "util";

class A extends UnimplementedStorageServer{
  query(call: grpc.ServerWritableStream<Query, Query.Result>): void {
    throw new Error("Method not implemented.");
  }
  get(call: grpc.ServerUnaryCall<Query, Object>, callback: grpc.handleUnaryCall<Query, Object>): void {
    throw new Error("Method not implemented.");
  }
  put(call: grpc.ServerReadableStream<Put, Object>, callback: grpc.handleUnaryCall<Put, Object>): void {
    throw new Error("Method not implemented.");
  }
  chunk(call: grpc.ServerDuplexStream<Chunk.Query, Chunk>): void {
    throw new Error("Method not implemented.");
  }
}

describe("RPCs", () => {
  let server: grpc.Server;

  let storageServer: jasmine.SpyObj<UnimplementedStorageServer>;

  let client: StorageClient;

  beforeEach(async () => {
    server = new grpc.Server();
    storageServer = jasmine.createSpyObj<UnimplementedStorageServer>(["query", "get", "put", "chunk"]);
    server.addService(UnimplementedStorageServer.definition, new A());
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
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set("test", "value");

    const response = await client.List(
      new Request({
        test: "2",
      }),
      requestMetadata
    );

    expect(response instanceof Response).toBe(true);
    expect(response.test).toBe("1");

    expect(serviceImplSpy.List).toHaveBeenCalledTimes(1);
    const [serviceCall] = serviceImplSpy.List.calls.argsFor(0);
    expect(serviceCall.request.test).toBe("2");
    expect(serviceCall.metadata.get("test")).toEqual(["value"]);
  });

  it("should make unary call without metadata", async () => {
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set("test", "value");

    const response = await client.List(
      new Request({
        test: "3",
      })
    );

    expect(response instanceof Response).toBe(true);
    expect(response.test).toBe("1");

    expect(serviceImplSpy.List).toHaveBeenCalledTimes(1);
    const [serviceCall] = serviceImplSpy.List.calls.argsFor(0);
    expect(serviceCall.request.test).toBe("2");
  });
});
