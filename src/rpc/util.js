const ts = require("typescript");
const type = require("../type");

/**
 * Create typed parameter
 * @param {string} name
 * @param {ts.TypeReferenceNode | ts.QualifiedName | undefined} typename
 */
function createParameter(name, typename, optional = false) {
    return ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        name,
        optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        typename,
    );
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function getRPCOutputType(rootDescriptor, methodDescriptor) {
    return type.getTypeReference(rootDescriptor, methodDescriptor.output_type);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function getRPCInputType(rootDescriptor, methodDescriptor) {
    return type.getTypeReference(rootDescriptor, methodDescriptor.input_type);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {descriptor.ServiceDescriptorProto} serviceDescriptor
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 */
function getRPCPath(rootDescriptor, serviceDescriptor, methodDescriptor) {
    let name = serviceDescriptor.name;
    if (rootDescriptor.package) {
        name = `${rootDescriptor.package}.${name}`;
    }
    return `/${name}/${methodDescriptor.name}`;
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isUnary(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == false &&
        methodDescriptor.server_streaming == false
    );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isClientStreaming(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == true &&
        methodDescriptor.server_streaming == false
    );
}

/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isServerStreaming(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == false &&
        methodDescriptor.server_streaming == true
    );
}
/**
 * @param {descriptor.MethodDescriptorProto} methodDescriptor
 * @returns {boolean}
 */
function isBidi(methodDescriptor) {
    return (
        methodDescriptor.client_streaming == true &&
        methodDescriptor.server_streaming == true
    );
}

module.exports = { createParameter, isBidi, isServerStreaming, isClientStreaming, isUnary, getRPCPath, getRPCInputType, getRPCOutputType, createParameter }