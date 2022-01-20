import { DescriptorProto, FileDescriptorProto } from './compiler/descriptor.js';
import { factory, Identifier, PropertyAccessExpression } from 'typescript';
import { ConfigParameters } from './index.js';

const symbolMap: Map<string, string> = new Map();
const dependencyMap: Map<string, Identifier> = new Map();
const mapMap: Map<string, DescriptorProto> = new Map();
const packages: string[] = [];
let config: ConfigParameters;

export function initialize(configParameters: ConfigParameters): void
{
    config = configParameters;
}

export function resetDependencyMap()
{
    dependencyMap.clear();
}

export function setIdentifierForDependency(dependency: string, identifier: Identifier)
{
    dependencyMap.set(dependency, identifier);
}

function isMapEntry(descriptor: DescriptorProto): boolean {
    return descriptor?.options?.map_entry ?? false;
}

export function getMapDescriptor(typeName: string): DescriptorProto|undefined {
    return mapMap.get(typeName);
}

export function getTypeReference(rootDescriptor: FileDescriptorProto, typeName: string): Identifier|PropertyAccessExpression
{
    const path = symbolMap.get(typeName);

    if (!path || !dependencyMap.has(path))
    {
        return factory.createIdentifier(removeRootPackageName(typeName, rootDescriptor.package));
    }

    let name = removeLeadingDot(typeName);

    if(config.no_namespace)
    {
        const prefix = packages.find(p => name.startsWith(p));

        if(prefix)
        {
            name = name.replace(`${prefix}.`, '');
        }
    }


    return factory.createPropertyAccessExpression(
        dependencyMap.get(path)!,
        name,
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

export function preprocess(targetDescriptor: FileDescriptorProto|DescriptorProto, path: string, prefix: string)
{
    if(targetDescriptor instanceof FileDescriptorProto)
    {
        packages.push(targetDescriptor.package);
    }

    for (const enumDescriptor of targetDescriptor.enum_type)
    {
        symbolMap.set(replaceDoubleDots(`${prefix}.${enumDescriptor.name}`), path);
    }

    const messages: DescriptorProto[] = targetDescriptor instanceof FileDescriptorProto
        ? targetDescriptor.message_type
        : targetDescriptor.nested_type;

    for(const [ index, messageDescriptor ] of messages.entries())
    {
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