import { CityQuery, GetTemperature, Weather } from "./weather.js";

const cl = new Weather("https://localhost:3030", {
  suppressCorsPreflight: true
});

async function test() {
  const cities_r = await cl.cities(new CityQuery());

  cl.get(
    GetTemperature.fromJson({
      code: cities_r.cities![0].code,
    })
  ).on("data", console.log);

  cl.get(
    GetTemperature.fromJson({
      code: cities_r.cities![1].code,
    })
  ).on("data", console.log);
}


test();