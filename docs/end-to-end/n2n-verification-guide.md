# Polyfront Scaffold — End‑to‑End (N2N) Verification Guide

A compact harness that **scaffolds**, **typechecks**, **builds**, and **tests** many app permutations to validate your generator across frameworks (React Vite, React Webpack, Angular), UIs, languages, stores, and date libs — all in a clean **`sandbox/`**.

> **TL;DR**
>
> - Quick matrix: `npm run verify:matrix:quick`
> - Full matrix:  `npm run verify:matrix:full`
> - Parallel & fast: `PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full`
> - Watch single app: `npm run verify:watch -- my-app --framework react-vite --ts --ui mui --store none --test-unit vitest --test-e2e none --i18n --axios`

---

## What’s included / changed (high‑level)

- ✅ **Two matrices**: `quick` and `full` (see exact combos below)
- ✅ **Language expansion**: React matrices run for **TS** and **JS** (configurable with `PF_LANGS`); Angular stays **TS‑only**
- ✅ **Ordering controls**:
  - Framework order (`PF_ORDER`) — default: **react‑vite, react‑webpack, angular**
  - UI order (`PF_UI_ORDER`) — default: **mui, bootstrap, tailwind, antd, chakra** (your requested order)
- ✅ **Concurrency** via `PF_CONCURRENCY`
- ✅ **Fast mode**: `PF_FAST=fw-lang-first` → build + test only the first job per **(framework,language)**; others typecheck‑only
- ✅ **Skip flags**: `PF_SKIP_TSC=1`, `PF_SKIP_TESTS=1`
- ✅ **On‑exists policy** for `sandbox/` apps: `PF_ON_EXISTS=rename|overwrite|skip` (default **rename** with timestamp)
- ✅ **Robust tooling detection**: resolve **from app**, then **repo root**, then **npx** (prevents interactive CLIs like “install webpack‑cli?”)
- ✅ **Vitest jsdom** environment baked in
- ✅ **Angular** builds use `ng build` without deprecated `--no-interactive`
- ✅ **Typecheck failures** don’t abort the whole matrix (warn + continue)
- ✅ **Watch mode** to continuously scaffold/build/test a single app while you iterate

---

## Prerequisites

- **Node 18+** (Node 20 recommended)
- **npm** (or pnpm/yarn if preferred; examples use npm)
- On **Windows**, you can use **PowerShell**, **CMD**, or **Git Bash** (env var examples for each below)

> Your templates can install their own toolchains, but for **faster and more reliable** runs install common tools at the **repo root** once (next section).

---

## Setup (repo root)

### Recommended devDependencies (fast path)

```bash
npm i -D vite vitest webpack webpack-cli jest @angular/cli typescript jsdom
npm i -D cross-env execa kleur fs-extra chokidar ora
```

Why? The runner resolves binaries in this order:
1) **App** `node_modules`
2) **Repo root** `node_modules`  ← installing here avoids slow `npx` prompts
3) `npx` fallback

### `package.json` scripts

```json
{
  "scripts": {
    "verify:matrix:quick": "cross-env PF_MATRIX=quick node scripts/verify-once.js",
    "verify:matrix:full":  "cross-env PF_MATRIX=full  node scripts/verify-once.js",
    "verify:watch":        "node scripts/watch-verify.js"
  }
}
```

> If `cross-env` isn’t installed, set env vars inline (examples in **Running**).

Place the provided files here:
```
scripts/verify-once.js
scripts/watch-verify.js
```

---

## Exact matrices

### QUICK (smoke)

- **React Webpack**: `ts | chakra | store:none | unit:jest | e2e:none | date:moment`
- **React Vite**:    `ts | mui    | store:none | unit:vitest | e2e:none | date:date-fns`
- **Angular**:       `ts | material | unit:none | e2e:none | date:none`

> React entries are expanded by language according to `PF_LANGS` (default `ts,js`). Angular remains **TS only**.

### FULL (broad)

- **React Webpack — UIs:** `chakra, mui, tailwind, antd, bootstrap`
- **React Webpack — stores:** `none, redux, mobx, react-query` (UI fixed to `chakra`)
- **React Webpack — dates:** `moment, dayjs, date-fns` (UI `chakra`, store `none`)
- **React Vite — UIs:** `mui, chakra, tailwind`
- **Angular — UIs:** `material, bootstrap, tailwind, primeng`

All of the above React entries expand across **TS + JS** by default (control with `PF_LANGS`).

---

## Running

### Basic

```bash
# Quick smoke
npm run verify:matrix:quick

# Full coverage
npm run verify:matrix:full
```

### Parallel + fast

```bash
# Bash / zsh / Git Bash
PF_CONCURRENCY=6 PF_FAST=fw-lang-first npm run verify:matrix:full
```

**Windows shells**

- **PowerShell**
  ```powershell
  $env:PF_CONCURRENCY="6"; $env:PF_FAST="fw-lang-first"
  npm run verify:matrix:full
  ```
- **CMD**
  ```cmd
  set PF_CONCURRENCY=6 && set PF_FAST=fw-lang-first && npm run verify:matrix:full
  ```

### Ordering

```bash
# Framework order
PF_ORDER="react-vite,react-webpack,angular" # UI order (your requested sequence)
PF_UI_ORDER="mui,bootstrap,tailwind,antd,chakra" npm run verify:matrix:full
```

### Languages

```bash
# TS only (Angular remains TS)
PF_LANGS=ts npm run verify:matrix:full

# JS only (Angular still TS)
PF_LANGS=js npm run verify:matrix:full
```

### Sandbox behavior

