#!/usr/bin/env bash

set -o pipefail -o errexit

echo "# Running cargo test"
cargo test -- --nocapture

echo "# Removing the conformance binary executor"
bin="js/conformance/protoc_gen_ts_conformance"
rm -f $bin

echo "# Creating a conformance binary executor"
deno compile --allow-read --allow-write --allow-env --no-check --output $bin js/conformance/main.ts

echo "# Running conformance tests"
./js/conformance/conformance_test_runner  $bin 2> output.tap
