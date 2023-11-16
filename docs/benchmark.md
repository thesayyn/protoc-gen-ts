# Auto generated benchmark for protoc-gen-ts against popular protobuf packages.

```console
cpu: Apple M1
runtime: deno 1.34.0 (aarch64-apple-darwin)

file:///Users/thesayyn/Documents/thesayyn/protoc-gen-ts/js/benchmark/benchmark_binary.ts
benchmark                     time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------------------- -----------------------------
protobuf-es@fromBinary      1.27 µs/iter        (1 µs … 1.61 ms)   1.17 µs    2.5 µs   2.71 µs
protoc-gen-ts@fromBinary  618.43 ns/iter    (593.2 ns … 1.15 µs) 620.49 ns   1.15 µs   1.15 µs

summary
  protobuf-es@fromBinary
   2.05x times slower than protoc-gen-ts@fromBinary

protobuf-es@toBinary        8.63 µs/iter   (7.71 µs … 361.04 µs)   8.54 µs  12.29 µs     13 µs
protoc-gen-ts@toBinary    766.72 ns/iter   (646.09 ns … 1.77 µs) 765.51 ns   1.77 µs   1.77 µs

summary
  protobuf-es@toBinary
   11.26x times slower than protoc-gen-ts@toBinary

file:///Users/thesayyn/Documents/thesayyn/protoc-gen-ts/js/benchmark/benchmark_json.ts
benchmark                   time (avg)             (min … max)       p75       p99      p995
-------------------------------------------------------------- -----------------------------
protobuf-es@fromJson      1.02 µs/iter   (964.42 ns … 2.08 µs)   1.03 µs   2.08 µs   2.08 µs
protoc-gen-ts@fromJson    2.79 µs/iter   (2.29 µs … 351.96 µs)   2.54 µs   9.67 µs  10.38 µs

summary
  protobuf-es@fromJson
   2.74x times faster than protoc-gen-ts@fromJson

protobuf-es@toJson        5.15 µs/iter   (4.88 µs … 245.33 µs)   5.08 µs   5.62 µs   5.88 µs
protoc-gen-ts@toJson      82.8 ns/iter    (76.38 ns … 1.23 µs)  84.51 ns 115.31 ns 118.73 ns

summary
  protobuf-es@toJson
   62.21x times slower than protoc-gen-ts@toJson
```

These benchmarks can be reproduced by running 

```shell
./infra/benchmark.sh
```
