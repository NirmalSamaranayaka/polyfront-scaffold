const { createPages } = require("../factory/page-factory");
const { homeSource } = require("../antd/home");
const { aboutSource } = require("../antd/about");
const { dashboardSource } = require("../antd/dashboard");
const { profileSource } = require("../antd/profile");

function createAntdPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  return createPages(pagesDir, extx, useTS, writeFileSafe, {
    home: homeSource,
    about: aboutSource,
    dashboard: dashboardSource,
    profile: profileSource,
  });
}

module.exports = { createAntdPages };
