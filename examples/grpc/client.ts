import * as grpc from "@grpc/grpc-js";
import { ExampleClient, Request, Response } from "./type_checked";

const host = "0.0.0.0";
const port = 9090;
const connectionString = `${host}:${port}`;

const client = new ExampleClient(
  connectionString,
  grpc.credentials.createInsecure()
);

const a = 40;
const b = 2;
const payload = new Request({ a, b });

const callback: grpc.requestCallback<Response> = (err, response) => {
  if (err) console.log(err);
  else console.log(a, "+", b, "=", response.result);
};

client["add"](payload, callback);
