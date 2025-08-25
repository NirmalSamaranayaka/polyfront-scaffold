#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// core helpers
const { log, warn } = require("../lib/log");
const { parseArgs, runInteractive } = require("../lib/args");
const { pkgManager } = require("../lib/pkg-manager");
const { ensureTargetDir } = require("../lib/target-dir");

// generators
const { setupReactVite } = require("../lib/react-vite");
const { setupReactWebpack } = require("../lib/react-webpack");
const { setupAngular } = require("../lib/angular");

(async function main() {
  const args = parseArgs(process.argv);

  const wantInteractive =
    args.interactive === true ||
    args["--interactive"] === true ||
    process.argv.includes("--interactive");

  if (wantInteractive) {
    const a = await runInteractive();
    args._ = [a.projectName];
    args.framework = a.framework;
    args.lang = a.lang;
    args.ui = a.ui;
    args.store = a.store;
    args["test-unit"] = a.unit;
    args["test-e2e"] = a.e2e;
    args.pm = a.pm;
    args.flat = a.flat;
    args.root = a.root;
  }

  const projectName = args._[0] || "my-app";
  const framework = String(args.framework).toLowerCase();
  const ui = String(args.ui).toLowerCase();
  const pm = String(args.pm).toLowerCase();
  const useTS = String(args.lang).toLowerCase() === "ts";

  // Decide output parent folder by framework
  const root = args.root === "." ? process.cwd() : path.resolve(process.cwd(), args.root);
  const sub = framework === "angular"
    ? path.join("Angular")
    : (framework === "react-webpack" ? path.join("React", "Webpack") : path.join("React", "Vite"));
  const parent = args.root === "." ? root : path.join(root, sub);
  fs.mkdirSync(parent, { recursive: true });

  // Handle existing target folder
  const onExists = String(args["on-exists"] || "prompt").toLowerCase();
  const { finalName } = await ensureTargetDir({
    parentDir: parent,
    projectName,
    onExists,
  });

  process.chdir(parent);
  const pmCfg = pkgManager(pm);

  if (framework === "react-vite") return setupReactVite(finalName, useTS, ui, args, pmCfg, log);
  if (framework === "react-webpack") return setupReactWebpack(finalName, useTS, ui, args, pmCfg, log);
  if (framework === "angular") return setupAngular(finalName, ui, pmCfg, args, log);

  warn(`Unknown framework: ${framework}. Use --framework react-vite|react-webpack|angular`);
})();
