use std::{path::Path};
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
    sync::Lrc
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, StringInput, Syntax};

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let fm = cm
        .load_file(Path::new("test.ts"))
        .expect("failed to load test.ts");

    let lexer = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let capturing = Capturing::new(lexer);

    let mut parser = Parser::new_from(capturing);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    let _module = parser
        .parse_typescript_module()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("Failed to parse module.");

    // let j = serde_json::to_string(&_module).expect("can not serialize");

    // Print, write to a file, or send to an HTTP server.
    println!("{:?}", _module);

    // std::fs::write("output.json", &j).unwrap();

    println!("Tokens: {:?}", parser.input().take());
}
