const { createPages } = require("../factory/page-factory");
const { homeSource } = require("../mui/home");
const { aboutSource } = require("../mui/about");
const { dashboardSource } = require("../mui/dashboard");
const { profileSource } = require("../mui/profile");

function createMUIPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  return createPages(pagesDir, extx, useTS, writeFileSafe, {
    home: homeSource,
    about: aboutSource,
    dashboard: dashboardSource,
    profile: profileSource,
  });
}

module.exports = { createMUIPages };
