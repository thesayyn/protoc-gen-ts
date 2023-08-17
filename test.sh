#!/usr/bin/env bash

set -o pipefail -o errexit

cargo_test() {
    cargo test -- --nocapture
}

conformance_test() {
    local bin="$(pwd)/tests/conformance/bin/pgt_conformance"
    echo "# Removing the conformance binary executor"
    rm -f $bin

    echo "# Creating a conformance binary executor"
    (cd tests/conformance/bin && deno compile --allow-read --allow-write --allow-env --no-check --output $bin main.ts)


    echo "# Running conformance tests"
    tests/conformance/bin/conformance_test_runner $bin
}


cargo_test
conformance_test