# Polyfront Scaffold — End-to-End Verification Guide

A tiny harness that **scaffolds**, **typechecks**, **builds**, and **tests** many app permutations to verify your generator across frameworks (React Vite, React Webpack, Angular), UIs, languages, and more — all inside a clean **`sandbox/`** directory.

> TL;DR
>
> * Quick matrix: `npm run verify:matrix:quick`
> * Full matrix: `npm run verify:matrix:full`
> * Fast/parallel: `PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full`
> * Watch a single app while you develop: `npm run verify:watch`

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Install / Setup](#install--setup)
* [Core Concepts](#core-concepts)
* [Commands](#commands)
* [Matrices](#matrices)
* [Ordering (Framework + UI)](#ordering-framework--ui)
* [Languages](#languages)
* [Sandbox behavior (on-exists policy)](#sandbox-behavior-on-exists-policy)
* [Speed & Scalability](#speed--scalability)
* [Troubleshooting](#troubleshooting)
* [Advanced Tips](#advanced-tips)
* [CI Example (GitHub Actions)](#ci-example-github-actions)
* [Appendix: Environment Variables (Full List)](#appendix-environment-variables-full-list)

---

## Prerequisites

* **Node.js 18+** (20+ recommended)
* **npm** (or pnpm/yarn if your workflow prefers; examples use npm)
* On **Windows**, you can use **PowerShell**, **CMD**, or **Git Bash**. Examples for all are below.

> If your templates expect build/test tools at app level, you’re fine.
> For faster, more reliable runs, install common tools at the **repo root** too (see below).

---

## Install / Setup

### 1) Install recommended root devDependencies (optional but fast)

From **repo root**:

```bash
npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript
npm i -D cross-env execa kleur fs-extra chokidar ora
# Vitest DOM tests:
npm i -D jsdom
```

Why? The verifier tries to resolve toolchain bins **from the app**, then **from the repo root**, and only then falls back to `npx`. Having them at the root eliminates slow “install?” prompts (e.g., `webpack-cli`) and speeds builds/tests.

### 2) Ensure scripts exist in `package.json`

```json
{
  "scripts": {
    "verify:matrix:quick": "cross-env PF_MATRIX=quick node scripts/verify-once.js",
    "verify:matrix:full":  "cross-env PF_MATRIX=full  node scripts/verify-once.js",
    "verify:watch":        "node scripts/watch-verify.js"
  }
}
```

> If `cross-env` is not installed, either install it (`npm i -D cross-env`) or set env vars inline (see shell examples below).

---

## Core Concepts

* **Sandboxed outputs**: Every app is generated under **`sandbox/`** (clean, disposable).

* **Job naming**: `app-<framework>-<lang>-<ui>-<store>-<unit>-<e2e>-<date>`, e.g.

  ```
  app-react-vite-ts-mui-none-vitest-none-date-fns
  ```

* **Pipeline** per app:

  1. Scaffold (your CLI in `bin/index.js`)
  2. (Optionally) Install deps if template created them (we detect `node_modules`)
  3. Typecheck (`tsc -b --noEmit`) — non-fatal: we warn and proceed
  4. Build (Vite/Webpack/Angular CLI auto-detected)
  5. Unit tests (Vitest uses **jsdom**; Jest uses `--ci`)

* **Watch mode**: Regenerates a **single** app whenever you change the generator’s source files.

---

## Commands

### Quick matrix

```bash
npm run verify:matrix:quick
```

### Full matrix

```bash
npm run verify:matrix:full
```

### Watch mode (single app you control)

```bash
npm run verify:watch
```

* Default app name: `app-under-test` (in `sandbox/`)
* Pass flags to your CLI after `--`. Example:

  ```bash
  npm run verify:watch -- \
    my-app --framework react-vite --ts --ui mui --store none --test-unit vitest --test-e2e none --i18n --axios
  ```
* Env var `PF_APP_NAME` controls the app folder name.

### Setting env vars per shell

* **Git Bash / macOS / Linux (bash/zsh)**

  ```bash
  PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full
  ```
* **PowerShell**

  ```powershell
  $env:PF_CONCURRENCY="6"; $env:PF_FAST="fw-lang-first"
  npm run verify:matrix:full
  ```
* **CMD**

  ```cmd
  set PF_CONCURRENCY=6 && set PF_FAST=fw-lang-first && npm run verify:matrix:full
  ```

---

## Matrices

Two presets are built in:

* **QUICK** — a tiny smoke test:

  * React Webpack (TS, Chakra, Jest)
  * React Vite (TS, MUI, Vitest)
  * Angular (TS, Material, no tests)

* **FULL** — broader coverage:

  * React Webpack across UIs (`chakra`,`mui`,`tailwind`,`antd`,`bootstrap`)
  * React Webpack across stores (`none`,`redux`,`mobx`,`react-query`)
  * React Webpack across dates (`moment`,`dayjs`,`date-fns`)
  * React Vite across UIs (`mui`,`chakra`,`tailwind`)
  * Angular across UIs (`material`,`bootstrap`,`tailwind`,`primeng`)

> **Languages:**
> React variants expand across **TS** and **JS** (configurable via `PF_LANGS=ts,js`).
> **Angular is TS-only** by design.

---

## Ordering (Framework + UI)

You can control both:

* **Framework order** (default): `react-vite,react-webpack,angular`

  * Env: `PF_ORDER="react-vite,react-webpack,angular"`

* **UI order** (default): `mui,bootstrap,tailwind,antd,chakra`

  * Env: `PF_UI_ORDER="mui,bootstrap,tailwind,antd,chakra"`

**Example:**

```bash
PF_ORDER="react-vite,react-webpack,angular" \
PF_UI_ORDER="mui,bootstrap,tailwind,antd,chakra" \
npm run verify:matrix:full
```

Within each framework, jobs are grouped by your **UI order**, then by the app name to keep things deterministic.

---

## Languages

* Default: `PF_LANGS="ts,js"`
* React Vite / React Webpack: both TS and JS are generated (unless you limit `PF_LANGS`)
* Angular is **always TS**, regardless of `PF_LANGS`.

**Examples:**

```bash
# TS only
PF_LANGS=ts npm run verify:matrix:full

# JS only (Angular will still be TS)
PF_LANGS=js npm run verify:matrix:full
```

---

## Sandbox behavior (on-exists policy)

The scripts always generate under **`sandbox/`**.
When a target folder already exists **and is not empty**, we apply `PF_ON_EXISTS`:

* `rename` (default): move existing to `*-bak-YYYY-MM-DD_HH-MM-SS`
* `overwrite`: delete existing and recreate
* `skip`: leave as-is, do not regenerate

**Examples:**

```bash
# default (rename)
npm run verify:matrix:full

# overwrite existing app folders
PF_ON_EXISTS=overwrite npm run verify:matrix:quick

# leave existing folders untouched, skip those jobs
PF_ON_EXISTS=skip npm run verify:matrix:full
```

---

## Speed & Scalability

### Parallelism

* Env: `PF_CONCURRENCY=<n>` (default: CPU cores minus 1)
* Example:

  ```bash
  PF_CONCURRENCY=6 npm run verify:matrix:full
  ```

### Fast mode

* Env: `PF_FAST=fw-lang-first`
  Only the **first** job per **(framework,language)** runs full **build + tests**; the rest **typecheck only**.

  ```bash
  PF_FAST=fw-lang-first PF_CONCURRENCY=6 npm run verify:matrix:full
  ```

### Skip steps

```bash
# Skip typecheck entirely
PF_SKIP_TSC=1 npm run verify:matrix:full

# Skip tests entirely
PF_SKIP_TESTS=1 npm run verify:matrix:full
```

### Tool resolution (faster than npx)

The runner resolves tools in this order:

1. App’s local `node_modules`
2. Repo root `node_modules` (install recommended devDeps)
3. `npx` fallback

This avoids interactive prompts like *“install webpack-cli?”* and makes builds consistent.

---

## Troubleshooting

### `bash: cross-env: command not found`

* Either install it (`npm i -D cross-env`) **or** set env vars inline:

  ```bash
  PF_CONCURRENCY=6 npm run verify:matrix:full
  ```

### Webpack: *“CLI for webpack must be installed… install webpack-cli?”*

* Install at the **repo root** once:

  ```bash
  npm i -D webpack webpack-cli
  ```

### Vite: *“Cannot find package 'vite' imported from … vite.config.ts.timestamp…”*

* Install at root: `npm i -D vite`
* Ensure your templates write a valid `vite.config.[ts|js]`.

### Vitest: *“ReferenceError: document is not defined”*

* This verifier runs Vitest with `--environment=jsdom`.
  If you still see it, ensure:

  ```bash
  npm i -D jsdom
  ```

  and the project doesn’t override the environment to `node`.

### Angular: *“Unknown argument: interactive / --no-interactive”*

* The runner uses `ng build` without deprecated flags.
  If your template adds `--no-interactive`, remove it in template scripts.

### TypeScript default import errors (React types)

* e.g., *“can only be default-imported using 'allowSyntheticDefaultImports'”*
  Add in your template **`tsconfig.json`**:

  ```json
  {
    "compilerOptions": {
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true
    }
  }
  ```

  And fix any component prop typing warnings.

### Folder exists & “nothing happens”

* You likely have `PF_ON_EXISTS=skip` or defaulted behavior and the folder was non-empty.
  Use:

  ```bash
  PF_ON_EXISTS=overwrite npm run verify:matrix:quick
  ```

  or manually remove `sandbox/`:

  ```bash
  npm run clean:sandbox
  ```

---

## Advanced Tips

* **Cache builds** in templates:

  * Webpack:

    ```js
    // webpack.config.js
    module.exports = {
      // ...
      cache: { type: 'filesystem', cacheDirectory: '.webpack-cache' }
    }
    ```
  * Vite:

    ```ts
    // vite.config.ts
    export default defineConfig({
      cacheDir: '.vite-cache'
    });
    ```
* **Faster CI builds**: turn off sourcemaps & minification for verification

  * Vite: `build: { sourcemap: false, minify: 'esbuild' }`
  * Webpack: `devtool: false`, `optimization: { minimize: false }`
* **pnpm shared store** (optional):

  ```bash
  corepack enable
  pnpm config set store-dir ~/.pnpm-store
  ```

---

## CI Example (GitHub Actions)

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
          cache: 'npm'

      - run: npm ci

      # Optional: preinstall toolchain in repo root for faster runs
      - run: npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript jsdom

      - name: Full matrix (parallel + fast mode)
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

---

## Appendix: Environment Variables (Full List)

| Variable         | Default                              | Purpose                                                                                       |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `PF_MATRIX`      | `quick`                              | Choose `quick` or `full` preset.                                                              |
| `PF_LANGS`       | `ts,js`                              | Which languages to generate (Angular is always TS).                                           |
| `PF_ORDER`       | `react-vite,react-webpack,angular`   | Framework priority (execution order).                                                         |
| `PF_UI_ORDER`    | `mui,bootstrap,tailwind,antd,chakra` | UI priority within a framework.                                                               |
| `PF_CONCURRENCY` | CPU cores − 1                        | Parallel job count.                                                                           |
| `PF_FAST`        | `off`                                | `fw-lang-first` to build+test only first job per (framework,language); others typecheck only. |
| `PF_SKIP_TSC`    | `''` (falsey)                        | `1` to skip typechecking across all jobs.                                                     |
| `PF_SKIP_TESTS`  | `''` (falsey)                        | `1` to skip tests across all jobs.                                                            |
| `PF_ON_EXISTS`   | `rename`                             | Behavior if app folder exists: `rename` / `overwrite` / `skip`.                               |
| `PF_CLI`         | `bin/index.js`                       | Path to your CLI binary if not at default.                                                    |
| `PF_APP_NAME`    | `app-under-test` (watch mode)        | Target app folder name used by `verify:watch`.                                                |

---


### File Map (for reference)

* `scripts/verify-once.js` — runs the matrix once (QUICK/FULL), with ordering, concurrency, fast mode, skips, on-exists handling.
* `scripts/watch-verify.js` — regenerates one app on source changes; ideal while building templates.
* `bin/index.js` — your scaffold CLI (consumed by the runner).
* `sandbox/` — where all generated apps are created.

---

## Ready to go

Common runs:

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

## Documentation
- 👉 [End-to-End Verification Guide](docs/n2n-verification-guide.md)
