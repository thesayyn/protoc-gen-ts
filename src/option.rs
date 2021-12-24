use std::string::String;

pub struct Options {
    pub unary_rpc_promise: bool,
    pub grpc_package: String,
}

impl Options {
    pub fn parse(raw: &str) -> Options {
        let mut grpc_package = "@grpc/grpc-js";
        let mut unary_rpc_promise = false;

        let parts = raw.split(",");

        for part in parts {
            let mut kv = part.trim().split("=");
            let key = kv.next();
            match key {
                Some("grpc_package") => {
                    grpc_package = kv.next().unwrap_or("Expected a value for grpc_package")
                },
                Some("unary_rpc_promise") => {
                    unary_rpc_promise = kv.next().unwrap_or("Expected a value for unary_rpc_promise") == "true"
                },  
                // just silently ignore
                Some(_) => {}
                None => {}
            };
        }

        Options {
            grpc_package: String::from(grpc_package),
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
fn should_parse_an_evil_option() {
    let opt = Options::parse("= , grpc_package=mygrpcpackage ,unary_rpc_promise=true");
    assert_eq!(opt.grpc_package, "mygrpcpackage");
    assert_eq!(opt.unary_rpc_promise, true);
}