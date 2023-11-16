mod helper;

use pretty_assertions_sorted::assert_eq_sorted;
use helper::unit::compile;


#[test]
fn basic_enum() {
    let proto = r#"
syntax = "proto3";
    
enum HelpTopic {
    BUILD = 0;
    RUN = 2;
}
"#;
    let expected = r#"
export enum HelpTopic {
    BUILD = 0,
    RUN = 2
}
"#;
    assert_eq_sorted!(expected.trim_start(),  compile(&proto))
}
