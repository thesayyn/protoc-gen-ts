const child_process = require("child_process");
const path = require("path");

module.exports = (on, config) => {
    const client_exec = path.resolve(process.cwd(), "test/web/client/client.sh");
    const server_exec = path.resolve(process.cwd(), "test/web/server_/server");

    let client_proc; 
    let server_proc;
    on('before:run', (details) => {
        const env = {
            ...process.env
        }
        delete env.RUNFILES_MANIFEST_FILE;
        client_proc = child_process.spawn(client_exec, ["--nobazel_node_patches"], {
            stdio: "inherit", 
            env: env
        });
        client_proc.on("error", console.error);
        server_proc = child_process.spawn(server_exec, {
            stdio: "inherit"
        });
        server_proc.on("error", console.error);
    })

    return config;
};

  