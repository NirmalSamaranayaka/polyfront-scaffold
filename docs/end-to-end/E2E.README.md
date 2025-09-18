# Polyfront Scaffold — Verification Guide (Aligned to `scripts/verify-once.js`) 🚀✨🧩

A unified guide for the matrix runner that **scaffolds**, **typechecks**, **builds**, and **runs unit tests** across permutations (React Vite, React Webpack, Angular), UIs, languages, stores, and date libs — all inside a clean **`sandbox/`** directory. It is designed to run consistently across Windows, macOS, and Linux, with no reliance on bash‑only features. 🧪⚙️📦

> **TL;DR** 👉⚡️🧭
>
> - Quick matrix: `npm run verify:matrix:quick`
> - Full matrix:  `npm run verify:matrix:full`
> - Fast & parallel: `PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full`
> - Watch one app: `npm run verify:watch -- my-app --framework react-vite --ts --ui mui --store none --test-unit vitest --test-e2e none`
>
> **Note:** The current `scripts/verify-once.js` **does not (yet) run E2E**. E2E remains a roadmap item below. 🗺️⏭️🧷

---

## Table of Contents 📚🧭🧱

- [Polyfront Scaffold — Verification Guide (Aligned to `scripts/verify-once.js`) 🚀✨🧩](#polyfront-scaffold--verification-guide-aligned-to-scriptsverify-oncejs-)
  - [Table of Contents 📚🧭🧱](#table-of-contents-)
  - [Prerequisites 🧰🧵🔧](#prerequisites-)
  - [Install / Setup 🏗️📦🔩](#install--setup-️)
    - [Recommended root devDependencies 🧱🧑‍💻⚙️](#recommended-root-devdependencies-️)
    - [`package.json` scripts 📜🧩🧰](#packagejson-scripts-)
  - [Core Concepts 🧠🗂️🔁](#core-concepts-️)
  - [Fast Execution Toolkit 🏎️⚡️🧰](#fast-execution-toolkit-️️)
  - [Commands 🧾🧭▶️](#commands-️)
    - [Env var examples 🧪🖥️🔌](#env-var-examples-️)
  - [Matrices (exact, as in code) 🧮🧰🔬](#matrices-exact-as-in-code-)
    - [QUICK (from `QUICK_BASE`) 🫐⚡️🧩](#quick-from-quick_base-️)
    - [FULL (from `FULL_BASE`) 🧺📚🧱](#full-from-full_base-)
  - [Ordering 🗂️🔢🧭](#ordering-️)
  - [Languages 🗣️📦🧪](#languages-️)
  - [Sandbox Policy 🏝️📁🧹](#sandbox-policy-️)
  - [Tool Detection (builder/tester) 🧰🔎📦](#tool-detection-buildertester-)
  - [Speed \& Scalability 🚀📈🧵](#speed--scalability-)
  - [Troubleshooting 🧰🧯🔧](#troubleshooting-)
  - [CI Examples 🧪🛠️📦](#ci-examples-️)
    - [GitHub Actions (full + fast) 🐙⚙️🚚](#github-actions-full--fast-️)
    - [Azure Pipelines (quick) ☁️🧰🚀](#azure-pipelines-quick-️)
  - [Environment Variables 🧾⚙️🧬](#environment-variables-️)
  - [Roadmap: E2E Phase 🧭🧪🧱](#roadmap-e2e-phase-)
  - [File Map 🗺️📁🧭](#file-map-️)
  - [Ready to go 🎯🚀🧩](#ready-to-go-)

---

## Prerequisites 🧰🧵🔧

- **Node.js 18+** (20+ recommended; CI covers Node 20 & 22)
- **npm** (pnpm/yarn also fine)
- Windows (PowerShell/CMD/Git Bash), macOS, or Linux

> For speed and fewer prompts, install common dev tools at the **repo root**. ⚡️🏎️📦

---

## Install / Setup 🏗️📦🔩

### Recommended root devDependencies 🧱🧑‍💻⚙️

```bash
npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript jsdom
npm i -D cross-env execa kleur fs-extra chokidar ora
```

**Why**: the runner resolves binaries in this order: **app → repo root → npx**. Root installs avoid slow interactive prompts. 🚦🧭⚡️

### `package.json` scripts 📜🧩🧰

```json
{
  "scripts": {
    "verify:matrix:quick": "cross-env PF_MATRIX=quick node scripts/verify-once.js",
    "verify:matrix:full":  "cross-env PF_MATRIX=full  node scripts/verify-once.js",
    "verify:watch":        "node scripts/watch-verify.js",
    "clean:sandbox":       "node -e \"require('fs').rmSync('sandbox',{recursive:true,force:true})\""
  }
}
```

> If `cross-env` isn’t installed, set env vars inline (examples below). 🧭🪄🔧

---

## Core Concepts 🧠🗂️🔁

- **Sandbox**: All apps are generated under **`sandbox/`**.
- **Job name**: `app-<fw>-<lang>-<ui>-<store>-<unit>-<e2e>-<date>` (e.g. `app-react-vite-ts-mui-none-vitest-none-date-fns`).
- **Pipeline (per app)**
  1. Scaffold (your CLI in `bin/index.js`)
  2. **Install is intentionally skipped** unless `**`node_modules`**` already exist
  3. Typecheck (`tsc -b --noEmit`) — **non‑fatal** (warn & continue)
  4. Build (Vite/Webpack/Angular auto-detected)
  5. Unit tests (Vitest `--environment=jsdom` or Jest `--ci`)
- **Watch mode**: Continuously regenerates **one** app while you iterate. 🔁🧩🧪

**Recommended project layout (React):** 🗺️📁🏗️

```
src/
  api/ assets/ components/ context/ features/ hooks/ i18n/
  layout/ pages/ routes/ services/ store/ styles/ tests/ utils/
```

**Env files scaffolded:** 🧾🔐🧩

```
.env.development
.env.test
.env.production
.env.example
```

---

## Fast Execution Toolkit 🏎️⚡️🧰

- **Parallelism**: `PF_CONCURRENCY=<n>` (default = CPU cores − 1)
- **Fast mode**: `PF_FAST=fw-lang-first` → only the first job per **(framework,language)** runs full **build + unit**; others **typecheck only**
- **Skip steps**: `PF_SKIP_TSC=1`, `PF_SKIP_TESTS=1`
- **Build caches** (put in templates):
  - Webpack: `{ cache: { type: 'filesystem', cacheDirectory: '.webpack-cache' } }`
  - Vite: `cacheDir: '.vite-cache'`
- **Lean builds**: Vite `minify: 'esbuild', sourcemap: false`; Webpack `devtool: false`, `optimization.minimize: false`

---

## Commands 🧾🧭▶️

```bash
# Quick matrix
npm run verify:matrix:quick

# Full matrix
npm run verify:matrix:full

# Watch one app
npm run verify:watch -- \
  my-app --framework react-vite --ts --ui mui --store none \
  --test-unit vitest --test-e2e none --i18n --axios
```

**Single‑language runs:** 🎛️🧪🧭

```bash
# TypeScript only
npm run verify:matrix:full:ts

# JavaScript only (Angular remains TS)
npm run verify:matrix:full:js
```

**Cleanup sandbox:** 🧹📁✅

```bash
npm run clean:sandbox
```

### Env var examples 🧪🖥️🔌

- **Bash/zsh/Git Bash**
  ```bash
  PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full
  ```
- **PowerShell**
  ```powershell
  $env:PF_CONCURRENCY="6"; $env:PF_FAST="fw-lang-first"; npm run verify:matrix:full
  ```
- **CMD**
  ```cmd
  set PF_CONCURRENCY=6 && set PF_FAST=fw-lang-first && npm run verify:matrix:full
  ```

---

## Matrices (exact, as in code) 🧮🧰🔬

### QUICK (from `QUICK_BASE`) 🫐⚡️🧩

- **React Vite** — TS/JS × UIs: **mui, bootstrap, tailwind, antd**; `unit: vitest`, `date: date-fns`, `e2e: none`
- **React Webpack** — TS/JS × UIs: **bootstrap, tailwind, antd**; `unit: vitest`, `date: date-fns`, `e2e: none`
- **React Webpack** — one extra combo: **bootstrap** with `unit: jest`, `date: moment`, `e2e: none`
- **Angular** — TS only, **material**, `unit: none`, `e2e: none`

> **Note:** Some additional Vite/Jest or Chakra entries are commented out in code and therefore **not** part of the Quick set. 📝🔍🧷

### FULL (from `FULL_BASE`) 🧺📚🧱

- **React Webpack × UIs**: `mui, bootstrap, tailwind, antd, chakra` → `unit: jest`, `date: moment`
- **React Webpack × Stores**: `none, redux, mobx, react-query` (UI `chakra`, `unit: jest`, `date: moment`)
- **React Webpack × Dates**: `moment, dayjs, date-fns` (UI `chakra`, `unit: jest`)
- **React Vite × UIs**: `mui, chakra, tailwind` (TS/JS) → `unit: vitest`, `date: date-fns`
- **Angular × UIs**: `material, bootstrap, tailwind, primeng` (TS only)

> React variants expand across **TS** and **JS** per `PF_LANGS`. Angular remains **TS‑only**. 🧬🔁📌

---

## Ordering 🗂️🔢🧭

- **Frameworks** (default): `react-vite,react-webpack,angular` → `PF_ORDER`
- **UIs** (default): `mui,bootstrap,tailwind,antd,chakra` → `PF_UI_ORDER`

Jobs are grouped by UI order within a framework for deterministic output. 🧱🧷🧭

---

## Languages 🗣️📦🧪

- `PF_LANGS="ts,js"` by default
- React: TS + JS (restricted by `PF_LANGS`)
- Angular: **TS only** (enforced in code)

Examples: 🧩🧪📝

```bash
PF_LANGS=ts npm run verify:matrix:full
PF_LANGS=js npm run verify:matrix:full # Angular still TS
```

---

## Sandbox Policy 🏝️📁🧹

- Always writes to **`sandbox/`**
- If target exists and non‑empty → `PF_ON_EXISTS`:
  - `rename` (default): rename to `*-bak-YYYY-MM-DD_HH-MM-SS`
  - `overwrite`: delete & recreate
  - `skip`: leave as‑is, do not regenerate

---

## Tool Detection (builder/tester) 🧰🔎📦

The runner auto‑detects tooling from app **`**`node_modules`**`** first, then falls back to **repo root**, then **`npx`**. 🧭🧱🧩

- **Builder detection (order):** Vite → Webpack → Angular (presence of `angular.json` or `@angular/cli`)
- **Tester detection (precedence):**
  1. `package.json` **scripts**: if `test` mentions `jest` or `vitest`, that runner is chosen
  2. `devDependencies` / `dependencies` hints
  3. Binary presence in node\_modules or root

**Special case:** If a job is **React Vite** but the detector yields **Webpack**, the build step is **skipped** (to avoid mismatched runs in atypical templates). 🧯🚫🧭

---

## Speed & Scalability 🚀📈🧵

- `PF_CONCURRENCY=<n>` to parallelize
- `PF_FAST=fw-lang-first` to run only one **full** job per **(framework,language)**; others **typecheck-only**
- Skip knobs: `PF_SKIP_TSC`, `PF_SKIP_TESTS`
- Tool resolution: app → root → npx (preinstall root devDeps to avoid prompts)

---

## Troubleshooting 🧰🧯🔧

- **`cross-env: command not found`** → install or set envs inline
- **Webpack wants** `webpack-cli` → `npm i -D webpack webpack-cli` at repo root
- **Vite package not found** → `npm i -D vite`; ensure valid `vite.config.*`
- **Vitest** `document is not defined` → install `jsdom`; don’t force `environment: 'node'`
- **Angular** `--no-interactive` warning → remove deprecated flags in template
- **TS default import errors** → in template `tsconfig.json`:
  ```json
  { "compilerOptions": { "esModuleInterop": true, "allowSyntheticDefaultImports": true } }
  ```
- **Folder exists & nothing happens** → check `PF_ON_EXISTS`; use `overwrite` or run `npm run clean:sandbox`
- **Preflight logs** (helpful on Windows PATH issues) are printed before the install‑skip note 🧭🪪🧾

---

## CI Examples 🧪🛠️📦

### GitHub Actions (full + fast) 🐙⚙️🚚

```yaml
name: Verify Scaffold Matrix
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript jsdom
      - name: Full matrix (parallel + fast)
        env:
          PF_MATRIX: full
          PF_CONCURRENCY: '6'
          PF_FAST: fw-lang-first
          PF_ORDER: react-vite,react-webpack,angular
          PF_UI_ORDER: mui,bootstrap,tailwind,antd,chakra
          PF_LANGS: ts,js
          PF_ON_EXISTS: rename
        run: node scripts/verify-once.js
```

### Azure Pipelines (quick) ☁️🧰🚀

```yaml
trigger:
- main
pool: { vmImage: 'ubuntu-latest' }
steps:
- task: NodeTool@0
  inputs: { versionSpec: '22.x' }
- script: npm ci
- script: |
    npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript jsdom
    cross-env PF_MATRIX=quick node scripts/verify-once.js
```

---

## Environment Variables 🧾⚙️🧬

| Variable                     | Default                              | Purpose                                                                          |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `PF_MATRIX`                  | `quick`                              | Matrix preset (`quick`/`full`).                                                  |
| `PF_LANGS`                   | `ts,js`                              | Languages for React (Angular is TS‑only).                                        |
| `PF_ORDER`                   | `react-vite,react-webpack,angular`   | Framework execution order.                                                       |
| `PF_UI_ORDER`                | `mui,bootstrap,tailwind,antd,chakra` | UI order within a framework.                                                     |
| `PF_CONCURRENCY`             | CPU cores − 1                        | Parallel job count.                                                              |
| `PF_FAST`                    | `off`                                | `fw-lang-first` = only first job per (framework,language) runs full build+tests. |
| `PF_SKIP_TSC`                | `''`                                 | `1` to skip typechecking.                                                        |
| `PF_SKIP_TESTS`              | `''`                                 | `1` to skip unit tests.                                                          |
| `PF_ON_EXISTS`               | `rename`                             | `rename` / `overwrite` / `skip`.                                                 |
| `PF_CLI`                     | `bin/index.js`                       | Path to your scaffold CLI.                                                       |
| `PF_APP_NAME`                | `app-under-test`                     | Name used by `verify:watch`.                                                     |
| `CI`                         | `1`                                  | CI-friendly output.                                                              |
| `NG_CLI_ANALYTICS`           | `false`                              | Disable Angular analytics.                                                       |
| `ADBLOCK`                    | `1`                                  | Avoid ad-dependent downloads.                                                    |
| `BROWSERSLIST_DISABLE_CACHE` | `1`                                  | Reduce cache variability.                                                        |
| `NODE_ENV`                   | `development`                        | Default unless templates override.                                               |
| `npm_config_production`      | `false`                              | Keep devDeps if you install.                                                     |

---

## Roadmap: E2E Phase 🧭🧪🧱

E2E execution (Playwright/Cypress) is **not implemented** in the current `verify-once.js`. When added, the doc will include: 🛠️🧪🚀

- E2E runner selection (`PF_E2E_RUNNER`), port pool (`PF_E2E_PORT_RANGE`), readiness timeout (`PF_E2E_READY_MS`)
- Server spin‑up/teardown and artifact upload guidance
- Optional `PF_SKIP_E2E`

If you’d like, I can generate a code patch that adds minimal Playwright/Cypress support with the above toggles. 🧩📦🛠️

---

## File Map 🗺️📁🧭

- `scripts/verify-once.js` — matrix runner (ordering, concurrency, fast mode, skips, on‑exists, builder/tester detection)
- `scripts/watch-verify.js` — single‑app watch pipeline
- `bin/index.js` — your scaffold CLI
- `sandbox/` — generated apps
- `docs/` — place this as `docs/end-to-end/verification-guide.md` if desired

---

## Ready to go 🎯🚀🧩

```bash
# Quick smoke
npm run verify:matrix:quick

# Full coverage, fast & parallel
PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full

# Strict overwrite of existing sandbox apps
PF_ON_EXISTS=overwrite npm run verify:matrix:full

# Watch one app while iterating
npm run verify:watch -- my-new-app --framework react-vite --ts --ui mui --store none --test-unit vitest --test-e2e none --i18n --axios
```

