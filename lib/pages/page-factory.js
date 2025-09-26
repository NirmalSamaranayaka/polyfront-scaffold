const fs = require("fs");
const path = require("path");
const { writeIfMissing } = require("./utils/page-writer");

/**
 * Generic page generator (framework-specific sources injected by adapter)
 * @param {string} pagesDir
 * @param {string} extx
 * @param {boolean} useTS
 * @param {function} writeFileSafe
 * @param {object} sources - { home, about, dashboard, profile }
 */
function createPages(pagesDir, extx, useTS, writeFileSafe, sources) {
  if (!sources) throw new Error("Sources must be provided by adapter");

  fs.mkdirSync(pagesDir, { recursive: true });

  const pages = [
    { name: "Home",      source: () => sources.home(useTS) },
    { name: "About",     source: () => sources.about(useTS) },
    { name: "Dashboard", source: () => sources.dashboard(useTS) },
    { name: "Profile",   source: () => sources.profile(useTS) },
  ];

  for (const p of pages) {
    const out = path.join(pagesDir, `${p.name}.${extx}`);
    writeIfMissing(out, p.source(), writeFileSafe);
  }
}

module.exports = { createPages };
