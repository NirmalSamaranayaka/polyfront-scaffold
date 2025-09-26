const { createPages } = require("../page-factory");
const { homeSource } = require("../tailwind/home");
const { aboutSource } = require("../tailwind/about");
const { dashboardSource } = require("../tailwind/dashboard");
const { profileSource } = require("../tailwind/profile");

function createTailwindPages(pagesDir, extx, _ext, useTS, writeFileSafe) {
  return createPages(pagesDir, extx, useTS, writeFileSafe, {
    home: homeSource,
    about: aboutSource,
    dashboard: dashboardSource,
    profile: profileSource,
  });
}

module.exports = { createTailwindPages };
