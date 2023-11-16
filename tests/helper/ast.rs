use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
    sync::Lrc, FileName
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, StringInput, Syntax};
use std::io::Read;

fn main() {
    println!("> ");
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let mut input =  Vec::new();
    let stdin = std::io::stdin();
    let mut handle = stdin.lock();
    handle.read_to_end(&mut input).unwrap();
    let fm = cm.new_source_file(FileName::Real("stdin.ts".into()), String::from_utf8(input).unwrap());

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

    println!("{:#?}", parser
    .parse_typescript_module()
    .map_err(|e| e.into_diagnostic(&handler).emit())
    .expect("Failed to parse module.").body);
}
