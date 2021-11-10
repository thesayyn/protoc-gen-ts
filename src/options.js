const fs = require("fs");
const plugin = require("./compiler/plugin");

const options = {
  camelCaseMethodNames: false,
  createNamespaces: true
}

function optionsFromRequestParameters(parameter) {
  if (parameter) {
    if (parameter.includes('createNamespaces=false')) {
      options.createNamespaces = false;
    }
    if (parameter.includes('camelCaseMethodNames=true')) {
      options.camelCaseMethodNames = true;
    }
  }
  return options;
}

module.exports = {
  optionsFromRequestParameters
}
