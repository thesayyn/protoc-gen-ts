use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, ExportDecl, ModuleDecl, ModuleItem, TsModuleBlock, TsModuleDecl, TsModuleName,
    TsNamespaceBody,
};
use swc_ecma_utils::quote_ident;

pub fn wrap(name: &str, body: Vec<ModuleItem>) -> ModuleItem {
    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
        span: DUMMY_SP,
        decl: Decl::TsModule(Box::new(TsModuleDecl {
            id: TsModuleName::Ident(quote_ident!(name)),
            body: Some(TsNamespaceBody::TsModuleBlock(TsModuleBlock {
                span: DUMMY_SP,
                body,
            })),
            global: false,
            declare: false,
            span: DUMMY_SP,
        })),
    }))
}
