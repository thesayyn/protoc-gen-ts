#[allow(unused)]
macro_rules! gen_test {
    ($name:ident, $path:literal) => {
        #[test]
        fn $name() {
            use std::{env, fs::create_dir_all, process::Command};

            let manifest_dir = env!("CARGO_MANIFEST_DIR");
            let target_dir =
                env::var("CARGO_TARGET_DIR").unwrap_or_else(|_| String::from("target"));
            let out_dir = env!("OUT_DIR");
        
            let output = std::process::Command::new(env!("CARGO"))
                .arg("locate-project")
                .arg("--workspace")
                .arg("--message-format=plain")
                .output()
                .unwrap()
                .stdout;
            let cargo_path = std::path::Path::new(std::str::from_utf8(&output).unwrap().trim());
            let workspace = cargo_path.parent().unwrap().to_path_buf();

            let test_dir = format!("{}/{}/gen", workspace.to_str().unwrap(), $path);        
            let protoc_gen_ts = format!("{}/debug/protoc-gen-ts", target_dir);
            let ts_out = format!("{}/{}", out_dir, stringify!($name));
            let proto_path = format!("{}/{}", manifest_dir, $path);

            let _ = std::fs::remove_file(&test_dir);
            std::os::unix::fs::symlink(&ts_out, &test_dir).expect("could not create link");

            let sources = glob::glob(&format!("{}/**/*.proto", proto_path)).expect("glob failed");
            let sources: Vec<String> = sources
                .map(|r| String::from(r.unwrap().to_str().unwrap()))
                .collect();

            // create directories
            create_dir_all(&ts_out).expect("failed to create output dir");

            // invoke protoc with protoc-gen-ts
            let mut cmd = Command::new("protoc");

            cmd.arg(format!("--proto_path={}", proto_path));
            cmd.arg(format!("--plugin=protoc-gen-ts={}", protoc_gen_ts));
            cmd.arg(format!(
                "--plugin=protoc-gen-js={}",
                "/Users/thesayyn/Documents/protoc-gen-ts/protoc-gen-js"
            ));
            cmd.arg(format!("--ts_out={}", ts_out));
            cmd.arg(format!("--js_out={}", ts_out));
            cmd.arg("--ts_opt=namespaces=false");
            cmd.arg("--ts_opt=import_suffix=.ts");
            cmd.arg("--ts_opt=runtime_package=https://cdn.skypack.dev/google-protobuf?dts");
            cmd.args(sources);

            // make sure it succedded
            assert!(cmd.status().is_ok(), "protoc has failed");
            assert_eq!(cmd.status().unwrap().code(), Some(0), "protoc has failed");

            cfg_if::cfg_if! {
                if #[cfg(debug_assertions)] {
                    dbg!("output: {}", &ts_out);
                }
            }
        }
    };
}

#[allow(unused_imports)]
pub(crate) use gen_test;