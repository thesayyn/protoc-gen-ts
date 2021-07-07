#!/bin/bash

set -euo pipefail

if [ -f ./node_modules/.bin/protoc ]; then
    echo "protoc binary has already present. skipping downloading"
    exit 0
fi

ASSET_URL=$(curl -s https://api.github.com/repos/protocolbuffers/protobuf/releases/latest | node ./scripts/pick_asset.js)
ASSET_NAME="protoc-$(date +%s)"
echo $ASSET_URL;

curl -sSL $ASSET_URL > "/tmp/${ASSET_NAME}.zip"

unzip "/tmp/${ASSET_NAME}.zip" -d "/tmp/${ASSET_NAME}-extracted"

mv "/tmp/${ASSET_NAME}-extracted/bin/protoc" ./node_modules/.bin 