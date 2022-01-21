import * as plugin from './compiler/plugin.js';
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import * as type from './type.js';
import * as descriptor from './descriptor.js';
import * as rpc from './rpc.js';
import * as rpcAsync from './async/rpc.js';

function createImport(identifier: ts.Identifier, moduleSpecifier: string): ts.ImportDeclaration
{
    return ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createImportClause(false, ts.factory.createNamespaceImport(identifier) as any, undefined),
        ts.factory.createStringLiteral(moduleSpecifier)
    );
}

function replaceExtension(filename: string, extension: string = ".ts"): string
{
    return filename.replace(/\.[^/.]+$/, extension)
}

export type ConfigParameters = {
    unary_rpc_promise: boolean,
    grpc_package: string,
    async: boolean,
};

const parsers: { [key: string]: (value: string) => any } = {
    unary_rpc_promise: (value: string) => value === 'true',
    grpc_package: (value: string) => value,
    async: (value: string) => value === 'true',
    no_namespace: (value: string) => value === 'true',
};

function parseParameters(parameters: string): ConfigParameters
{
    const defaultValues: ConfigParameters = {
        unary_rpc_promise: false,
        grpc_package: '@grpc/grpc-js',
        async: false,
    };

    const inputParams: Partial<ConfigParameters> = Object.fromEntries(parameters
        .split(',')
        .map(i => {
            const [ k, v ] = i.split('=', 2);

            return [ k, parsers[k]?.(v) ];
        })
    );

    // Legacy Environment variables
    const legacy = {
        ...(process.env.EXPERIMENTAL_FEATURES ? { unary_rpc_promise: true } : {}),
        ...(process.env.GRPC_PACKAGE_NAME ? { grpc_package: process.env.GRPC_PACKAGE_NAME } : {}),
    }

    const config = { ...defaultValues, ...legacy, ...inputParams };

    if(config.async === true && config.grpc_package === defaultValues.grpc_package)
    {
        throw new Error('Invalid configuration: `@grpc/grpc-js` is not compatible with async code generation. suggestion: use `@fyn-software/grpc` instead')
    }

    return config;
}

const request = plugin.CodeGeneratorRequest.deserialize(new Uint8Array(fs.readFileSync(0)));
const response = new plugin.CodeGeneratorResponse({
    supported_features: plugin.CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL,
    file: [],
});

const configParams = parseParameters(request.parameter);

for (const descriptor of request.proto_file)
{
    type.preprocess(descriptor, descriptor.name, `.${descriptor.package ?? ''}`);
}

for (const fileDescriptor of request.proto_file)
{
    const name = replaceExtension(fileDescriptor.name);
    const pbIdentifier = ts.factory.createUniqueName("pb");
    const grpcIdentifier = ts.factory.createUniqueName("grpc");

    // Will keep track of import statements
    const importStatements: ts.ImportDeclaration[] = [
        // Create all named imports from dependencies
        ...fileDescriptor.dependency.map((dependency: string) => {
            const identifier = ts.factory.createUniqueName(`dependency`);
            const moduleSpecifier = replaceExtension(dependency, '');
            type.setIdentifierForDependency(dependency, identifier);

            return createImport(
                identifier,
                `./${path.relative(path.dirname(fileDescriptor.name), moduleSpecifier)}`
            );
        }),

        createImport(pbIdentifier, 'google-protobuf'),
    ];

    // Create all messages recursively
    const statements: ts.Statement[] = [
        // Process enums
        ...fileDescriptor.enum_type.map(enumDescriptor => descriptor.createEnum(enumDescriptor)),

        // Process root messages
        ...fileDescriptor.message_type.flatMap(messageDescriptor =>
            descriptor.processDescriptorRecursively(fileDescriptor, messageDescriptor, pbIdentifier, configParams)
        ),
    ];

    if (fileDescriptor.service.length)
    {
        // Import grpc only if there is service statements
        importStatements.push(createImport(grpcIdentifier, configParams.grpc_package));

        if(configParams.async === false)
        {
            statements.push(
                ...rpc.createGrpcInterfaceType(fileDescriptor, grpcIdentifier, configParams)
            );
        }

        // Create all services and clients
        for (const serviceDescriptor of fileDescriptor.service)
        {
            if(configParams.async === false)
            {
                statements.push(
                    rpc.createUnimplementedService(
                        fileDescriptor,
                        serviceDescriptor,
                        grpcIdentifier,
                    )
                );
            }

            statements.push(
                (configParams.async ? rpcAsync : rpc).createServiceClient(
                    fileDescriptor,
                    serviceDescriptor,
                    grpcIdentifier,
                    configParams,
                )
            );
        }
    }

    const { major = 0, minor = 0, patch = 0 } = request.compiler_version;
    const doNotEditComment = ts.factory.createJSDocComment(
        `Generated by the protoc-gen-ts. DO NOT EDIT!\n` +
        `compiler version: ${major}.${minor}.${patch}\n` +
        `source: ${fileDescriptor.name}\n` +
        `git: https://github.com/thesayyn/protoc-gen-ts\n`
    ) as ts.Statement;

    // Configure file
    const sourceFile: ts.SourceFile = ts.factory.createSourceFile(
        [
            doNotEditComment,
            ...importStatements,
            ...(fileDescriptor.package
                ? [ descriptor.createNamespace(fileDescriptor.package, statements) ]
                : statements
            ),
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    );
    // @ts-ignore
    sourceFile.identifiers = new Set();

    const content = ts
        .createPrinter({
            newLine: ts.NewLineKind.LineFeed,
            omitTrailingSemicolon: true,
        })
        .printFile(sourceFile);

    response.file.push(new plugin.CodeGeneratorResponse.File({ name, content }));

    // after each iteration we need to clear the dependency map to prevent accidental
    // misuse of identifiers
    type.resetDependencyMap();
}

process.stdout.write(response.serialize());
