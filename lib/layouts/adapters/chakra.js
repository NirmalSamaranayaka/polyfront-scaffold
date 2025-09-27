const { source } = require("../chakra/layout");

function getLayoutSource(useTS) {
  return source(useTS);
}

module.exports = { getLayoutSource };
