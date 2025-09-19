const path = require("path");
const fs = require("fs");
const { run } = require("./proc");
const { writeFileSafe } = require("./fs-utils");
const { react_app_main, react_index_css } = require("./react-common");
const { scaffoldReactProjectStructure } = require("./scaffold-react-project-structure");
const { addUnitTests, addE2ETests } = require("./tests");
const { writeReduxFiles, writeMobxFiles } = require("./store");

function setupReactWebpack(projectName, useTS, ui, args, pmCfg, log) {
  log = typeof log === "function" ? log : (...a) => console.log(...a);
  log(`→ Creating React app (Webpack) : ${projectName}`);

  // workspace
  fs.mkdirSync(projectName, { recursive: true });
  const projectDir = path.resolve(process.cwd(), projectName);
  process.chdir(projectDir);

  // basic HTML shell
  writeFileSafe(
    path.join(projectDir, "public", "index.html"),
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
  );

  // src
  const srcDir = path.join(projectDir, "src");
  writeFileSafe(path.join(srcDir, "index.css"), react_index_css(ui));
  writeFileSafe(
    path.join(srcDir, useTS ? "index.tsx" : "index.jsx"),
    react_app_main(ui, useTS).replace(/main\.tsx|main\.jsx/g, useTS ? "index.tsx" : "index.jsx")
  );

  // webpack config (plugins are required in the generated project, not by the CLI)
  writeFileSafe(
    path.join(projectDir, "webpack.config.js"),
    `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/${useTS ? "index.tsx" : "index.jsx"}',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    hot: true,
    port: 5173,
    historyApiFallback: true,
    open: false
  },
  module: {
    rules: [
      {
        test: /\\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader' }${ui === "tailwind" ? ", { loader: 'postcss-loader' }" : ""}
        ]
      },
      { test: /\\.(png|jpe?g|gif|svg)$/i, type: 'asset' }
    ]
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  plugins: [
    new HtmlWebpackPlugin({ template: 'public/index.html' })
  ]
};`
  );

  // babel
  writeFileSafe(
    path.join(projectDir, "babel.config.json"),
    JSON.stringify(
      {
        presets: [
          ["@babel/preset-env", { targets: { esmodules: true } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          ...(useTS ? [["@babel/preset-typescript"]] : []),
        ],
      },
      null,
      2
    )
  );

  // tsconfig
  if (useTS) {
    writeFileSafe(
      path.join(projectDir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            lib: ["ES2020", "DOM"],
            jsx: "react-jsx",
            strict: true,
            moduleResolution: "node",
            skipLibCheck: true,
            noEmit: true
          },
          include: ["src"]
        },
        null,
        2
      )
    );
  }

  // tailwind
  if (ui === "tailwind") {
    writeFileSafe(
      path.join(projectDir, "postcss.config.js"),
      `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`
    );
    writeFileSafe(
      path.join(projectDir, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};`
    );
  }

  // package.json (keep dev scripts simple)
  writeFileSafe(
    path.join(projectDir, "package.json"),
    JSON.stringify(
      {
        name: projectName,
        private: true,
        version: "0.0.0",
        scripts: {
          start: "webpack serve",
          build: "webpack --mode production",
          lint: useTS ? "eslint --ext .ts,.tsx src" : "eslint --ext .js,.jsx src",
          format: "prettier -w ."
        }
      },
      null,
      2
    )
  );

  // runtime deps
  const core = [
    "react",
    "react-dom",
    "react-router-dom",
    "@tanstack/react-query",
    "axios",
    "zod",
    "zustand",
    "clsx",
  ];

  let uiPkgs = [];
  if (ui === "mui") uiPkgs = ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"];
  else if (ui === "bootstrap") uiPkgs = ["bootstrap", "@popperjs/core"];
  else if (ui === "tailwind") uiPkgs = ["tailwindcss@^3.4.0", "postcss", "autoprefixer"];
  else if (ui === "antd") uiPkgs = ["antd"];
  else if (ui === "chakra")
    uiPkgs = ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion", "react-icons", "next-themes"];

  // date libs
  let datePkgs = [];
  if (args.date === "dayjs") datePkgs = ["dayjs"];
  else if (args.date === "date-fns") datePkgs = ["date-fns"];
  else if (args.date === "moment") datePkgs = ["moment"];

  // Add additional useful packages
  const additionalPkgs = useTS ? ["@types/react", "@types/react-dom"] : [];
  if (ui === "bootstrap") additionalPkgs.push("bootstrap-icons");
  else if (ui === "tailwind") additionalPkgs.push("@tailwindcss/forms", "@tailwindcss/typography");
  else if (ui === "mui") additionalPkgs.push("@mui/lab", "@mui/x-date-pickers");
  // Add common utility packages
  additionalPkgs.push("lodash-es", "date-fns");

  // dev deps — IMPORTANT: include TypeScript ESLint stack when TS is on
  const dev = [
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
    "html-webpack-plugin",
    "@babel/core",
    "babel-loader",
    "@babel/preset-env",
    "@babel/preset-react",
    ...(useTS ? ["typescript", "@babel/preset-typescript"] : []),
    "eslint",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "eslint-config-prettier",
    "prettier",
    "style-loader",
    "css-loader",
    ...(ui === "tailwind" ? ["postcss-loader"] : []),
    ...(useTS ? ["@typescript-eslint/parser", "@typescript-eslint/eslint-plugin"] : []),
  ];

  // install
  run(pmCfg.i[0], [...pmCfg.i[1], ...core, ...uiPkgs, ...datePkgs]);
  run(pmCfg.dev[0], [...pmCfg.dev[1], ...dev, ...additionalPkgs]);

  // scaffold files (routes, pages, etc.)
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

  // tests
  addUnitTests(projectDir, "webpack", useTS, args["test-unit"], pmCfg);
  addE2ETests(projectDir, "webpack", useTS, args["test-e2e"], pmCfg);

  log("\n✅ React (Webpack) app ready.");
}

module.exports = { setupReactWebpack };