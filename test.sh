cargo build
echo ""

plugin="--plugin=protoc-gen-ts=$(pwd)/target/debug/protoc-gen-ts"

protos=$(find tests/basic -name '*.proto')
echo $protos | tr " " "\n"
mkdir -p outputs/basic
protoc -I tests/basic $plugin --ts_out=outputs/basic $protos