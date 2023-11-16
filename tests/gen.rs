mod helper;

use helper::e2e::gen_test;

gen_test!(test_basic, "tests/basic");

gen_test!(test_import_strategy, "tests/import_strategy");

gen_test!(test_conformance, "tests/conformance");

gen_test!(test_well_known, "tests/well_known");

gen_test!(test_grpc_web, "tests/grpc_web");