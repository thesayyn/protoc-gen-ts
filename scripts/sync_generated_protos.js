const fs = require("fs");

const [, , source, dtsAndJs, dest] = process.argv;

const sourceDir = `./bazel-bin/${source}`;
const destDir = `./${dest || source}`;
const objects = fs.readdirSync(sourceDir);

let check = (object) => object.endsWith(".ts") && !object.endsWith(".spec.ts") && !object.endsWith(".d.ts");

if ( dtsAndJs ) {
    check = (object) => object.endsWith(".js");
}

for (const object of objects) {
    if (check(object)) {
        const sourcePath = `${sourceDir}/${object}`;
        const targetPath = `${destDir}/${object}`;

        fs.writeFileSync(targetPath, fs.readFileSync(sourcePath));
        
    }
}