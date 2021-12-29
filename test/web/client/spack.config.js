const { config } = require('@swc/core/spack')

module.exports = config({
    output: {
        path: process.argv[process.argv.length - 1],
        name: "app",
    },
});
