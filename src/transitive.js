const type = require('./type');
const descriptor = require('./compiler/descriptor');
const ts = require('typescript');
const plugin = require("./compiler/plugin");

/**
 * 
 * @param {descriptor.FileDescriptorProto} descriptor 
 * @param {plugin.CodeGeneratorRequest} request 
 */
function reExport(descriptor, request) {
    const statements = [];
    for (const index of descriptor.public_dependency) {
        const dependency = descriptor.dependency[index];
        
    }
}

module.exports = {reExport}