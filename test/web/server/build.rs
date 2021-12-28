
fn main() {
    tonic_build::configure().format(false).compile(&["src/weather.proto"], &["src/"]).unwrap();
}