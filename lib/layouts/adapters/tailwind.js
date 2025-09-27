const { source } = require("../tailwind/layout");

function getLayoutSource() {
  return source();
}

module.exports = { getLayoutSource };
