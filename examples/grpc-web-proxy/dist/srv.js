import { CityQuery, CityQuery_Result, Temperature, GetTemperature, } from "./weather.js";
import * as grpc from "@grpc/grpc-js";
import * as fs from "node:fs";
const DEFINITION = {
    cities: {
        path: "/weather.Weather/cities",
        requestStream: false,
        responseStream: false,
        requestSerialize: (message) => message.toBinary(),
        requestDeserialize: (bytes) => CityQuery.fromBinary(bytes),
        responseSerialize: (message) => message.toBinary(),
        responseDeserialize: (bytes) => CityQuery_Result.fromBinary(bytes),
    },
    get: {
        path: "/weather.Weather/get",
        requestStream: false,
        responseStream: true,
        requestSerialize: (message) => message.toBinary(),
        requestDeserialize: (bytes) => GetTemperature.fromBinary(bytes),
        responseSerialize: (message) => message.toBinary(),
        responseDeserialize: (bytes) => Temperature.fromBinary(bytes),
    },
};
function GrpcWebProxy(srv) {
    const setupHandlers = srv["_setupHandlers"];
    srv["_setupHandlers"] = (http) => {
        http.on("session", ses => {
            console.log(ses);
        });
        http.on("stream", (stream, headers) => {
            console.log(stream, headers);
        });
        // setupHandlers.bind(srv)(http);
    };
    return srv;
}
class GrpcWebServerCredentials extends grpc.ServerCredentials {
    _isSecure() {
        return true;
    }
    _getSettings() {
        return {
            allowHTTP1: true,
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem")
        };
    }
}
const srv = GrpcWebProxy(new grpc.Server({}));
srv.addService(DEFINITION, {
    cities: (call, callback) => {
        callback(null, new CityQuery_Result());
    },
    get: (call) => {
        call.write(new Temperature());
        call.end();
    },
});
srv.bindAsync("localhost:3030", new GrpcWebServerCredentials(), console.log);
