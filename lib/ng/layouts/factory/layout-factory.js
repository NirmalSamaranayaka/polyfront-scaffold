const path = require("path");
const { writeFileSafe } = require("../../../fs-utils");

function writeAngularLayout({ appDir, ui }) {
  const tsOut = path.join(appDir, "layout", "layout.component.ts");
  const htmlOut = path.join(appDir, "layout", "layout.component.html");
  const scssOut = path.join(appDir, "layout", "layout.component.scss");
  const { getLayoutSource } = require(`../providers/${ui}`);
  const src = getLayoutSource();
  writeFileSafe(tsOut, src.ts);
  writeFileSafe(htmlOut, src.html);
  writeFileSafe(scssOut, src.scss);
}

module.exports = { writeAngularLayout };