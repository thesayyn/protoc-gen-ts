use protobuf_codegen::Codegen;
use std::{env, path::Path};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, SourceMap,
};
use swc_ecma_ast::{ClassMember, ModuleItem};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, StringInput, Syntax};

struct WktGen {
    types: Vec<(String, String)>,
    contents: String,
}

impl WktGen {
    pub fn new() -> Self {
        WktGen {
            types: vec![],
            contents: String::new(),
        }
    }
    fn ast(&self, input: String) -> Vec<ModuleItem> {
        let cm: Lrc<SourceMap> = Default::default();
        let handler = Handler::with_tty_emitter(ColorConfig::Never, true, true, Some(cm.clone()));
        let fm = cm.new_source_file(FileName::Real("build.ts".into()), input);
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let capturing = Capturing::new(lexer);
        let mut parser = Parser::new_from(capturing);

        let body = parser
            .parse_typescript_module()
            .map_err(|e| e.into_diagnostic(&handler).emit())
            .expect("Failed to parse module.")
            .body;

        let mut errors = String::new();
        for e in parser.take_errors() {
            errors.push_str(&e.into_diagnostic(&handler).message().to_string());
        }

        if errors.len() > 0 {
            panic!("{}", errors)
        }

        body
    }

    fn json_methods(&self, ast: ModuleItem) -> (String, ClassMember, ClassMember) {
        let decl = ast
            .as_stmt()
            .expect("expected stmt")
            .as_decl()
            .expect("expected decl")
            .as_class()
            .expect("expected class");
        let mut from_json: Option<ClassMember> = None;
        let mut to_json: Option<ClassMember> = None;
        for b in decl.class.body.clone() {
            if b.is_method() {
                let method = b.as_method().unwrap();
                let keyname = method
                    .key
                    .as_ident()
                    .expect("expected ident")
                    .sym
                    .to_string();
                if keyname == "fromJson" {
                    from_json = Some(b);
                } else if keyname == "toJson" {
                    to_json = Some(b);
                }
            }
        }
        if from_json.is_none() || to_json.is_none() {
            panic!("wkt: missing fromJson or toJson");
        }
        return (
            decl.ident.sym.to_string(),
            from_json.unwrap(),
            to_json.unwrap(),
        );
    }

    fn gen_wkt(&mut self, name: String, types: Vec<(String, String, String)>) {
        self.contents.push_str(&format!("pub mod r#{} {{", name));

        for (name, from_json, to_json) in types {
            self.contents.push_str(
                &"
pub mod r#[name] {
    use swc_ecma_ast::ClassMember;
    const FROM_JSON: &str = r#\"from_json_src\"#;
    pub fn from_json() -> ClassMember {
        serde_json::from_str::<ClassMember>(FROM_JSON).unwrap()
    }

    const TO_JSON: &str = r#\"to_json_src\"#;
    pub fn to_json() -> ClassMember {
        serde_json::from_str::<ClassMember>(TO_JSON).unwrap()
    }
}
"
                .replace("[name]", &name)
                .replace("from_json_src", &from_json)
                .replace("to_json_src", &to_json),
            )
        }

        self.contents.push_str("}\n");
    }

    pub fn build(&mut self, name: String, source: String) -> &mut Self {
        let mast = self.ast(source);

        let mut types: Vec<(String, String, String)> = vec![];

        for m in mast {
            let (type_name, from_json, to_json) = self.json_methods(m);
            self.types.push((
                format!("{}.proto#{}", name, type_name),
                format!("r#{}::r#{}", name, type_name.to_lowercase()),
            ));
            types.push((
                type_name.to_lowercase(),
                serde_json::to_string(&from_json).unwrap(),
                serde_json::to_string(&to_json).unwrap(),
            ));
        }

        self.gen_wkt(name, types);
        self
    }

    fn yield_mod(&mut self) {
        let out_dir = env::var_os("OUT_DIR").unwrap();
        let wkt_dir: std::path::PathBuf = Path::new(&out_dir).join("wkt");
        std::fs::create_dir_all(&wkt_dir).expect("failed to create wkt dir");
        let dest_path = wkt_dir.join("mod.rs");
        let mut arms = String::from("");

        for (t1, t2) in self.types.clone() {
            arms.push_str("\t\t");
            arms.push_str(&format!(
                r#""google/protobuf/{}#from_json" => Some({}::from_json()),"#,
                t1, t2
            ));
            arms.push_str("\n");
            arms.push_str("\t\t");
            arms.push_str(&format!(
                r#""google/protobuf/{}#to_json" => Some({}::to_json()),"#,
                t1, t2
            ));
            arms.push_str("\n");
        }
        self.contents.push_str(&format!(
            r#"
pub fn get_member(proto: &str, type_name: &str, member: &str) -> Option<swc_ecma_ast::ClassMember> {{
    match format!("{{}}#{{}}#{{}}", proto, type_name, member).as_str() {{
{}
        _ => None,
    }}
}}
"#,
            arms
        ));
        std::fs::write(&dest_path, &self.contents).unwrap();
    }
}

pub const STRUCT: &str = include_str!("./js/runtime/google_protobuf/struct.ts");
pub const ANY: &str = include_str!("./js/runtime/google_protobuf/any.ts");
pub const WRAPPERS: &str = include_str!("./js/runtime/google_protobuf/wrappers.ts");

fn main() {
    Codegen::new()
        .pure()
        .cargo_out_dir("protogen")
        .input("src/descriptor/descriptor.proto")
        .input("src/descriptor/plugin.proto")
        .include("src/descriptor")
        .run_from_script();

    WktGen::new()
        .build("struct".to_string(), STRUCT.to_string())
        .build("any".to_string(), ANY.to_string())
        .build("wrappers".to_string(), WRAPPERS.to_string())
        .yield_mod();
}
