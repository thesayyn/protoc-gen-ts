const fs = require("fs");
const path = require("path");

const [, , source, dtsAndJs, dest] = process.argv;

const sourceDir = path.join(".", "bazel-bin", source);
const destDir = path.join(".", dest || source);

let check = (object) =>
  object.endsWith(".ts") &&
  !object.endsWith(".spec.ts") &&
  !object.endsWith(".d.ts");

if (dtsAndJs) {
  check = (object) => object.endsWith(".js");
}

function sync(sourceDir, destDir) {
  const objects = fs.readdirSync(sourceDir);
  for (const object of objects) {
    const sourcePath = path.join(sourceDir, object);
    const targetPath = path.join(destDir, object);
    if (
      fs.statSync(sourcePath).isDirectory() &&
      !/.runfiles/.test(sourcePath)
    ) {
      sync(sourcePath, targetPath);
    } else if (check(object)) {
      fs.writeFileSync(targetPath, fs.readFileSync(sourcePath));
    }
  }
}

sync(sourceDir, destDir);
