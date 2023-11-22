import { CityQuery, GetTemperature, Weather } from "./weather.js";

function log(text) {
  if (typeof text != "string") {
    text = JSON.stringify(text);
  }
  const e = document.createTextNode(`${text}\n`);
  document.body.querySelector("pre").appendChild(e);
}

log("gRPC Web example is ready.");

async function test() {
  log("connecting to grpc weather service");
  const cl = new Weather("https://localhost:3030", {});

  log("sending city request");

  const cities_r = await cl.cities(new CityQuery());

  log("sent city request");
  log(cities_r);

  cl.get(
    GetTemperature.fromJson({
      code: cities_r.cities![0].code,
    })
  ).on("data", log);

  cl.get(
    GetTemperature.fromJson({
      code: cities_r.cities![1].code,
    })
  ).on("data", log);
}

document.addEventListener("DOMContentLoaded", test);
