import { weather } from "./weather_checked";
import { weather as weather_promise } from "./weather_promise_checked";

const cl = new weather.WeatherClient("http://localhost:9090", undefined);

if (location.hash) {
  const cl = new weather_promise.WeatherClient("http://localhost:9090", undefined);
  cl.cities(new weather_promise.CityQuery(), null).then(r => citiesAvailable(r.cities));
} else {
  cl.cities(new weather.CityQuery(), null, (error, cities) => {
    if (!error) {
      citiesAvailable(cities.cities);
    }
  });
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function citiesAvailable(cities: (weather.City | weather_promise.City)[]) {
    while (true) {
        console.log("looping")
        for (const city of cities) {
            await getTemp(city);
            await wait(3000);
        }
    }
}

function getTemp(city: weather.City | weather_promise.City) {
    return new Promise(r => {
        const stream = cl.get(new weather.GetTemperature({code: city.code}), null);
        stream.on("data", (temp) => {
            document.querySelector("h1 > span")!.textContent = city.name;
            document.querySelector("h3 > span")!.textContent = temp.current.toFixed();
            document.querySelector("time > span")!.textContent = new Date().toString();
            document.querySelector("address")!.textContent = city.code;
        })
        stream.on("end", () => r(undefined));
    })
}

