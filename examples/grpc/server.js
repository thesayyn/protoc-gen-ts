import * as grpc from "@grpc/grpc-js";
import { Response, Example } from "./type";
const server = new grpc.Server();
const port = 9090;
const host = "0.0.0.0";
async function main() {
    const serviceImpl = {
        add: (call, callback) => {
            var _a, _b;
            const a = (_a = call.request) === null || _a === void 0 ? void 0 : _a.a;
            const b = (_b = call.request) === null || _b === void 0 ? void 0 : _b.b;
            callback(null, new Response({ result: a + b }));
        },
    };
    server.addService(Example, serviceImpl);
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        server.start();
        console.log("server running on port", port);
    });
}
main();
