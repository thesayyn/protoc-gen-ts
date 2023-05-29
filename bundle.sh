cargo test
BIN="tests/conformance/bin/conformance_executor"
rm -f $BIN
deno compile --allow-read --no-check --output $BIN tests/conformance/bin/main.ts

echo "test" | $BIN