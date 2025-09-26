const { createPages } = require("../factory/page-factory");
const { homeSource } = require("../chakra/home");
const { aboutSource } = require("../chakra/about");
const { dashboardSource } = require("../chakra/dashboard");
const { profileSource } = require("../chakra/profile");

function createChakraPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  return createPages(pagesDir, extx, useTS, writeFileSafe, {
    home: homeSource,
    about: aboutSource,
    dashboard: dashboardSource,
    profile: profileSource,
  });
}

module.exports = { createChakraPages };
