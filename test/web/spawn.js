const runfiles = require("@bazel/runfiles");
const child_process = require("child_process");
const path = require("path");

module.exports = (on, config) => {
    const client_exec = runfiles.runfiles.resolvePackageRelative("client/client.sh");
    const server_exec = runfiles.runfiles.resolvePackageRelative("server_/server");

    let client_proc; 
    let server_proc;
    on('before:run', (details) => {
        console.log(client_exec)
        const env = {
            ...process.env
        }
        delete env.RUNFILES_MANIFEST_FILE;
        client_proc = child_process.spawn(client_exec, ["--nobazel_node_patches"], {
            stdio: "inherit", 
            env: env
        });
        server_proc = child_process.spawn(server_exec, {
            stdio: "inherit"
        });
    })

    return config;
};

  