const fs = require("fs");
const path = require("path");

function defaultWriteFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function writeIfMissing(filePath, content, writer = defaultWriteFileSafe) {
  if (!fs.existsSync(filePath)) writer(filePath, content);
}

module.exports = { writeIfMissing, defaultWriteFileSafe };
