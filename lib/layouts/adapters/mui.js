const { source } = require("../mui/layout");

function getLayoutSource(useTS) {
  return source(useTS);
}

module.exports = { getLayoutSource };
