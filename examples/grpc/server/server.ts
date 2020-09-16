import * as grpc from "grpc";

import { Request, Response, Example } from "@example/schema/example";

const server = new grpc.Server();
const port = 9090;
const host = "0.0.0.0";

async function main() {
  const serviceImpl = {
    add: (
      call: grpc.ServerUnaryCall<Request>,
      callback: grpc.sendUnaryData<Response>
    ) => {
      const a = call.request?.a;
      const b = call.request?.b;
      callback(null, new Response({ result: a + b }));
    },
  };
  server.addService(Example as any, serviceImpl);
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
