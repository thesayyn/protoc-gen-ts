
import {
  CityQuery,
  CityQuery_Result,
  Temperature,
  GetTemperature,
  City
} from "./weather.js";
import * as grpc from "@grpc/grpc-js";
import * as proxy from "./proxy.js";

const DEFINITION = {
  cities: {
    path: "/Weather/cities",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message: CityQuery) => Buffer.from(message.toBinary()),
    requestDeserialize: (bytes: Uint8Array) => CityQuery.fromBinary(bytes),
    responseSerialize: (message: CityQuery_Result) => Buffer.from(message.toBinary()),
    responseDeserialize: (bytes: Uint8Array) =>
      CityQuery_Result.fromBinary(bytes),
  },
  get: {
    path: "/Weather/get",
    requestStream: false,
    responseStream: true,
    requestSerialize: (message: GetTemperature) => Buffer.from(message.toBinary()),
    requestDeserialize: (bytes: Uint8Array) => GetTemperature.fromBinary(bytes),
    responseSerialize: (message: Temperature) => Buffer.from(message.toBinary()),
    responseDeserialize: (bytes: Uint8Array) => Temperature.fromBinary(bytes),
  },
};

const srv = proxy.GrpcWebProxy(new grpc.Server({}));

srv.addService(DEFINITION, {
  cities: (
    call: grpc.ServerUnaryCall<CityQuery, CityQuery_Result>,
    callback: grpc.sendUnaryData<CityQuery_Result>
  ) => {
    console.log("cities");
    const r = CityQuery_Result.fromJson({
      cities: [
        { code: "TR_ANT", name: "Antalya" },
        { code: "CA_VAN", name: "Vancouver" }
      ]
    })
    callback(null, r);
  },
  get: (call: grpc.ServerWritableStream<GetTemperature, Temperature>) => {
    console.log("get");
    call.write(new Temperature());
    call.end();
  },
});

srv.bindAsync("localhost:3030", new proxy.GrpcWebServerCredentials(), console.log);
