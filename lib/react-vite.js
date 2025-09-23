const path = require("path");
const { run } = require("./proc");
const { writeFileSafe, updateJSON } = require("./fs-utils");
const { react_app_main, react_index_css } = require("./react-common");
const { scaffoldReactProjectStructure } = require("./scaffold-react-project-structure");
const { addUnitTests, addE2ETests } = require("./tests");
const { writeReduxFiles, writeMobxFiles } = require("./store");

function setupReactVite(projectName, useTS, ui, args, pmCfg, _log) {
  const log = typeof _log === "function" ? _log : (...a) => console.log(...a);

  const template = useTS ? "react-ts" : "react";
  log(`→ Creating Vite React app: ${projectName} [${template}]`);

  /**
   * Newer create-vite asks:
   *  - Setting CI to discourage interactivity.
   *  - Forcing stdin to a pipe (non-TTY) and feeding answers:
   *      "n\n" → No to rolldown
   *      "n\n" → No to install+start
   */
  const create = pmCfg.create("vite@latest", [projectName, "--", "--template", template]);

  run(create[0], create[1], {
    env: {
      // all these help various CLIs choose non-interactive paths
      CI: "1",
      ADBLOCK: "1",
      // turn off colors (some prompt libs skip fancy UIs when not a TTY anyway)
      FORCE_COLOR: "0",
      NO_COLOR: "1",
      ...(process.env || {}),
    },
    // answer both prompts with "No"
    input: "n\nn\n",
  });

  const projectDir = path.resolve(process.cwd(), projectName);
  process.chdir(projectDir);

  // deps
  const core = [
    "react-router-dom",
    "@tanstack/react-query",
    "axios",
    "zod",
    "zustand",
    "clsx",
    "react",
    "react-dom",
  ];
  let uiPkgs = [];
  if (ui === "mui") uiPkgs = ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"];
  else if (ui === "bootstrap") uiPkgs = ["bootstrap", "@popperjs/core"];
  else if (ui === "tailwind") uiPkgs = ["tailwindcss@^3.4.0", "postcss", "autoprefixer"];
  else if (ui === "antd") uiPkgs = ["antd"];
  else if (ui === "chakra")
    uiPkgs = ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion", "react-icons", "next-themes"];

  // Add date library dependencies
  let datePkgs = [];
  if (args.date === "dayjs") datePkgs = ["dayjs"];
  else if (args.date === "date-fns") datePkgs = ["date-fns"];
  else if (args.date === "moment") datePkgs = ["moment"];

  // Add additional useful packages
  const additionalPkgs = ["@types/react", "@types/react-dom"];
   // Add UI-specific additional packages
  if (ui === "bootstrap") additionalPkgs.push("bootstrap-icons");
  else if (ui === "tailwind") additionalPkgs.push("@tailwindcss/forms", "@tailwindcss/typography");
  else if (ui === "mui") additionalPkgs.push("@mui/lab", "@mui/x-date-pickers");

// Add common utility packages
additionalPkgs.push("lodash-es", "date-fns");

  const devBase = [
    "eslint",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "eslint-config-prettier",
    "prettier",
    "vitest",
    "jsdom",
    "@testing-library/react",
    "@testing-library/jest-dom",
  ];
  const devTS = useTS
    ? ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser", "vite-tsconfig-paths", "@types/node"]
    : [];

  // install deps
  run(pmCfg.i[0], [...pmCfg.i[1], ...core, ...uiPkgs, ...datePkgs]);
  run(pmCfg.dev[0], [...pmCfg.dev[1], ...devBase, ...devTS, ...additionalPkgs]);

  // lint/format config
  writeFileSafe(
    path.join(projectDir, ".eslintrc.cjs"),
    `module.exports = {
  root: true,
  parser: ${useTS ? '"@typescript-eslint/parser"' : '"espree"'},
  plugins: [${useTS ? '"@typescript-eslint", ' : ''}"react", "react-hooks"],
  extends: ["eslint:recommended", ${useTS ? '"plugin:@typescript-eslint/recommended",' : ''} "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
  settings: { react: { version: "detect" } }
};`
  );
  writeFileSafe(path.join(projectDir, ".prettierrc"), '{ "singleQuote": false, "semi": true, "trailingComma": "all" }\n');

  // scripts
  updateJSON(path.join(projectDir, "package.json"), (pkg) => {
    pkg.scripts ||= {};
    pkg.scripts.test = "vitest --environment jsdom";
    pkg.scripts.lint = useTS ? "eslint --ext .ts,.tsx src" : "eslint --ext .js,.jsx src";
    pkg.scripts.format = "prettier -w .";
    return pkg;
  });

  // entry files
  const srcDir = path.join(projectDir, "src");
  writeFileSafe(path.join(srcDir, useTS ? "main.tsx" : "main.jsx"), react_app_main(ui, useTS));
  writeFileSafe(path.join(srcDir, "index.css"), react_index_css(ui));

  // Tailwind init (if chosen)
  if (ui === "tailwind") {
    const exec = pmCfg.exec("tailwindcss", ["init", "-p"]);
    run(exec[0], exec[1]);
    writeFileSafe(
      path.join(projectDir, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
export default { content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"], theme: { extend: {} }, plugins: [] };`
    );
  }

  scaffoldReactProjectStructure({
    projectDir,
    useTS,
    bundler: "vite",
    ui,
    store: args.store,
    i18n: args.i18n === true,
    dateLib: args.date,
    axiosOn: args.axios === true,
    storeWriters: { redux: writeReduxFiles, mobx: writeMobxFiles },
  });

  addUnitTests(projectDir, "vite", useTS, args["test-unit"], pmCfg);
  addE2ETests(projectDir, "vite", useTS, args["test-e2e"], pmCfg);

  log("\n✅ React (Vite) app ready.");
}

module.exports = { setupReactVite };
