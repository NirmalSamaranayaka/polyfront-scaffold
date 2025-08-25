const path = require("path");
const fs = require("fs");
const { run } = require("./proc");
const { writeFileSafe, updateJSON } = require("./fs-utils");
const { react_app_main, react_index_css } = require("./react-common");
const { scaffoldReactProjectStructure } = require("./scaffold-react-project-structure");
const { addUnitTests, addE2ETests } = require("./tests");
const { writeReduxFiles, writeMobxFiles } = require("./store");

function setupReactWebpack(projectName, useTS, ui, args, pmCfg, log) {
  log(`→ Creating React app (Webpack) : ${projectName}`);
  fs.mkdirSync(projectName, { recursive: true });
  const projectDir = path.resolve(process.cwd(), projectName);
  process.chdir(projectDir);

  writeFileSafe(path.join(projectDir, "public", "index.html"), `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${projectName}</title></head><body><div id="root"></div></body></html>
`);

  const srcDir = path.join(projectDir, "src");
  writeFileSafe(path.join(srcDir, "index.css"), react_index_css(ui));
  writeFileSafe(path.join(srcDir, useTS ? "index.tsx" : "index.jsx"), react_app_main(ui, useTS).replace(/main\.tsx|main\.jsx/g, useTS?"index.tsx":"index.jsx"));

  writeFileSafe(path.join(projectDir, "webpack.config.js"), `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/${useTS ? 'index.tsx' : 'index.jsx'}',
  mode: 'development',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.[contenthash].js', clean: true },
  devtool: 'source-map',
  devServer: { static: './public', hot: true, port: 5173, historyApiFallback: true },
  module: {
    rules: [
      { test: /\\.(ts|tsx|js|jsx)$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\\.css$/, use: ['style-loader', { loader: 'css-loader' }${ui==='tailwind' ? ", { loader: 'postcss-loader' }" : ""}] },
      { test: /\\.(png|jpe?g|gif|svg)$/i, type: 'asset' }
    ]
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  plugins: [ new HtmlWebpackPlugin({ template: 'public/index.html' }) ]
};`);

  writeFileSafe(path.join(projectDir, "babel.config.json"), JSON.stringify({
    presets: [
      ["@babel/preset-env", { targets: { esmodules: true } }],
      ["@babel/preset-react", { runtime: "automatic" }],
      ...(useTS ? [["@babel/preset-typescript"]] : [])
    ]
  }, null, 2));

  if (useTS) {
    writeFileSafe(path.join(projectDir, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        lib: ["ES2020", "DOM"],
        jsx: "react-jsx",
        strict: true,
        moduleResolution: "node",
        skipLibCheck: true
      },
      include: ["src"]
    }, null, 2));
  }

  if (ui === "tailwind") {
    writeFileSafe(path.join(projectDir, "postcss.config.js"), `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`);
    writeFileSafe(path.join(projectDir, "tailwind.config.js"), `/** @type {import('tailwindcss').Config} */
module.exports = { content: ["./public/index.html","./src/**/*.{js,jsx,ts,tsx}"], theme: { extend: {} }, plugins: [] };`);
  }

  writeFileSafe(path.join(projectDir, "package.json"), JSON.stringify({
    name: projectName,
    private: true,
    version: "0.0.0",
    scripts: {
      start: "webpack serve --open",
      build: "webpack --mode production",
      lint: useTS ? "eslint --ext .ts,.tsx src" : "eslint --ext .js,.jsx src",
      format: "prettier -w ."
    }
  }, null, 2));

  const core = ["react", "react-dom", "react-router-dom", "@tanstack/react-query", "axios", "zod", "zustand", "clsx"];
  let uiPkgs = [];
  if (ui === "mui") uiPkgs = ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"];
  else if (ui === "bootstrap") uiPkgs = ["bootstrap"];
  else if (ui === "tailwind") uiPkgs = ["tailwindcss@^3.4.0", "postcss", "autoprefixer"];
  else if (ui === "antd") uiPkgs = ["antd"];
  else if (ui === "chakra") uiPkgs = ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"];

  const dev = [
    "webpack", "webpack-cli", "webpack-dev-server", "html-webpack-plugin",
    "@babel/core", "babel-loader", "@babel/preset-env", "@babel/preset-react",
    ...(useTS ? ["typescript", "@babel/preset-typescript"] : []),
    "eslint", "eslint-plugin-react", "eslint-plugin-react-hooks", "eslint-config-prettier", "prettier",
    "style-loader", "css-loader",
    ...(ui === "tailwind" ? ["postcss-loader"] : [])
  ];

  run(pmCfg.i[0], [...pmCfg.i[1], ...core, ...uiPkgs]);
  run(pmCfg.dev[0], [...pmCfg.dev[1], ...dev]);

  writeFileSafe(path.join(projectDir, ".eslintrc.cjs"), `module.exports = {
  root: true,
  parser: ${useTS ? '"@typescript-eslint/parser"' : '"espree"'},
  plugins: [${useTS ? '"@typescript-eslint", ' : ''}"react", "react-hooks"],
  extends: ["eslint:recommended", ${useTS ? '"plugin:@typescript-eslint/recommended",' : ''} "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
  settings: { react: { version: "detect" } }
};`);
  writeFileSafe(path.join(projectDir, ".prettierrc"), '{ "singleQuote": false, "semi": true, "trailingComma": "all" }\n');

  scaffoldReactProjectStructure({
    projectDir,
    useTS,
    bundler: "webpack",
    ui,
    store: args.store,
    i18n: args.i18n === true,
    dateLib: args.date,
    axiosOn: args.axios === true,
    storeWriters: { redux: writeReduxFiles, mobx: writeMobxFiles },
  });

  addUnitTests(projectDir, "webpack", useTS, args["test-unit"], pmCfg);
  addE2ETests(projectDir, "webpack", useTS, args["test-e2e"], pmCfg);

  log("\n✅ React (Webpack) app ready.");
}

module.exports = { setupReactWebpack };
