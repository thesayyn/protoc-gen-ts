const plugin = require("./compiler/plugin");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const type = require("./type");
const descriptor = require("./descriptor");
const node = require("./rpc/node");
const server = require("./rpc/server");
const web = require("./rpc/web");

function createImport(identifier, moduleSpecifier) {
  return ts.factory.createImportDeclaration(
    undefined,
    undefined,
    ts.factory.createImportClause(undefined, ts.factory.createNamespaceImport(identifier)),
    ts.factory.createStringLiteral(moduleSpecifier)
  );
}

function replaceExtension(filename, extension = ".ts") {
  return filename.replace(/\.[^/.]+$/, extension)
}

/**
 * @typedef {{ unary_rpc_promise: boolean, grpc_package: string, target: "node" | "web" }} Options
 */

/**
 * @param {string | undefined | null} raw 
 * @returns {Options}
 */
function parseOptions(raw) {
  /** @type {Options} */
  const defaultValues = {
    unary_rpc_promise: false,
    grpc_package: "@grpc/grpc-js",
    target: "node"
  };

  /** @type {{ [K keyof ConfigParameters]: (value: string) => ConfigParameters[K] }} */
  const parsers = {
    unary_rpc_promise: (value) => value === "true",
    grpc_package: (value) => value,
  };

  /** @type {Partial<Options>} */
  const inputParams = {};

  // comma separated
  (raw || "").split(',').forEach(param => {
    const [key, value = "true"] = param.split('=', 2)

    if (key in parsers) {
      inputParams[key] = parsers[key](value);
    } else {
      inputParams[key] = value;
    }
  })

  // Legacy Environment variables
  const legacy = {
    ...(process.env.EXPERIMENTAL_FEATURES ? { unary_rpc_promise: true } : {}),
    ...(process.env.GRPC_PACKAGE_NAME ? { grpc_package: process.env.GRPC_PACKAGE_NAME } : {}),
  }

  return { ...defaultValues, ...legacy, ...inputParams }
}


// main
const request = plugin.CodeGeneratorRequest.deserialize(new Uint8Array(fs.readFileSync(0)));
const response = new plugin.CodeGeneratorResponse({
  supported_features: plugin.CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL
});

const options = parseOptions(request.parameter)

for (const descriptor of request.proto_file) {
  type.preprocess(descriptor, descriptor.name, `.${descriptor.package || ""}`);
}

for (const fileDescriptor of request.proto_file) {
  const name = replaceExtension(fileDescriptor.name);
  const pbIdentifier = ts.factory.createUniqueName("pb");
  const grpcIdentifier = ts.factory.createUniqueName("grpc");
  const grpcWebIdentifier = ts.factory.createUniqueName("web");

  // Will keep track of import statements
  const importStatements = [];

  // Create all named imports from dependencies
  for (const dependency of fileDescriptor.dependency) {
    const identifier = ts.factory.createUniqueName("dependency");
    const moduleSpecifier = replaceExtension(dependency, "");
    type.setIdentifierForDependency(dependency, identifier);
    const importedFrom = `./${path.relative(path.dirname(fileDescriptor.name), moduleSpecifier)}`;
    importStatements.push(createImport(identifier, importedFrom));
  }

  // Create all messages recursively
  let statements = [];

  // Process enums
  for (const enumDescriptor of fileDescriptor.enum_type) {
    statements.push(descriptor.createEnum(enumDescriptor));
  }

  // Process root messages
  for (const messageDescriptor of fileDescriptor.message_type) {
    statements = statements.concat(
      descriptor.processDescriptorRecursively(fileDescriptor, messageDescriptor, pbIdentifier)
    )
  }

  if (statements.length) {
    importStatements.push(createImport(pbIdentifier, "google-protobuf"));
  }

  if (fileDescriptor.service.length) {
    // Import grpc only if there is service statements
    importStatements.push(
      createImport(
        grpcIdentifier,
        options.grpc_package,
      )
    );

    // Import grc-web when the target is web
    if (options.target == "web") {
      importStatements.push(
        createImport(
          grpcWebIdentifier,
          "grpc-web",
        )
      );
    }

    if (options.target != "web") {
      statements.push(
        ...node.createServiceInterface(grpcIdentifier)
      );
    }

    // Create all services and clients
    for (const serviceDescriptor of fileDescriptor.service) {
      // target: node
      statements.push(
        server.createUnimplementedService(
          fileDescriptor,
          serviceDescriptor,
          grpcIdentifier
        )
      );

      // target: web via grpc-web
      if (options.target == "web") {
        statements.push(
          web.createServiceClient(
            fileDescriptor,
            serviceDescriptor,
            grpcWebIdentifier,
            options,
          )
        )
      }
      // target: node via @grpc/grpc-js or grpc (deprecated)
      else {
        statements.push(
          node.createServiceClient(
            fileDescriptor,
            serviceDescriptor,
            grpcIdentifier,
            options,
          )
        );
      }
    }
  }

  const { major, minor, patch } = request.compiler_version || { major: 0, minor: 0, patch: 0 };

  const doNotEditComment = ts.factory.createJSDocComment(
    `Generated by the protoc-gen-ts.  DO NOT EDIT!\n` +
    `compiler version: ${major}.${minor}.${patch}\n` +
    `source: ${fileDescriptor.name}\n` +
    `target: ${options.target}\n` +
    `git: https://github.com/thesayyn/protoc-gen-ts\n`
  );

  // Wrap statements within the namespace
  if (fileDescriptor.package) {
    statements = [
      doNotEditComment,
      ...importStatements,
      descriptor.createNamespace(fileDescriptor.package, statements),
    ]
  } else {
    statements = [
      doNotEditComment,
      ...importStatements,
      ...statements
    ];
  }

  const sourcefile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
  sourcefile.identifiers = new Set();

  const content = ts
    .createPrinter({
      newLine: ts.NewLineKind.LineFeed,
      omitTrailingSemicolon: true,
    })
    .printFile(sourcefile);

  response.file.push(new plugin.CodeGeneratorResponse.File({
    name,
    content
  }));

  // after each iteration we need to clear the dependency map to prevent accidental 
  // misuse of identifiers
  type.resetDependencyMap();
}

process.stdout.write(response.serialize());
