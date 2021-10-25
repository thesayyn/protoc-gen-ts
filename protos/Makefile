all:
	protoc \
        -I . \
		--proto_path=google/protobuf \
        --plugin=protoc-gen-ts=/Users/koblas/repos/github.com/koblas/todo-grpc/ts-server/node_modules/.bin/protoc-gen-ts \
        --ts_out=grpc_js:../src/compiler \
		descriptor.proto 
	protoc \
        -I . \
		--proto_path=google/protobuf \
        --plugin=protoc-gen-ts=/Users/koblas/repos/github.com/koblas/todo-grpc/ts-server/node_modules/.bin/protoc-gen-ts \
        --ts_out=grpc_js:../src/compiler \
		plugin.proto 
