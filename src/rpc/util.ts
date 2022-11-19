import * as ts from "typescript";
import * as type from "../type";
import * as descriptor from "../compiler/descriptor";

/**
 * Create typed parameter
 */
export function createParameter(
  name: string,
  typename?: ts.TypeNode,
  optional = false,
) {
  return ts.factory.createParameterDeclaration(
    undefined,
    undefined,
    undefined,
    name,
    optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    typename,
  );
}

export function getRPCOutputType(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReference(rootDescriptor, methodDescriptor.output_type);
}

export function getRPCOutputTypeExpr(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReferenceExpr(
    rootDescriptor,
    methodDescriptor.output_type,
  );
}

export function getRPCInputType(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReference(rootDescriptor, methodDescriptor.input_type);
}

export function getRPCInputTypeExpr(
  rootDescriptor: descriptor.FileDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
  return type.getTypeReferenceExpr(rootDescriptor, methodDescriptor.input_type);
}

export function getRPCPath(
  rootDescriptor: descriptor.FileDescriptorProto,
  serviceDescriptor: descriptor.ServiceDescriptorProto,
  methodDescriptor: descriptor.MethodDescriptorProto,
) {
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
export function isUnary(methodDescriptor: descriptor.MethodDescriptorProto) {
  return (
    methodDescriptor.client_streaming == false &&
    methodDescriptor.server_streaming == false
  );
}

export function isClientStreaming(
  methodDescriptor: descriptor.MethodDescriptorProto,
): boolean {
  return (
    methodDescriptor.client_streaming == true &&
    methodDescriptor.server_streaming == false
  );
}

export function isServerStreaming(
  methodDescriptor: descriptor.MethodDescriptorProto,
): boolean {
  return (
    methodDescriptor.client_streaming == false &&
    methodDescriptor.server_streaming == true
  );
}

export function isBidi(
  methodDescriptor: descriptor.MethodDescriptorProto,
): boolean {
  return (
    methodDescriptor.client_streaming == true &&
    methodDescriptor.server_streaming == true
  );
}
