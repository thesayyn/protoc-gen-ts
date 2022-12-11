const { defineConfig } = require('cypress')
const child_process = require("child_process");
const path = require("path");

module.exports = defineConfig({
    e2e: {
        supportFile: false,
        specPattern: "web.spec.js",
        videosFolder: process.env.TEST_UNDECLARED_OUTPUTS_DIR,
        screenshotsFolder: process.env.TEST_UNDECLARED_OUTPUTS_DIR,
        setupNodeEvents: (on, config) => {
            const client_exec = path.resolve(process.cwd(), "client/client.sh");
            const server_exec = path.resolve(process.cwd(), "server_/server");

            const env = {
                ...process.env
            }
            const client_proc = child_process.spawn(client_exec, ["client"], {
                stdio: "inherit",
                env: env,
                cwd: path.join(process.cwd(), '../../')
            });
            client_proc.on("error", console.error);
            const server_proc = child_process.spawn(server_exec, {
                stdio: "inherit",
                env: env,
            });
            server_proc.on("error", console.error);

            return config;
        }
    }
})