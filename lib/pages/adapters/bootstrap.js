const { createPages } = require("../page-factory");
const { homeSource } = require("../bootstrap/home");
const { aboutSource } = require("../bootstrap/about");
const { dashboardSource } = require("../bootstrap/dashboard");
const { profileSource } = require("../bootstrap/profile");

function createBootstrapPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  return createPages(pagesDir, extx, useTS, writeFileSafe, {
    home: homeSource,
    about: aboutSource,
    dashboard: dashboardSource,
    profile: profileSource,
  });
}

module.exports = { createBootstrapPages };
