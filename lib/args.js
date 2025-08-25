const readline = require("readline/promises");

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.includes("=") ? a.slice(2).split("=") : [a.slice(2), true];
      args[k] = v === true ? true : v;
    } else args._.push(a);
  }
  // aliases
  if (args.ts) args.lang = "ts";
  if (args.js || args.jsx || args.lang === "js") args.lang = "js";
  if (args.react) args.framework = "react-vite";
  if (args.angular || args.ng) args.framework = "angular";
  if (args.redux) args.store = "redux";
  if (args.mobx) args.store = "mobx";
  if (args.rq || args.reactquery || args.reactquert) args.store = "react-query";

  // defaults
  if (!args.framework) args.framework = "react-vite";
  if (!args.lang) args.lang = args.framework.startsWith("react") ? "ts" : "ts";
  if (!args.ui) args.ui = args.framework === "angular" ? "material" : "mui";
  if (!args.store) args.store = "none";
  if (!args.pm) args.pm = "npm";
  if (args.i18n === undefined) args.i18n = true;
  if (args.axios === undefined) args.axios = true;
  if (!args.date) args.date = "moment";
  if (args.flat) args.root = ".";
  if (!args.root) args.root = "Frontends";
  if (!args["on-exists"]) args["on-exists"] = "prompt"; // prompt|overwrite|rename|skip

  // tests
  if (!args["test-unit"]) args["test-unit"] = args.framework === "react-webpack" ? "jest" : "vitest";
  if (!args["test-e2e"]) args["test-e2e"] = "none";
  if (args["only-tests"] === undefined) args["only-tests"] = false;

  // normalize
  const mapStore = { "none":"none","redux":"redux","mobx":"mobx","react-query":"react-query","reactquery":"react-query","rq":"react-query" };
  args.store = mapStore[String(args.store).toLowerCase()] || "none";
  args.ui = String(args.ui).toLowerCase();
  args.date = String(args.date).toLowerCase();
  args.framework = String(args.framework).toLowerCase();
  args["test-unit"] = String(args["test-unit"]).toLowerCase();
  args["test-e2e"] = String(args["test-e2e"]).toLowerCase();

  return args;
}

async function ask(prompt, def="") {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ans = (await rl.question(`${prompt}${def ? ` (${def})` : ""}: `)).trim();
  rl.close();
  return ans || def;
}

async function runInteractive() {
  const projectName = await ask("Project name", "my-app");
  let framework = (await ask("Framework [react-vite | react-webpack | angular]", "react-vite")).toLowerCase();
  if (!["react-vite","react-webpack","angular"].includes(framework)) framework="react-vite";
  let lang = framework==="angular" ? "ts" : (await ask("Language [ts|js]", "ts")).toLowerCase();
  if (framework!=="angular" && !["ts","js"].includes(lang)) lang="ts";
  let ui = framework==="angular"
    ? (await ask("UI (Angular) [material|bootstrap|tailwind|primeng]", "material")).toLowerCase()
    : (await ask("UI (React) [mui|bootstrap|tailwind|antd|chakra]", "mui")).toLowerCase();
  if (framework==="angular" && !["material","bootstrap","tailwind","primeng"].includes(ui)) ui="material";
  if (framework!=="angular" && !["mui","bootstrap","tailwind","antd","chakra"].includes(ui)) ui="mui";
  let store = "none";
  if (framework!=="angular") {
    store = (await ask("State (React) [none|redux|mobx|react-query]", "none")).toLowerCase();
    if (!["none","redux","mobx","react-query"].includes(store)) store="none";
  }
  const unitDef = framework==="react-webpack" ? "jest" : (framework==="react-vite" ? "vitest" : "none");
  let unit = (await ask("Unit tests [jest|vitest|none]", unitDef)).toLowerCase();
  if (!["jest","vitest","none"].includes(unit)) unit = unitDef;
  let e2e = (await ask("E2E tests [none|cypress|playwright]", "none")).toLowerCase();
  if (!["none","cypress","playwright"].includes(e2e)) e2e="none";
  let pm = (await ask("Package manager [npm|pnpm|yarn|bun]", "npm")).toLowerCase();
  if (!["npm","pnpm","yarn","bun"].includes(pm)) pm="npm";
  const flatAns = (await ask("Generate into current directory? [y/N]", "N")).toLowerCase();
  const flat = flatAns === "y" || flatAns === "yes";
  const root = flat ? "." : await ask("Parent output folder", "Frontends");
  return { projectName, framework, lang, ui, store, unit, e2e, pm, flat, root };
}

module.exports = { parseArgs, runInteractive };
