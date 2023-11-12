# Auto generated benchmark for protoc-gen-ts against popular protobuf packages.

```console
cpu: Apple M1
runtime: deno 1.34.0 (aarch64-apple-darwin)

file:///Users/thesayyn/Documents/thesayyn/protoc-gen-ts/js/benchmark/benchmark.ts
benchmark          time (avg)             (min … max)       p75       p99      p995
----------------------------------------------------- -----------------------------
protobuf-es      1.31 µs/iter     (1.25 µs … 2.12 µs)   1.33 µs   2.12 µs   2.12 µs
protoc-gen-ts  652.86 ns/iter   (634.42 ns … 1.09 µs) 653.17 ns   1.09 µs   1.09 µs

summary
  protobuf-es
   2x times slower than protoc-gen-ts

protobuf-es      8.52 µs/iter   (7.75 µs … 181.33 µs)   8.29 µs  12.46 µs  12.88 µs
protoc-gen-ts  776.76 ns/iter   (683.66 ns … 1.81 µs) 776.35 ns   1.81 µs   1.81 µs

summary
  protobuf-es
   10.96x times slower than protoc-gen-ts
```

These benchmarks can be reproduced by running 

```shell
./infra/benchmark.sh
```
