#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd "${BASEDIR}"

OUTPUT_PATH="${BASEDIR}/$1"
LOCAL_PROTOC_GEN_TS_PATH="./src/bin/protoc-gen-ts"
GRPC_TOOLS_NODE_PROTOC="grpc_tools_node_protoc"
PROTOBUF_BASE_PATH="${BASEDIR}/$2"

rm -rf "${OUTPUT_PATH}"/grpc
mkdir -p "${OUTPUT_PATH}"/grpc

for f in `find ${PROTOBUF_BASE_PATH} -name "*.proto" -type f`; do

  # skip the non proto files
  if [ "$(basename "$f")" == "index.ts" ]; then
      continue
  fi

  # loop over all the available proto files and compile them into respective dir
  # JavaScript code generating
  ${GRPC_TOOLS_NODE_PROTOC} \
      --plugin=protoc-gen-ts="${LOCAL_PROTOC_GEN_TS_PATH}" \
      --ts_opt=createNamespaces=false \
      --ts_opt=camelCaseMethodNames=true \
      --ts_out=grpc_js:"${OUTPUT_PATH}"/grpc \
      -I "${PROTOBUF_BASE_PATH}" \
      "${f}"

done
