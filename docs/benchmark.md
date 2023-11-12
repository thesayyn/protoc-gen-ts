# Auto generated benchmark for protoc-gen-ts against popular protobuf packages.

```console
cpu: Apple M1
runtime: deno 1.34.0 (aarch64-apple-darwin)

file:///Users/thesayyn/Documents/thesayyn/protoc-gen-ts/js/benchmark/benchmark_binary.ts
benchmark                     time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------------------- -----------------------------
protobuf-es@fromBinary      1.18 µs/iter     (1.13 µs … 1.97 µs)   1.19 µs   1.97 µs   1.97 µs
protoc-gen-ts@fromBinary  654.39 ns/iter   (635.94 ns … 1.11 µs) 652.48 ns   1.11 µs   1.11 µs

summary
  protobuf-es@fromBinary
   1.81x times slower than protoc-gen-ts@fromBinary

protobuf-es@toBinary        8.47 µs/iter   (7.71 µs … 228.96 µs)   8.25 µs  12.29 µs  12.71 µs
protoc-gen-ts@toBinary    793.18 ns/iter   (740.18 ns … 1.94 µs) 788.93 ns   1.94 µs   1.94 µs

summary
  protobuf-es@toBinary
   10.68x times slower than protoc-gen-ts@toBinary

file:///Users/thesayyn/Documents/thesayyn/protoc-gen-ts/js/benchmark/benchmark_json.ts
benchmark                   time (avg)             (min … max)       p75       p99      p995
-------------------------------------------------------------- -----------------------------
protobuf-es@fromJson    870.41 ns/iter   (830.43 ns … 1.44 µs) 888.46 ns   1.44 µs   1.44 µs
protoc-gen-ts@fromJson     1.5 µs/iter     (1.45 µs … 2.84 µs)   1.47 µs   2.84 µs   2.84 µs

summary
  protobuf-es@fromJson
   1.72x times faster than protoc-gen-ts@fromJson

protobuf-es@toJson        4.43 µs/iter     (4.38 µs … 4.68 µs)   4.48 µs   4.68 µs   4.68 µs
protoc-gen-ts@toJson     82.64 ns/iter  (78.55 ns … 505.36 ns)  85.15 ns  88.64 ns  89.93 ns

summary
  protobuf-es@toJson
   53.65x times slower than protoc-gen-ts@toJson
```

These benchmarks can be reproduced by running 

```shell
./infra/benchmark.sh
```
