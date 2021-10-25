import ts from "typescript";
import { google_protobuf as descriptor } from "./compiler/descriptor";

const symbolMap = new Map<string, string>();
const dependencyMap = new Map<string, ts.Identifier>();
const mapMap = new Map<string, descriptor.DescriptorProto>();

function removeLeadingDot(name: string): string {
  return name.replace(/^\./, "");
}

function removeRootPackageName(name: string, packageName: string) {
  return removeLeadingDot(
    packageName ? name.replace(`${packageName}.`, "") : name,
  );
}

export function resetDependencyMap(): void {
  dependencyMap.clear();
}

export function setIdentifierForDependency(
  dependency: string,
  identifier: ts.Identifier,
): void {
  dependencyMap.set(dependency, identifier);
}

/**
 * @param {descriptor.DescriptorProto} descriptor
 */
function isMapEntry(desc: descriptor.DescriptorProto): boolean {
  return desc.options && desc.options.map_entry;
}

export function getMapDescriptor(
  typeName: string,
): descriptor.DescriptorProto | undefined {
  const desc = mapMap.get(typeName);

  // if (desc === undefined) {
  //   throw new Error(`Unable to find mapped type=${typeName}`);
  // }

  return desc;
}

export function getTypeIdentifier(
  rootDescriptor: descriptor.FileDescriptorProto,
  typeName: string,
): ts.Identifier | ts.QualifiedName {
  const path = symbolMap.get(typeName);

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(
      removeRootPackageName(typeName, rootDescriptor.package),
    );
    // return ts.factory.createTypeReferenceNode(
    //   removeRootPackageName(typeName, rootDescriptor.package),
    // );
  }

  const dep = dependencyMap.get(path);
  if (!dep) {
    throw new Error("Missing dependancy");
  }

  // return ts.factory.createPropertyAccessExpression(
  //   dep,
  //   removeLeadingDot(typeName),
  // );

  // Enum Case?
  // return ts.factory.createTypeReferenceNode(removeLeadingDot(typeName), []);
  return ts.factory.createQualifiedName(dep, removeLeadingDot(typeName));
}

export function getTypeReference(
  rootDescriptor: descriptor.FileDescriptorProto,
  typeName: string,
): ts.TypeReferenceNode {
  return ts.factory.createTypeReferenceNode(
    getTypeIdentifier(rootDescriptor, typeName),
  );
}

export function getTypeExpression(
  rootDescriptor: descriptor.FileDescriptorProto,
  typeName: string,
): ts.Expression {
  const path = symbolMap.get(typeName);

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(
      removeRootPackageName(typeName, rootDescriptor.package),
    );
    // throw new Error("Expected an expression");
  }

  const dep = dependencyMap.get(path);
  if (!dep) {
    throw new Error("Missing dependancy");
  }

  return ts.factory.createPropertyAccessExpression(
    dep,
    removeLeadingDot(typeName),
  );
}

/**
 * @param {descriptor.FileDescriptorProto | descriptor.DescriptorProto} targetDescriptor
 * @param {string} path
 * @param {string} prefix
 */
export function preprocess(
  targetDescriptor: descriptor.DescriptorProto | descriptor.FileDescriptorProto,
  path: string,
  prefix: string,
): void {
  const replaceDoubleDots = (name: string) => name.replace(/\.\./g, ".");

  targetDescriptor.enum_type.forEach((enumDescriptor) => {
    symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
  });

  let messages: descriptor.DescriptorProto[];

  if (targetDescriptor instanceof descriptor.FileDescriptorProto) {
    messages = targetDescriptor.message_type;
  } else {
    messages = targetDescriptor.nested_type;
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const messageDescriptor = messages[index];

    const name = replaceDoubleDots(`${prefix}.${messageDescriptor.name}`);

    if (isMapEntry(messageDescriptor)) {
      mapMap.set(name, messageDescriptor);
      messages.splice(index, 1);
      // eslint-disable-next-line no-continue
      continue;
    }

    symbolMap.set(name, path);
    preprocess(messageDescriptor, path, name);
  }
}
