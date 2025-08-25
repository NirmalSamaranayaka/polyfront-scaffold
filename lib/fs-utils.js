const fs = require("fs");
const path = require("path");

function writeFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function updateJSON(file, updater) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const updated = updater(json) || json;
  fs.writeFileSync(file, JSON.stringify(updated, null, 2));
}

module.exports = { writeFileSafe, updateJSON };
