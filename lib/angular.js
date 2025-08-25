const path = require("path");
const { run } = require("./proc");
const { writeFileSafe } = require("./fs-utils");

function setupAngular(projectName, ui, pmCfg, args, log) {
  log(`→ Creating Angular app: ${projectName}`);
  const ngArgs = ["@angular/cli@latest", "new", projectName, "--routing", "--style=css", "--standalone"];
  const exec = pmCfg.exec(ngArgs[0], ngArgs.slice(1));
  run(exec[0], exec[1]);

  const projectDir = path.resolve(process.cwd(), projectName);
  process.chdir(projectDir);

  // Angular prefers HttpClient; make axios optional
  const core = [];
  if (args.axios === true) core.push("axios");
  if (args.zod === true) core.push("zod");

  let uiPkgs = [];
  if (ui === "material") {
    log("→ Adding Angular Material");
    const addM = pmCfg.exec("ng", ["add", "@angular/material", "--skip-confirmation"]);
    run(addM[0], addM[1]);
  } else if (ui === "bootstrap") {
    uiPkgs = ["bootstrap"];
  } else if (ui === "tailwind") {
    uiPkgs = ["tailwindcss@^3.4.0", "postcss", "autoprefixer"];
  } else if (ui === "primeng") {
    uiPkgs = ["primeng", "primeicons"];
  }

  if (core.length + uiPkgs.length) {
    log("→ Installing core/ui packages");
    run(pmCfg.i[0], [...pmCfg.i[1], ...core, ...uiPkgs]);
  }

  if (ui === "tailwind") {
    log("→ Initializing Tailwind (Angular)");
    const ex = pmCfg.exec("tailwindcss", ["init", "-p"]);
    run(ex[0], ex[1]);
    writeFileSafe(path.join(projectDir, "tailwind.config.js"), `/** @type {import('tailwindcss').Config} */
module.exports = { content: ["./src/**/*.{html,ts}"], theme: { extend: {} }, plugins: [] };`);
    writeFileSafe(path.join(projectDir, "src", "styles.css"), `@tailwind base;
@tailwind components;
@tailwind utilities;`);
  }

  if (ui === "bootstrap") {
    const stylesPath = path.join(projectDir, "src", "styles.css");
    writeFileSafe(stylesPath, `@import 'bootstrap/dist/css/bootstrap.min.css';\n`);
  }
  if (ui === "primeng") {
    const stylesPath = path.join(projectDir, "src", "styles.css");
    writeFileSafe(stylesPath, `@import 'primeng/resources/themes/lara-light-blue/theme.css';
@import 'primeng/resources/primeng.min.css';
@import 'primeicons/primeicons.css';\n`);
  }

  log("\n✅ Angular app ready.");
}

module.exports = { setupAngular };
