const descriptor = require("./compiler/descriptor");
const ts = require("typescript");


const symbolMap = new Map();
const dependencyMap = new Map();

function resetDependencyMap() {
  dependencyMap.clear();
}

function setIdentifierForDependency(dependency, identifier) {
  dependencyMap.set(dependency, identifier);
}

/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {string} typeName 
 */
function getTypeReference(rootDescriptor, typeName) {
  const path = symbolMap.get(typeName);

  const name = normalizeTypeName(typeName, rootDescriptor.package);

  if (!path || !dependencyMap.has(path)) {
    return ts.factory.createIdentifier(name)
  }

  return ts.factory.createPropertyAccessExpression(dependencyMap.get(path), name);
}



function normalizeTypeName(name, packageName) {
  return (packageName ? name.replace(`${packageName}.`, "") : name).replace(
    /^\./,
    ""
  );
}




/**
 * @param {descriptor.FileDescriptorProto | descriptor.DescriptorProto} descriptor
 * @param {string} path
 * @param {string} prefix
 */
function scan(descriptor, path, prefix) {

  const replaceDoubleDots = (name) => name.replace(/\.\./g, ".");

  for (const enumDescriptor of descriptor.enum_type) {
    symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
  }

  if (descriptor.message_type) {
    for (const messageDescriptor of descriptor.message_type) {
      const name = replaceDoubleDots(`${prefix}.${messageDescriptor.name}`);
      symbolMap.set(name, path);
      scan(messageDescriptor, path, name)
    }
  }
  if (descriptor.nested_type) {
    for (const nestedDescriptor of descriptor.nested_type) {
      const name = replaceDoubleDots(`${prefix}.${nestedDescriptor.name}`);
      symbolMap.set(name, path);
      scan(nestedDescriptor, path, name);
    }
  }
}

module.exports = { scan, getTypeReference, setIdentifierForDependency, resetDependencyMap }