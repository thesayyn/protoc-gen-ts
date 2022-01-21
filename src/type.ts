import * as descriptor from './compiler/descriptor.js';
import ts from 'typescript';

const symbolMap: Map<string, string> = new Map();
const dependencyMap: Map<string, ts.Identifier> = new Map();
const mapMap: Map<string, descriptor.DescriptorProto> = new Map();

export function resetDependencyMap()
{
    dependencyMap.clear();
}

export function setIdentifierForDependency(dependency: string, identifier: ts.Identifier)
{
    dependencyMap.set(dependency, identifier);
}

function isMapEntry(descriptor: descriptor.DescriptorProto): boolean {
    return descriptor?.options?.map_entry ?? false;
}

export function getMapDescriptor(typeName: string): descriptor.DescriptorProto|undefined {
    return mapMap.get(typeName);
}

export function getTypeReference(rootDescriptor: descriptor.FileDescriptorProto, typeName: string): ts.Identifier|ts.PropertyAccessExpression
{
    const path = symbolMap.get(typeName);

    if (!path || !dependencyMap.has(path))
    {
        return ts.factory.createIdentifier(removeRootPackageName(typeName, rootDescriptor.package))
    }

    return ts.factory.createPropertyAccessExpression(
        dependencyMap.get(path)!,
        removeLeadingDot(typeName)
    );
}

function removeLeadingDot(name: string): string
{
    return name.replace(/^\./, '');
}

function replaceDoubleDots(name: string): string
{
    return name.replace(/\.\./g, '.');
}

function removeRootPackageName(name: string, packageName: string): string
{
    return removeLeadingDot(packageName ? name.replace(`${packageName}.`, '') : name);
}

export function preprocess(targetDescriptor: descriptor.FileDescriptorProto|descriptor.DescriptorProto, path: string, prefix: string)
{
    for (const enumDescriptor of targetDescriptor.enum_type)
    {
        symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
    }

    const messages: descriptor.DescriptorProto[] = targetDescriptor instanceof descriptor.FileDescriptorProto
        ? targetDescriptor.message_type
        : targetDescriptor.nested_type;

    for (let index = messages.length - 1; index >= 0; index--)
    {
        const messageDescriptor = messages[index];
        const name = replaceDoubleDots(`${prefix}.${messageDescriptor.name}`);

        if (isMapEntry(messageDescriptor))
        {
            mapMap.set(name, messageDescriptor);
            messages.splice(index, 1);

            continue;
        }

        symbolMap.set(name, path);
        preprocess(messageDescriptor, path, name);
    }
}