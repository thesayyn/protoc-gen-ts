use std::string::String;

#[derive(Clone, Debug)]
pub struct Options {
    pub unary_rpc_promise: bool,
    pub grpc_package: String,
    pub runtime_package: String,
    pub base64_package: String,
    pub namespaces: bool,
    pub import_suffix: String
}

impl Options {
    pub fn parse(raw: &str) -> Options {
        let mut grpc_package = "@grpc/grpc-js";
        let mut runtime_package = "google-protobuf";
        let mut base64_package = "js-base64";
        let mut unary_rpc_promise = false;
        let mut namespaces = true;
        let mut import_suffix = "";

        let parts = raw.split(",");

        for part in parts {
            let mut kv = part.trim().split("=");
            let key = kv.next();
            match key {
                Some("grpc_package") => {
                    grpc_package = kv.next().expect("expected a value for grpc_package")
                }
                Some("unary_rpc_promise") => {
                    unary_rpc_promise = kv.next().expect("expected a value for unary_rpc_promise") == "true"
                }  
                Some("no_namespace") => {
                    eprintln!("DEPRECATED: no_namespace option is deprecated. use namespaces=false instead");
                    namespaces = false
                }  
                Some("namespaces") => {
                    namespaces = kv.next().expect("expected a value for unary_rpc_promise") == "true"
                }
                Some("import_suffix") => {
                    import_suffix = kv.next().expect("expected a value for import_suffix")
                }
                Some("runtime_package") => {
                    runtime_package = kv.next().expect("expected a value for runtime_package")
                }
                Some("base64_package") => {
                    base64_package = kv.next().expect("expected a value for base64_package")
                },
                // just silently ignore
                Some(option) => {
                    eprintln!("WARNING: unknown option {}", option)
                }
                None => panic!("option key can not be empty.")
            };
        }

        Options {
            grpc_package: grpc_package.to_string(),
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
    assert_eq!(opt.grpc_package, "@grpc/grpc-js");
    assert_eq!(opt.unary_rpc_promise, false);
}

#[test]
fn should_parse_grpc_package() {
    let opt = Options::parse("grpc_package=mygrpcpackage");
    assert_eq!(opt.grpc_package, "mygrpcpackage");
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
    let opt = Options::parse("unary_rpc_promise=false , grpc_package=mygrpcpackage ,unary_rpc_promise=true");
    assert_eq!(opt.grpc_package, "mygrpcpackage");
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
fn should_parse_an_evil_option() {
    let opt = Options::parse("= , grpc_package=mygrpcpackage ,unary_rpc_promise=true");
    assert_eq!(opt.grpc_package, "mygrpcpackage");
    assert_eq!(opt.unary_rpc_promise, true);
}