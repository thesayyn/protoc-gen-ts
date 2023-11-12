#!/usr/bin/env bash

set -o pipefail -o errexit

pushd js/benchmark

rm -f $(find . -name "pprof-profile-*" -type f)

npx esbuild pprof.ts --bundle --platform=node --external:npm:google-protobuf --external:pprof |\
sed "s/npm://g" |\
sed "s#https://deno.land/std@0.205.0/encoding/base64url.ts#js-base64#g" > pprof.js

# 0x --output-dir $(mktemp -d) --open pprof.js 
node --require pprof pprof.js
rm pprof.js

popd

