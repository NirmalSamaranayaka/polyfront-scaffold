const path = require("path");
const { writeIfMissing } = require("../../../utils/page-writer");

function writeAngularLayout({ appDir, ui }) {
  const tsOut = path.join(appDir, "layout", "layout.component.ts");
  const htmlOut = path.join(appDir, "layout", "layout.component.html");
  const scssOut = path.join(appDir, "layout", "layout.component.scss");
  const { getLayoutSource } = require(`../providers/${ui}`);
  const src = getLayoutSource();
  writeIfMissing(tsOut, src.ts);
  writeIfMissing(htmlOut, src.html);
  writeIfMissing(scssOut, src.scss);
}

module.exports = { writeAngularLayout };