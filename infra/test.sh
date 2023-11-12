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
cd infra && js/conformance/conformance_test_runner --enforce_recommended $bin 2> ./output.tap || code="$?"


echo "# Updating stats"
suite=$(sed -n '/CONFORMANCE SUITE FAILED/,/unexpected failures/p' output.tap)

stats=($(grep -Eo '[0-9]{1,4}' <<< $suite))
pass="${stats[0]}"
skip="${stats[1]}"
expected_err="${stats[2]}"
unexpected_err="${stats[3]}"
err=$((skip+expected_err+unexpected_err))
total=$((err+pass))

percentile=$(awk "BEGIN {print (100/$total*$pass)}")

jq -n "{percentile: $percentile, total: $total, err: $err, pass: $pass}" > ./infra/stats.json

if [[ "$code" -eq 0 ]]; then 
    echo "All tests have passed!"
fi

exit $code