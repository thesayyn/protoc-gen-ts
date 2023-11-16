package main

import (
	context "context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	pb "github.com/thesayn/protoc-gen-ts/examples/grpc-web/srv/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

type NWeatherServer struct {
	*pb.UnimplementedWeatherServer
}

func (*NWeatherServer) Cities(context.Context, *pb.CityQuery) (*pb.CityQuery_Result, error) {
	return &pb.CityQuery_Result{
		Cities: []*pb.City{
			{
				Code: "TR_ANTALYA",
				Name: "Antalya",
			},
			{
				Code: "CA_VANCOUVER",
				Name: "Vancouver",
			},
		},
	}, nil
}

func Rand(min, max int) int {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Intn(max-min+1) + min
}

func (*NWeatherServer) Get(get *pb.GetTemperature, resp pb.Weather_GetServer) error {
	temp := int(70)
	for i := 0; i < Rand(10, 30); i++ {
		temp = temp - Rand(0, -4)
		if err := resp.Send(&pb.Temperature{
			Code:    get.GetCode(),
			Current: int32(temp),
		}); err != nil {
			return err
		}
		time.Sleep(time.Millisecond * time.Duration(Rand(100, 500)))
	}
	return nil
}

func main() {
	grpcServer := grpc.NewServer()
	grpclog.SetLoggerV2(grpclog.NewLoggerV2(os.Stderr, os.Stderr, os.Stderr))
	pb.RegisterWeatherServer(grpcServer, &NWeatherServer{})
	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(func(origin string) bool {
		log.Println(origin)
		return true
	}))
	handler := func(resp http.ResponseWriter, req *http.Request) {
		log.Printf("%s: %s", req.Method, req.URL.String())
		wrappedServer.ServeHTTP(resp, req)
	}

	port := 9090

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: http.HandlerFunc(handler),
	}

	log.Printf("Starting server. http port: %d", port)

	if err := httpServer.ListenAndServe(); err != nil {
		log.Fatalf("failed starting http server: %v", err)
	}
}
