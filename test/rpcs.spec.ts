import * as grpc from "@grpc/grpc-js";
import { Chunk, Put, Query, StorageClient, UnimplementedStorageService, _Object } from "./rpcs";
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

  it("should make unary call", (done) => {
    storageServer.get.and.callFake((_, callback) => {
      callback(null, new _Object({ id: "1", size: 1000 }));
    })

    const metadata = new grpc.Metadata();
    metadata.set("test", "value");

    client.get(new Query(), metadata, (err, value) => {
      expect(err).toBeNull();
      expect(value?.toObject()).toEqual({ id: "1", size: 1000, mimeType: "" });


      expect(storageServer.get).toHaveBeenCalledTimes(1);
      const [serviceCall] = storageServer.get.calls.argsFor(0);
      expect(serviceCall.metadata.get("test")).toEqual(["value"]);

      done();
    });
  });

  it("should make unary call without metadata", (done) => {
    storageServer.get.and.callFake((_, callback) => {
      callback(null, new _Object({ id: "1", size: 1000 }));
    })
    client.get(new Query(), (err, response) => {
      expect(err).toBeNull();
      expect(response?.toObject()).toEqual({ id: "1", size: 1000, mimeType: "" });
      expect(storageServer.get).toHaveBeenCalledTimes(1);
      done();
    });    
  });

  it("should make client streaming call", (done) => {
    let callDataSpy = jasmine.createSpy("on data");
    storageServer.put.and.callFake((call, callback) => {
      callDataSpy.and.callFake(() => {
        if (callDataSpy.calls.count() > 1) {
          callback(null, new _Object({
            id: "1",
            mimeType: "application/json",
            size: 2
          }))
        }
      })
      call.on("data", callDataSpy);
    });


    const stream = client.put((err, object) => {
      if (err) {
        return done.fail(err);
      }
      expect(object?.toObject()).toEqual({
        id: "1",
        mimeType: "application/json",
        size: 2
      })
      done();
    });
    stream.write(new Put({
      id: "1",
      chunk: new Chunk({
        data: new Uint8Array([1, 1]),
        range: new Chunk.Range({
          start: 1,
          end: 2
        })
      })
    }));
    stream.write(new Put({
      id: "1",
      chunk: new Chunk({
        data: new Uint8Array([1, 1]),
        range: new Chunk.Range({
          start: 3,
          end: 4
        })
      })
    }));
    stream.end();
  })
});
