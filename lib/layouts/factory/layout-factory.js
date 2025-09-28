const fs = require("fs");
const path = require("path");
const { writeIfMissing } = require("../../utils/page-writer");

/**
 * Create a layout component based on UI framework
 * @param {string} srcDir - source directory (e.g. "src")
 * @param {string} ui - UI framework (mui|antd|bootstrap|tailwind|chakra)
 * @param {string} extx - extension ("jsx" | "tsx")
 * @param {boolean} useTS - use TypeScript
 */
function createLayoutComponent(srcDir, ui, extx, useTS) {
  const layoutPath = path.join(srcDir, "layout", `Layout.${extx}`);
  if (fs.existsSync(layoutPath)) return;

  const { getLayoutSource } = require(`../adapters/${ui}`);
  const source = getLayoutSource(useTS);
  writeIfMissing(layoutPath, source);
}

module.exports = { createLayoutComponent };
