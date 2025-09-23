
const fs = require("fs");
const path = require("path");
const { homeSource } = require("./home");
const { aboutSource } = require("./about");
const { dashboardSource } = require("./dashboard");
const { profileSource } = require("./profile");

// Fallback writer so this works even if caller forgets to pass one
function defaultWriteFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function writeIfMissing(filePath, content, writer) {
  if (!fs.existsSync(filePath)) (writer || defaultWriteFileSafe)(filePath, content);
}

function createMUIPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  fs.mkdirSync(pagesDir, { recursive: true });

  const pages = [
    { name: "Home",      source: () => homeSource() },
    { name: "About",     source: () => aboutSource() },
    { name: "Dashboard", source: () => dashboardSource(useTS) },
    { name: "Profile",   source: () => profileSource(useTS) },
  ];

  for (const p of pages) {
    const out = path.join(pagesDir, `${p.name}.${extx}`);
    writeIfMissing(out, p.source(), writeFileSafe);
  }

}

module.exports = { createMUIPages };
