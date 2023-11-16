#!/usr/bin/env bash

set -o pipefail -o errexit


bench=$(NO_COLOR=1 deno bench js/benchmark/benchmark_*.ts --no-check)
cat > ./docs/benchmark.md <<EOF
# Auto generated benchmark for protoc-gen-ts against popular protobuf packages.

\`\`\`console
$bench
\`\`\`

These benchmarks can be reproduced by running 

\`\`\`shell
./infra/benchmark.sh
\`\`\`
EOF