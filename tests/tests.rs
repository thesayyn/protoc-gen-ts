

macro_rules! gen_test {
    ($name:ident, $path:literal) => {
        #[test]
        fn $name() {
            use std::{env, fs::create_dir_all, process::{Command, Stdio}};

            let manifest_dir = env!("CARGO_MANIFEST_DIR");
            let target_dir = env::var("CARGO_TARGET_DIR").unwrap_or_else(|_| String::from("target"));
            let out_dir = env!("OUT_DIR");
        
            let protoc_gen_ts = format!("{}/debug/protoc-gen-ts", target_dir);
            let ts_out = format!("{}/{}", out_dir, stringify!($name));
            let proto_path = format!("{}/{}", manifest_dir, $path);

            let sources = glob::glob(&format!("{}/**/*.proto", proto_path)).expect("glob failed");
            let sources: Vec<String> = sources
                .map(|r| String::from(r.unwrap().to_str().unwrap()))
                .collect();

            // create directories
            create_dir_all(&ts_out).expect("failed to create output dir");
            
            // invoke protoc with protoc-gen-ts
            let mut cmd = Command::new("protoc");
            cmd.stdout(Stdio::piped());
            cmd.stderr(Stdio::piped());
            cmd.arg(format!("--proto_path={}", proto_path));
            cmd.arg(format!("--plugin=protoc-gen-ts={}", protoc_gen_ts));
            cmd.arg(format!("--ts_out={}", ts_out));
            cmd.args(sources);
            
            // make sure it succedded
            assert!(cmd.status().is_ok(), "protoc has failed");

            eprintln!("ts_out: {}", ts_out)
        }
    };
}



gen_test!(test_basic, "tests/basic");

gen_test!(test_import_strategy, "tests/import_strategy");