pub mod weather {
    tonic::include_proto!("weather");
}
use std::pin::Pin;
use tonic::{transport::Server, Request, Response, Status};
use futures::*;
use weather::weather_server::{Weather, WeatherServer};
use weather::{city_query, City, CityQuery, GetTemperature, Temperature};

#[derive(Default)]
pub struct DummyWeather {}

type GetStream =  Pin<Box<dyn Stream<Item = Result<Temperature, Status>> + Send>>;

#[tonic::async_trait]
impl Weather for DummyWeather {
    type getStream = GetStream;

    async fn get(
        &self,
        request: Request<GetTemperature>,
    ) -> Result<Response<Self::getStream>, Status> {
        let stream = Box::pin(stream::iter(vec![Result::Ok(
            Temperature {
                code: String::from(""),
                current: 18,
            },
        )]));
        return Ok(Response::new(stream));
    }

    async fn cities(
        &self,
        request: Request<CityQuery>,
    ) -> Result<Response<city_query::Result>, Status> {
        return Ok(Response::new(city_query::Result {
            cities: vec![
                City {
                    code: String::from("TR_1"),
                    name: String::from("Antalya, Turkey"),
                },
                City {
                    code: String::from("DE_1"),
                    name: String::from("Berlin, Germany"),
                },
            ],
        }));
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:3000".parse().unwrap();

    let weather = DummyWeather::default();
    let weather = WeatherServer::new(weather);


    println!("WeatherServer listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .add_service(weather)
        .serve(addr)
        .await?;

    Ok(())
}
