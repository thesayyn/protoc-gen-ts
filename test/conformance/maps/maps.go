package main

import (
	"io/ioutil"
	"log"
	"os"

	maps "github.com/thesayyn/protoc-gen-ts/test/conformance/maps/pb"

	"google.golang.org/protobuf/proto"
)

func main() {

	tags := maps.Tags{
		Key: "this is unique",
		Keys: map[string]string{
			"key1": "value1",
		},
		Topics: map[string]*maps.Topic{
			"key2": &maps.Topic{
				Link: "link",
			},
		},
		TopicsWithIntkeys: map[int64]*maps.Topic{
			1: &maps.Topic{Link: "link_int"},
			5: &maps.Topic{Link: "link_int"},
		},
	}

	bytes, err := proto.Marshal(&tags)

	if err != nil {
		log.Panic(err)
	}

	ioutil.WriteFile(os.Args[1], bytes, 0644)
}
