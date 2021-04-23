const os = require("os");
const fs = require("fs");

const platform = os.platform();
const arch = os.arch();

let build = `${platform}-${arch}`;
switch (platform) {
    case "darwin":
        if (arch === "x64") {
            build = 'osx-x86_64'
        }
        break;
    case "linux":
        if (arch === "x64") {
            build = 'linux-x86_64'
        } else if (arch === "x32") {
            build = 'linux-x86_32'
        } else if (arch == "arm64") {
            build = 'linux-aarch_64'
        }
        break;
    case "win32":
        if (arch === "x64") {
            build = 'win64'
        } else if (arch === "x86") {
            build = 'win32'
        }
        break;
}

const response = JSON.parse(fs.readFileSync(0).toString());

if ( response.message ) {
    throw new Error(response.message);
}

const releaseName = `protoc-${response.tag_name.replace(/v(.*?)/, "$1")}-${build}.zip`

let downloadUrl;

for (const asset of response.assets) {
    if (asset.name == releaseName) {
        downloadUrl = asset.browser_download_url;
        break;
    }
}

if ( !downloadUrl ) {
    throw new Error(`Can not find any release for the platform combination ${releaseName}`);
}

console.log(downloadUrl);