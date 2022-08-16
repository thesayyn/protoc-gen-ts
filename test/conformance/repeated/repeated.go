package main

import (
	"google.golang.org/protobuf/proto"
	"io/ioutil"
	"log"
	"repeated/proto"
)

// run: go run repeated.go

func main() {
	//   repeated int64 implicitly_packed = 1;
	//   repeated int64 explicitly_packed = 2 [packed = true]; // should same as default value
	//   repeated int64 explicitly_not_packed = 3 [packed = false];
	//   repeated int64 implicitly_packed_options = 4 [jstype = JS_NUMBER]; // options should have no effect
	object := repeated.RepeatedWithOptions{
		ImplicitlyPacked:        []int64{1, 2, 3},
		ExplicitlyPacked:        []int64{4, 5, 6},
		ExplicitlyNotPacked:     []int64{7, 8, 9},
		ImplicitlyPackedOptions: []int64{10, 11, 12},
	}

	bytes, err := proto.Marshal(&object)

	if err != nil {
		log.Panic(err)
	}

	ioutil.WriteFile("./repeated.bin", bytes, 0644)
}