```bash
# default: rename existing app folder to -bak-YYYY-MM-DD_HH-MM-SS
npm run verify:matrix:quick

# overwrite existing
PF_ON_EXISTS=overwrite npm run verify:matrix:full

# skip if exists
PF_ON_EXISTS=skip npm run verify:matrix:full
```

### Skip steps globally

```bash
PF_SKIP_TSC=1 npm run verify:matrix:full
PF_SKIP_TESTS=1 npm run verify:matrix:full
```

### Watch mode (single app)

```bash
npm run verify:watch --   my-app --framework react-vite --ts   --ui mui --store none --test-unit vitest --test-e2e none   --i18n --axios
```

- App folder: `sandbox/app-under-test` (override with `PF_APP_NAME`)
- Triggers on changes in `src/`, `templates/`, `generators/`, `packages/`, `bin/`, and root `*.ts|*.js`.

---

## Troubleshooting

### `bash: cross-env: command not found`
Install it or set env vars inline:
```bash
npm i -D cross-env
# or (bash/zsh):
PF_CONCURRENCY=6 npm run verify:matrix:full
```

### Webpack: “CLI for webpack must be installed… install webpack-cli?”
Install at repo root:
```bash
npm i -D webpack webpack-cli
```

### Vite: “Cannot find package 'vite' imported from … vite.config.ts.timestamp…”
Install at repo root and ensure a valid `vite.config.[ts|js]`:
```bash
npm i -D vite
```

### Vitest: `ReferenceError: document is not defined`
The runner uses `--environment=jsdom`. If needed:
```bash
npm i -D jsdom
```
Ensure the project doesn’t force `environment: "node"` in `vitest.config.*`.

### Angular: “Unknown argument: interactive / --no-interactive”
The runner calls `ng build` without deprecated flags. Remove `--no-interactive` from template scripts if present.

### TypeScript React default import issues
Add to template `tsconfig.json`:
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```
Also type component props (`children`, event params, etc.).

### Folder exists & nothing happens
Use:
```bash
PF_ON_EXISTS=overwrite npm run verify:matrix:quick
```
or clean:
```bash
rm -rf sandbox   # or: npm run clean:sandbox if you have it
```

---

## Performance tips

- **Install toolchains at repo root** (see Setup) → no interactive `npx` prompts.
- **Parallelism**: set `PF_CONCURRENCY` (e.g., CPU cores − 1).
- **Fast mode**: `PF_FAST=fw-lang-first` → only first **(framework,language)** does full build+tests.
- **Caches in templates**:
  - Webpack:
    ```js
    // webpack.config.js
    module.exports = { cache: { type: 'filesystem', cacheDirectory: '.webpack-cache' } };
    ```
  - Vite:
    ```ts
    // vite.config.ts
    export default defineConfig({ cacheDir: '.vite-cache', build: { sourcemap: false, minify: 'esbuild' } });
    ```
- **Disable sourcemaps/minify** in verification builds for speed.
- **pnpm + shared store** (optional):
  ```bash
  corepack enable
  pnpm config set store-dir ~/.pnpm-store
  ```

---

## CI example (GitHub Actions)

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

      # Optional: preinstall toolchain for consistent/faster runs
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

---

## Appendix — Environment variables

| Variable          | Default                                  | Purpose |
|-------------------|-------------------------------------------|---------|
| `PF_MATRIX`       | `quick`                                   | Choose `quick` or `full` preset. |
| `PF_LANGS`        | `ts,js`                                   | Languages for React jobs (Angular stays TS). |
| `PF_ORDER`        | `react-vite,react-webpack,angular`        | Framework execution order. |
| `PF_UI_ORDER`     | `mui,bootstrap,tailwind,antd,chakra`      | UI ordering within a framework. |
| `PF_CONCURRENCY`  | CPU cores − 1                             | Parallel job count. |
| `PF_FAST`         | `off`                                     | `fw-lang-first` → only first job per (framework,language) runs full build+tests. |
| `PF_SKIP_TSC`     | `''`                                      | `1` to skip typechecking everywhere. |
| `PF_SKIP_TESTS`   | `''`                                      | `1` to skip tests everywhere. |
| `PF_ON_EXISTS`    | `rename`                                  | Behavior for existing app folders: `rename` / `overwrite` / `skip`. |
| `PF_CLI`          | `bin/index.js`                            | Path to your CLI binary. |
| `PF_APP_NAME`     | `app-under-test` (watch mode)             | Target app folder name used by `verify:watch`. |

---

## File map

- `scripts/verify-once.js` — matrix runner (ordering, concurrency, fast mode, skips, on‑exists, robust builder/tester detection)
- `scripts/watch-verify.js` — single‑app watch pipeline
- `bin/index.js` — your scaffold CLI (called by the runner)
- `sandbox/` — all generated apps live here

---

## Changelog in this verifier

- Added **FULL** + **QUICK** matrices with precise combinations
- Introduced **PF_LANGS** (React TS/JS); Angular enforced TS‑only
- Implemented **PF_ORDER** & **PF_UI_ORDER** (default UI order set to **mui,bootstrap,tailwind,antd,chakra**)
- Added **PF_CONCURRENCY**, **PF_FAST**, **PF_SKIP_TSC**, **PF_SKIP_TESTS**
- Added **PF_ON_EXISTS** (`rename`/`overwrite`/`skip`)
- Strengthened **toolchain resolution** (app → root → npx)
- Switched Vitest to **jsdom** by default
- Removed deprecated `--no-interactive` for Angular builds
- Made typecheck failures **non‑fatal** (warn + continue)
- Added detailed **troubleshooting** and **CI** examples
