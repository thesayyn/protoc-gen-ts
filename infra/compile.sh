#!/usr/bin/env bash

set -o pipefail -o errexit

wasm-pack build --out-dir js/plugin/dist --target nodejs --no-pack --out-name plugin