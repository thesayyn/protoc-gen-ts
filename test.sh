#!/usr/bin/env bash

set -o pipefail -o errexit

cargo_test() {
    cargo test -- --nocapture
}

conformance_test() {
    local bin="tests/conformance/bin/pgt_conformance"
    echo "# Remove the conformance binary executor"
    rm -f $bin
    echo "# Creating a conformance binary executor"
    deno compile --allow-read --allow-write --allow-env --no-check --output $bin tests/conformance/bin/main.ts
    # /Users/thesayyn/Documents/thesayyn/protobuf/bazel-bin/conformance/conformance_test_runner $bin
    tests/conformance/bin/conformance_test_runner $bin
}


# cargo_test
conformance_test