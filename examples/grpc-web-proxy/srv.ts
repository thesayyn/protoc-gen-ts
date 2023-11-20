import {
  CityQuery,
  CityQuery_Result,
  Temperature,
  GetTemperature,
} from "./weather.js";
import * as grpc from "@grpc/grpc-js";
import * as fs from "node:fs";

const DEFINITION = {
  cities: {
    path: "/weather.Weather/cities",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message: CityQuery) => message.toBinary(),
    requestDeserialize: (bytes: Uint8Array) => CityQuery.fromBinary(bytes),
    responseSerialize: (message: CityQuery_Result) => message.toBinary(),
    responseDeserialize: (bytes: Uint8Array) =>
      CityQuery_Result.fromBinary(bytes),
  },
  get: {
    path: "/weather.Weather/get",
    requestStream: false,
    responseStream: true,
    requestSerialize: (message: GetTemperature) => message.toBinary(),
    requestDeserialize: (bytes: Uint8Array) => GetTemperature.fromBinary(bytes),
    responseSerialize: (message: Temperature) => message.toBinary(),
    responseDeserialize: (bytes: Uint8Array) => Temperature.fromBinary(bytes),
  },
};

function GrpcWebProxy(srv: grpc.Server) {
  const setupHandlers = srv["_setupHandlers"];
  srv["_setupHandlers"] = (http: import("http2").Http2Server) => {

    http.on("session", ses => {
        console.log(ses)
    });
    http.on("stream", (stream, headers) => {
      console.log(stream, headers);
    });
   // setupHandlers.bind(srv)(http);
  };
  return srv;
}

class GrpcWebServerCredentials extends grpc.ServerCredentials {
  _isSecure(): boolean {
    return true;
  }

  _getSettings(): import("http2").SecureServerOptions {
    return {
      allowHTTP1: true,
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem")
    };
  }
}

const srv = GrpcWebProxy(new grpc.Server({}));

srv.addService(DEFINITION, {
  cities: (
    call: grpc.ServerUnaryCall<CityQuery, CityQuery_Result>,
    callback: grpc.sendUnaryData<CityQuery_Result>
  ) => {
    callback(null, new CityQuery_Result());
  },
  get: (call: grpc.ServerWritableStream<GetTemperature, Temperature>) => {
    call.write(new Temperature());
    call.end();
  },
});

srv.bindAsync("localhost:3030", new GrpcWebServerCredentials(), console.log);
