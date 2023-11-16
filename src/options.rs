use core::panic;
use std::string::String;

#[derive(Clone, Debug)]
pub struct Options {
    pub unary_rpc_promise: bool,
    pub grpc_server_package: String,
    pub grpc_web_package: String,
    pub runtime_package: String,
    pub base64_package: String,
    pub namespaces: bool,
    pub import_suffix: String
}

impl Options {
    pub fn parse(raw: &str) -> Options {
        let mut grpc_server_package = "@grpc/grpc-js";
        let mut grpc_web_package = "grpc-web";
        let mut runtime_package = "google-protobuf";
        let mut base64_package = "js-base64";
        let mut unary_rpc_promise = false;
        let mut namespaces = false;
        let mut import_suffix = "";

        let parts = raw.split(",");

        for part in parts {
            let mut kv = part.trim().split("=");
            let key = kv.next();
            if key.is_none() {
                panic!("option key can not be empty.")
            }
            match key.unwrap() {
                "grpc_web_package" => {
                    grpc_web_package = kv.next().expect("expected a value for grpc_web_package")
                }
                "grpc_server_package" => {
                    grpc_server_package = kv.next().expect("expected a value for grpc_server_package")
                }
                "runtime_package" => {
                    runtime_package = kv.next().expect("expected a value for runtime_package")
                }
                "base64_package" => {
                    base64_package = kv.next().expect("expected a value for base64_package")
                },
                "unary_rpc_promise" => {
                    unary_rpc_promise = kv.next().expect("expected a value for unary_rpc_promise") == "true"
                }  
                "no_namespace" => {
                    eprintln!("DEPRECATED: no_namespace option is deprecated. use namespaces=false instead");
                    namespaces = false
                }  
                "namespaces" => {
                    panic!("namespaces are broken!");
                    // namespaces = kv.next().expect("expected a value for unary_rpc_promise") == "true"
                }
                "import_suffix" => {
                    import_suffix = kv.next().expect("expected a value for import_suffix")
                }
                // just silently ignore
                option => {
                    eprintln!("WARNING: unknown option {}", option)
                }
            };
        }

        Options {
            grpc_server_package: grpc_server_package.to_string(),
            grpc_web_package: grpc_web_package.to_string(),
            runtime_package: runtime_package.to_string(),
            import_suffix: import_suffix.to_string(),
            base64_package: base64_package.to_string(),
            namespaces,
            unary_rpc_promise
        }
    }
}

#[test]
fn should_parse_empty() {
    let opt = Options::parse("");
    assert_eq!(opt.grpc_server_package, "@grpc/grpc-js");
    assert_eq!(opt.unary_rpc_promise, false);
}

#[test]
fn should_parse_grpc_package() {
    let opt = Options::parse("grpc_server_package=mygrpcpackage");
    assert_eq!(opt.grpc_server_package, "mygrpcpackage");
}

#[test]
fn should_parse_unary_promise() {
    let opt = Options::parse("unary_rpc_promise=true");
    assert_eq!(opt.unary_rpc_promise, true);
}

#[test]
fn should_parse_nontruthy_unary_promise() {
    let opt = Options::parse("unary_rpc_promise=false");
    assert_eq!(opt.unary_rpc_promise, false);
}

#[test]
fn should_ignore_unk_options() {
    let opt = Options::parse("ukn=1,unary_rpc_promise=true");
    assert_eq!(opt.unary_rpc_promise, true);
}


#[test]
fn should_parse_and_override() {
    let opt = Options::parse("unary_rpc_promise=false , grpc_server_package=mygrpcpackage ,unary_rpc_promise=true");
    assert_eq!(opt.grpc_server_package, "mygrpcpackage");
    assert_eq!(opt.unary_rpc_promise, true);
}

#[test]
fn should_parse_base64_package() {
    let opt = Options::parse("base64_package=mypkg");
    assert_eq!(opt.base64_package, "mypkg");
}


#[test]
fn should_parse_import_suffix() {
    let opt = Options::parse("import_suffix=.ts");
    assert_eq!(opt.import_suffix, ".ts");
}

#[test]
fn should_parse_grpc_web_package() {
    let opt = Options::parse("grpc_web_package=grpc-web-my");
    assert_eq!(opt.grpc_web_package, "grpc-web-my");
}

#[test]
fn should_parse_an_evil_option() {
    let opt = Options::parse("= , grpc_server_package=mygrpcpackage ,unary_rpc_promise=true");
    assert_eq!(opt.grpc_server_package, "mygrpcpackage");
    assert_eq!(opt.unary_rpc_promise, true);
}