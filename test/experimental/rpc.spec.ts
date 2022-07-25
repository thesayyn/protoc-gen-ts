import * as grpc from "@grpc/grpc-js";
import { StorageClient, UnimplementedStorageService, Chunk, Result } from "./rpc";
import * as util from "util";

describe("Experimental RPCs", () => {
  let server: grpc.Server;

  let storageServer: jasmine.SpyObj<UnimplementedStorageService>;

  let client: StorageClient;

  beforeEach(async () => {
    server = new grpc.Server();
    storageServer = jasmine.createSpyObj<UnimplementedStorageService>(["query", "get", "put", "chunk"]);
    server.addService(UnimplementedStorageService.definition, storageServer);
    await util.promisify(server.bindAsync).bind(server)("0.0.0.0:4824", grpc.ServerCredentials.createInsecure());
    server.start();
    client = new StorageClient("0.0.0.0:4824", grpc.credentials.createInsecure());
  });

  afterEach(() => {
    server.forceShutdown();
  })

  it("should make unary call", async () => {
    storageServer.put.and.callFake((_, callback) => {
      callback(null, new Result({id: 1}));
    })

    const metadata = new grpc.Metadata();
    metadata.set("test", "value");
    const result = await client.put(new Chunk({
      data: new Uint8Array([1,1,1,1])
    }), metadata);

    expect(result.toObject()).toEqual({ id: 1 });
    expect(storageServer.put).toHaveBeenCalledTimes(1);
    expect(storageServer.put.calls.argsFor(0)[0].metadata.get("test")).toEqual(["value"]);
  });

  it("should make unary call without metadata", async () => {
    storageServer.put.and.callFake((_, callback) => {
      callback(null, new Result({ id: 2 }));
    })
    const response = await client.put(
      new Chunk({
        data: new Uint8Array([1,1,1,1])
      })
    );
    expect(response.toObject()).toEqual({ id: 2 });

    expect(storageServer.put).toHaveBeenCalledTimes(1);
  });
});
