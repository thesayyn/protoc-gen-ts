import * as grpc from "@grpc/grpc-js";
import { weather } from "./weather";

const server = new grpc.Server();
const port = 9090;
const host = "0.0.0.0";


class WeatherServer extends weather.UnimplementedWeatherService{
    cities(call: grpc.ServerUnaryCall<weather.CityQuery, weather.CityQuery.Result>, callback: grpc.sendUnaryData<weather.CityQuery.Result>): void {
        callback(null, new weather.CityQuery.Result({cities: []}));
    }
    get(call: grpc.ServerWritableStream<weather.GetTemperature, weather.Temperature>): void {
       call.write(new weather.Temperature({code: "xd", current: 1}));
    }

}
async function main() {
  const service = new WeatherServer();
  server.addService(weather.UnimplementedWeatherService.definition, service);
  server.bindAsync(
    `${host}:${port}`,
    grpc.ServerCredentials.createSsl({
        byteLength
    }),
    (err, port) => {
      server.start();
      console.log("server running on port", port);
    }
  );
}

main();
