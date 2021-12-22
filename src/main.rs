use std::{env, fs, path::Path, time::Instant};
use swc_atoms::JsWord;
use swc_common::FilePathMapping;
use swc_common::{input::SourceFileInput, source_map::SourceMap, sync::Lrc, SourceFile, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_utils::{
    ident::IdentLike, member_expr, private_ident, quote_ident, quote_str, undefined,
    DestructuringFinder, ExprFactory, Id,
};

fn main() {
    let main_file = env::args().nth(1).unwrap();

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let t = TsNamespaceExportDecl {
        span: DUMMY_SP,
        id: quote_ident!("test"),
    };

    let body: Vec<ModuleItem> = vec![ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
        span: DUMMY_SP,
        decl: Decl::TsModule(TsModuleDecl {
            id: TsModuleName::Ident(quote_ident!("test")),
            body: Some(TsNamespaceBody::TsModuleBlock(TsModuleBlock {
                span: DUMMY_SP,
                body: vec![],
            })),
            global: false,
            declare: false,
            span: DUMMY_SP,
        }),
    }))];

    let m = Module {
        span: DUMMY_SP,
        body: body,
        shebang: None,
    };

    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config {
                ..Default::default()
            },
            cm: cm.clone(),
            comments: None,
            wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
        };

        emitter.emit_module(&m).unwrap();
    }

    let code = String::from_utf8_lossy(&buf).to_string();
    fs::write("output.js", &code).unwrap();
}
