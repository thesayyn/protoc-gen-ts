const fs = require("fs");

const [, , source, dtsAndJs, dest] = process.argv;

const sourceDir = `./bazel-bin/${source}`;
const destDir = `./${dest || source}`;


let check = (object) => object.endsWith(".ts") && !object.endsWith(".spec.ts") && !object.endsWith(".d.ts");

if ( dtsAndJs ) {
    check = (object) => object.endsWith(".js");
}

function sync(sourceDir, destDir) {
    const objects = fs.readdirSync(sourceDir);
    for (const object of objects) {
        const sourcePath = `${sourceDir}/${object}`;
        const targetPath = `${destDir}/${object}`;
        if (fs.statSync(sourcePath).isDirectory() && !/.runfiles/.test(sourcePath)) {
            sync(sourcePath, targetPath)
        } else if (check(object)) {
            fs.writeFileSync(targetPath, fs.readFileSync(sourcePath));
        }
    }
}

sync(sourceDir, destDir);