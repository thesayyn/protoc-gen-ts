const path = require("path");
const descriptor = require("./compiler/descriptor");
const ts = require("typescript");
const { optionsFromRequestParameters } = require("./options");

const symbolMap = new Map();
const dependencyMap = new Map();
const mapMap = new Map();

function resetDependencyMap() {
  dependencyMap.clear();
}

function setIdentifierForDependency(dependency, identifier) {

  dependencyMap.set(dependency, identifier);
}

/**
 * @param {descriptor.DescriptorProto} descriptor
 */
function isMapEntry(descriptor) {
  return descriptor.options && descriptor.options.map_entry;
}

/**
 * @param {string} typeName
 * @returns {descriptor.DescriptorProto}
 */
function getMapDescriptor(typeName) {
  return mapMap.get(typeName);
}



/**
 * @param {descriptor.FileDescriptorProto} rootDescriptor
 * @param {string} typeName
 */
function getTypeReference(rootDescriptor, typeName) {
  const typePath = symbolMap.get(typeName);

  if (!typePath || !dependencyMap.has(typePath)) {
    return ts.factory.createIdentifier(removeRootPackageName(typeName, rootDescriptor.package))
  }

  const options = optionsFromRequestParameters()
  if (options.createNamespaces) {
    return ts.factory.createPropertyAccessExpression(
      dependencyMap.get(typePath),
      removeLeadingDot(typeName)
    );
  } else {
    return ts.factory.createPropertyAccessExpression(
      dependencyMap.get(typePath),
      removeLeadingDot(path.extname(typeName))
    );
  }
}

function removeLeadingDot(name) {
  return name.replace(/^\./, "");
}

function removeRootPackageName(name, packageName) {
  return removeLeadingDot(packageName ? name.replace(`${packageName}.`, "") : name);
}

/**
 * @param {descriptor.FileDescriptorProto | descriptor.DescriptorProto} targetDescriptor
 * @param {string} path
 * @param {string} prefix
 */
function preprocess(targetDescriptor, path, prefix) {

  const replaceDoubleDots = (name) => name.replace(/\.\./g, ".");

  for (const enumDescriptor of targetDescriptor.enum_type) {
    symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
  }


  /** @type {Array<descriptor.DescriptorProto>} */
  let messages;

  if ( targetDescriptor instanceof descriptor.FileDescriptorProto ) {
    messages = targetDescriptor.message_type;
  } else {
    messages = targetDescriptor.nested_type;
  }

  for (let index = messages.length - 1; index >= 0; index--) {
    const messageDescriptor = messages[index];
    const name = replaceDoubleDots(`${prefix}.${messageDescriptor.name}`);
    if (isMapEntry(messageDescriptor)) {
      mapMap.set(name, messageDescriptor);
      messages.splice(index, 1);
      continue;
    }

    symbolMap.set(name, path);
    preprocess(messageDescriptor, path, name);
  }
}

module.exports = { preprocess, getTypeReference, getMapDescriptor, setIdentifierForDependency, resetDependencyMap }
