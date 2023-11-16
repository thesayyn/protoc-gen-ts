import { CityQuery, GetTemperature, Weather } from "./weather.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const cl = new Weather("http://localhost:9090");

const cities_r = await cl.cities(new CityQuery());

cl.get(
  GetTemperature.fromJson({
    code: cities_r.cities![0].code,
  })
).on("data", console.log)

cl.get(
    GetTemperature.fromJson({
      code: cities_r.cities![1].code,
    })
).on("data", console.log)