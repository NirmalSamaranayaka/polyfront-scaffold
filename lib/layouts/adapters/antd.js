const { source } = require("../antd/layout");

function getLayoutSource(useTS) {
  return source(useTS);
}

module.exports = { getLayoutSource };
