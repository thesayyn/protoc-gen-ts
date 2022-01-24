import * as grpc from "@grpc/grpc-js";
import { Request, Response, Example } from "./type_checked";

const server = new grpc.Server();
const port = 9090;
const host = "0.0.0.0";

async function main() {
  const serviceImpl = {
    add: (
      call: grpc.ServerUnaryCall<Request, Response>,
      callback: grpc.sendUnaryData<Response>
    ) => {
      const a = call.request?.a;
      const b = call.request?.b;
      callback(null, new Response({ result: a + b }));
    },
  };
  server.addService(Example, serviceImpl);
  server.bindAsync(
    `${host}:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      server.start();
      console.log("server running on port", port);
    }
  );
}

main();
