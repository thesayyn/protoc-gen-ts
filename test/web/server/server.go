package server

import (
	context "context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

type NWeatherServer struct {
	*UnimplementedWeatherServer
}

func (*NWeatherServer) Cities(context.Context, *CityQuery) (*CityQuery_Result, error) {
	return &CityQuery_Result{
		Cities: []*City{
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
func (*NWeatherServer) Get(get *GetTemperature, resp Weather_GetServer) error {
	for i := 0; i < 3; i++ {
		if err := resp.Send(&Temperature{
			Code:    get.GetCode(),
			Current: int32(i),
		}); err != nil {
			return err
		}
		time.Sleep(time.Second * 1)
	}
	return nil
}

func RunServer() {
	grpcServer := grpc.NewServer()
	grpclog.SetLogger(log.New(os.Stdout, "weatherserver: ", log.LstdFlags))
	RegisterWeatherServer(grpcServer, &NWeatherServer{})
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
