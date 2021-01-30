import * as grpc from "@grpc/grpc-js";
import { Request, Response, Srv, SrvClient, ISrvServer } from "../protos/rpcs";
import * as util from "util";

describe("RPCs", () => {
  let server: grpc.Server;

  let serviceImplSpy: jasmine.SpyObj<ISrvServer>;

  let client: SrvClient;

  beforeEach(async () => {
    server = new grpc.Server();
    serviceImplSpy = {
      List: jasmine
        .createSpy("List")
        .and.callFake(
          (
            call: grpc.ServerUnaryCall<Request, Response>,
            callback: grpc.sendUnaryData<Response>
          ) => {
            callback(
              undefined,
              new Response({
                test: "1",
              })
            );
          }
        ),
    };
    server.addService(Srv, serviceImplSpy);
    await util.promisify(server.bindAsync).bind(server)("0.0.0.0:4884", grpc.ServerCredentials.createInsecure());
    server.start();

    client = new SrvClient("0.0.0.0:4884", grpc.credentials.createInsecure());
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

    expect(serviceImplSpy["List"]).toHaveBeenCalledTimes(1);
    const [serviceCall] = serviceImplSpy["List"].calls.argsFor(0);
    expect(serviceCall.request.test).toBe("2");
    expect(serviceCall.metadata.get("test")).toEqual(["value"]);
  });
});
