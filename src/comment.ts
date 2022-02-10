
import * as ts from "typescript";

export function addDeprecatedJsDoc<T extends ts.Node>(node: T, deprecated: boolean) {
    if (deprecated) {
        ts.addSyntheticLeadingComment(
        node,
        ts.SyntaxKind.MultiLineCommentTrivia,
        "* @deprecated",
        true,
        );
    }
    return node;
}