#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const os = require('os');
const { execaNode, execa } = require('execa');
const { bold, green, red, gray, cyan, yellow } = require('kleur/colors');

let _ora;
async function getOra() {
  if (!_ora) _ora = (await import('ora')).default; // ESM -> CJS bridge
  return _ora;
}

const ROOT = process.cwd();
const OUT_ROOT = path.resolve(ROOT, 'sandbox'); // all apps land here
const DEFAULT_CLI = path.resolve(ROOT, 'bin', 'index.js');
const CLI_BIN = process.env.PF_CLI || DEFAULT_CLI;

// === Speed & behavior toggles ==============================================
const CONCURRENCY = Math.max(
  1,
  parseInt(process.env.PF_CONCURRENCY || `${Math.max(1, (os.cpus()?.length || 2) - 1)}`, 10) || 1
);
const FAST = (process.env.PF_FAST || 'off').toLowerCase(); // 'off' | 'fw-lang-first'
const SKIP_TSC = /^1|true$/i.test(process.env.PF_SKIP_TSC || '');
const SKIP_TESTS = /^1|true$/i.test(process.env.PF_SKIP_TESTS || '');

// === Matrix presets =========================================================
const MATRIX = (process.env.PF_MATRIX || 'quick').toLowerCase();
// PF_LANGS controls which langs to generate; default both
const LANGS = (process.env.PF_LANGS || 'ts,js')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

// Preferred execution order: vite → webpack → angular (overridable)
const ORDER = (process.env.PF_ORDER || 'react-vite,react-webpack,angular')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
const orderIndex = fw => {
  const i = ORDER.indexOf((fw || '').toLowerCase());
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

// Preferred UI order (overridable)
const UI_ORDER = (process.env.PF_UI_ORDER || 'mui,bootstrap,tailwind,antd,chakra')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
const uiIndex = ui => {
  const i = UI_ORDER.indexOf((ui || '').toLowerCase());
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

const QUICK_BASE = [
  { fw: 'react-vite', ui: 'mui', store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'bootstrap', store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'tailwind', store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'antd', store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'chakra', store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'mui', store: 'none', unit: 'jest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'bootstrap', store: 'none', unit: 'jest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'tailwind', store: 'none', unit: 'jest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'antd', store: 'none', unit: 'jest', e2e: 'none', date: 'date-fns' },
  { fw: 'react-vite', ui: 'chakra', store: 'none', unit: 'jest', e2e: 'none', date: 'date-fns' },
 { fw: 'react-vite', ui: 'mui', store: 'none', unit: 'none', e2e: 'none', date: 'date-fns' },
 { fw: 'react-vite', ui: 'bootstrap', store: 'none', unit: 'none', e2e: 'none', date: 'date-fns' }, 
 { fw: 'react-vite', ui: 'tailwind', store: 'none', unit: 'none', e2e: 'none', date: 'date-fns' },
 { fw: 'react-vite', ui: 'antd', store: 'none', unit: 'none', e2e: 'none', date: 'date-fns' },
 { fw: 'react-vite', ui: 'chakra', store: 'none', unit: 'none', e2e: 'none', date: 'date-fns' },
 { fw: 'react-vite', ui: 'mui',   store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' },
  // { fw: 'react-webpack', ui: 'bootstrap',  store: 'none', unit: 'jest',  e2e: 'none', date: 'moment'  },
  // { fw: 'angular',    ui: 'material', store: 'none', unit: 'none',  e2e: 'none', date: 'none'   },
];

const FULL_BASE = [
  ...['mui', 'bootstrap', 'tailwind', 'antd', 'chakra',]
    .map(ui => ({ fw: 'react-webpack', ui, store: 'none', unit: 'jest', e2e: 'none', date: 'moment' })),
  ...['none', 'redux', 'mobx', 'react-query']
    .map(store => ({ fw: 'react-webpack', ui: 'chakra', store, unit: 'jest', e2e: 'none', date: 'moment' })),
  ...['moment', 'dayjs', 'date-fns']
    .map(date => ({ fw: 'react-webpack', ui: 'chakra', store: 'none', unit: 'jest', e2e: 'none', date })),
  ...['mui', 'bootstrap', 'tailwind', 'antd', 'chakra']
    .map(ui => ({ fw: 'react-vite', ui, store: 'none', unit: 'vitest', e2e: 'none', date: 'date-fns' })),
];

// Expand base specs across languages.
// Angular is TS-only in practice; keep it TS regardless of PF_LANGS.
function expandLang(spec) {
  const allowed =
    spec.fw === 'angular'
      ? ['ts']
      : LANGS.length ? LANGS : ['ts', 'js'];
  return allowed.map(lang => ({ ...spec, lang }));
}

// Build CLI args from a spec
function specToArgs(spec) {
  const args = [
    '--framework', spec.fw,
    '--ui', spec.ui,
    '--store', spec.store,
    '--test-unit', spec.unit,
    '--test-e2e', spec.e2e,
    '--date', spec.date,
    '--i18n', '--axios',
  ];
  if ((spec.lang || 'ts') === 'ts') args.splice(2, 0, '--ts');
  else if (spec.lang === 'js') args.splice(2, 0, '--js');
  return args;
}

// Create job objects, then sort by framework order then UI order
function makeJobs(specs) {
  const seen = new Set();
  const jobs = [];
  for (const b of specs) {
    for (const s of expandLang(b)) {
      const parts = [s.fw, s.lang || 'ts', s.ui, s.store, s.unit, s.e2e, s.date];
      const app = `app-${parts.join('-')}`;
      const name = `${s.fw} | ${s.lang || 'ts'} | ${s.ui} | ${s.store} | ${s.unit} | ${s.e2e} | ${s.date}`;
      const key = app.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push({ fw: s.fw, ui: s.ui, lang: s.lang || 'ts', name, app, args: specToArgs(s) });
    }
  }
  jobs.sort((a, b) => {
    const oa = orderIndex(a.fw);
    const ob = orderIndex(b.fw);
    if (oa !== ob) return oa - ob;

    const ua = uiIndex(a.ui);
    const ub = uiIndex(b.ui);
    if (ua !== ub) return ua - ub;

    // fallback stable-ish ordering
    return a.app.localeCompare(b.app);
  });
  return jobs;
}

const SETS = {
  quick: makeJobs(QUICK_BASE),
  full: makeJobs(FULL_BASE),
};
// ==========================================================================

function preflightLog() {
  try {
    const p = process.execPath;
    const exists = fs.existsSync(p);
    console.log(gray(`[preflight] process.execPath=${p} (exists=${exists})`));
    console.log(gray(`[preflight] npm_execpath=${process.env.npm_execpath || '(unset)'}`));
    console.log(gray(`[preflight] PATH contains "nodejs"? ${process.env.PATH?.toLowerCase().includes('nodejs') ? 'yes' : 'no'}`));
    console.log(gray(`[preflight] SystemRoot=${process.env.SystemRoot || '(unset)'}`));
    console.log(gray(`[preflight] COMSPEC=${process.env.COMSPEC || process.env.ComSpec || '(unset)'}`));
  } catch {}
}

function makeBaseEnv() {
  // Ensure devDependencies are installed/usable
  const env = {
    ...process.env,
    CI: '1',
    NG_CLI_ANALYTICS: 'false',
    ADBLOCK: '1',
    BROWSERSLIST_DISABLE_CACHE: '1',
    NODE_ENV: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? process.env.NODE_ENV : 'development',
    npm_config_production: 'false',
  };
  return env;
}

function resolveFromApp(appDir, mod) {
  return require.resolve(mod, { paths: [appDir] });
}

// Try resolve from app, then ROOT, then bare (for global)
function tryResolve(appDir, candidates) {
  for (const c of candidates) {
    try { return resolveFromApp(appDir, c); } catch { }
    try { return require.resolve(c, { paths: [ROOT] }); } catch { }
    try { return require.resolve(c); } catch { }
  }
  return null;
}

function hasDeps(appDir) {
  return fs.existsSync(path.join(appDir, 'node_modules'));
}

async function runTscIfPresent(appDir) {
  if (SKIP_TSC) return;
  if (!fs.existsSync(path.join(appDir, 'tsconfig.json'))) return;
  let tscCli;
  try {
    tscCli = resolveFromApp(appDir, 'typescript/bin/tsc');
  } catch {
    // try repo root
    try { tscCli = require.resolve('typescript/bin/tsc', { paths: [ROOT] }); }
    catch { return; }
  }
  try {
    return await execaNode(tscCli, ['-b', '--noEmit'], { cwd: appDir, stdio: 'inherit', env: makeBaseEnv() });
  } catch (err) {
    console.warn(yellow('[warn] Typechecking failed; continuing:'), err.shortMessage || err.message);
  }
}

function detectTooling(appDir) {
  console.log(gray(`[detect] appDir=${appDir}`));

  const pkgPath = path.join(appDir, 'package.json');
  const out = { builder: null, tester: null };

  // ---------- Builder detection ----------
  // Vite
  try { resolveFromApp(appDir, 'vite/bin/vite'); out.builder = 'vite'; } catch {
    try { require.resolve('vite/bin/vite', { paths: [ROOT] }); out.builder = 'vite'; } catch { }
  }

  // Webpack if not Vite
  if (!out.builder) {
    try { resolveFromApp(appDir, 'webpack-cli/bin/cli'); out.builder = 'webpack'; } catch {
      try { resolveFromApp(appDir, 'webpack/bin/webpack'); out.builder = 'webpack'; } catch {
        try { require.resolve('webpack-cli/bin/cli', { paths: [ROOT] }); out.builder = 'webpack'; } catch {
          try { require.resolve('webpack/bin/webpack', { paths: [ROOT] }); out.builder = 'webpack'; } catch { }
        }
      }
    }
  }

  // Angular only if still not set
  if (!out.builder) {
    if (fs.existsSync(path.join(appDir, 'angular.json'))) out.builder = 'angular';
    try { resolveFromApp(appDir, '@angular/cli/bin/ng'); out.builder = out.builder || 'angular'; } catch {
      try { require.resolve('@angular/cli/bin/ng', { paths: [ROOT] }); out.builder = out.builder || 'angular'; } catch { }
    }
  }

  // ---------- Tester detection ----------
  // first try to see if vitest binary exists (node_modules)
  try { resolveFromApp(appDir, 'vitest/bin/vitest'); out.tester = 'vitest'; } catch {
    try { resolveFromApp(appDir, 'vitest/vitest.mjs'); out.tester = 'vitest'; } catch {
      try { require.resolve('vitest/bin/vitest', { paths: [ROOT] }); out.tester = out.tester || 'vitest'; } catch {
        try { require.resolve('vitest/vitest.mjs', { paths: [ROOT] }); out.tester = out.tester || 'vitest'; } catch { }
      }
    }
  }

  // then try jest binary if vitest not found
  if (!out.tester) {
    try { resolveFromApp(appDir, 'jest/bin/jest'); out.tester = 'jest'; } catch {
      try { require.resolve('jest/bin/jest', { paths: [ROOT] }); out.tester = out.tester || 'jest'; } catch { }
    }
  }

  // If package.json exists, prefer package.json scripts/devDeps
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const s = pkg.scripts || {};

    if (!out.builder) {
      if (s.build?.includes('vite')) out.builder = 'vite';
      else if (s.build?.includes('webpack')) out.builder = 'webpack';
      else if (s.build?.includes('ng')) out.builder = 'angular';
    }

    // IMPORTANT: prefer explicit package.json test script over the mere presence of runner binaries.
    // This ensures projects scaffolded with "jest" actually run with jest even if vitest is installed globally or in node_modules.
    if (s.test?.includes('jest')) {
      out.tester = 'jest';
    } else if (s.test?.includes('vitest')) {
      out.tester = 'vitest';
    } else if (!out.tester) {
      // fallback to devDependencies hints if no script present
      if (pkg.devDependencies?.jest || pkg.dependencies?.jest) out.tester = 'jest';
      else if (pkg.devDependencies?.vitest || pkg.dependencies?.vitest) out.tester = 'vitest';
    }
  }

  console.log(gray(`[detect] builder=${out.builder}, tester=${out.tester}`));
  return out;
}


async function runBuildDirect(appDir, tooling) {
  const env = makeBaseEnv();

  if (tooling === 'vite') {
    const viteBin = tryResolve(appDir, ['vite/bin/vite.js', 'vite/bin/vite.mjs', 'vite']);
    if (viteBin) return execaNode(viteBin, ['build'], { cwd: appDir, stdio: 'inherit', env });
    try { return await execa('npm', ['run', 'build', '--silent'], { cwd: appDir, stdio: 'inherit', env }); } catch { }
    return execa('npx', ['vite', 'build'], { cwd: appDir, stdio: 'inherit', env });
  }

  if (tooling === 'webpack') {
    const bin = tryResolve(appDir, ['webpack-cli/bin/cli.js', 'webpack/bin/webpack.js', 'webpack']);
    const args = ['--mode', 'production'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return await execa('npm', ['run', 'build', '--silent'], { cwd: appDir, stdio: 'inherit', env }); } catch { }
    return execa('npx', ['webpack', ...args], { cwd: appDir, stdio: 'inherit', env });
  }

  if (tooling === 'angular') {
    // Safety check: ensure angular.json exists
    if (!fs.existsSync(path.join(appDir, 'angular.json'))) {
      throw new Error(`Cannot build with Angular CLI: angular.json not found in ${appDir}`);
    }
    const ngBin = tryResolve(appDir, ['@angular/cli/bin/ng.js', '@angular/cli/bin/ng']);
    const args = ['build']; // avoid deprecated --no-interactive
    if (ngBin) return execaNode(ngBin, args, { cwd: appDir, stdio: 'inherit', env });
    return execa('npx', ['ng', ...args], { cwd: appDir, stdio: 'inherit', env });
  }

  const hasPkg = fs.existsSync(path.join(appDir, 'package.json'));
  throw new Error(`Unknown builder; cannot run build directly. (appDir=${appDir}, package.json=${hasPkg ? 'yes' : 'no'})`);
}


async function runTestsDirect(appDir, tester) {
  if (SKIP_TESTS) return;
  const env = makeBaseEnv();
  if (!tester) return;
  if (tester === 'vitest') {
    const bin = tryResolve(appDir, ['vitest/bin/vitest.js', 'vitest/vitest.mjs', 'vitest']);
    const args = ['run', '--reporter=dot', '--passWithNoTests', '--environment=jsdom'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return execa('npx', ['vitest', ...args], { cwd: appDir, stdio: 'inherit', env }); } catch { }
    return execa('npm', ['run', 'test', '--silent', '--', ...args], { cwd: appDir, stdio: 'inherit', env });
  }
  if (tester === 'jest') {
    const bin = tryResolve(appDir, ['jest/bin/jest.js', 'jest']);
    const args = ['--ci', '--reporters=default'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return execa('npx', ['jest', ...args], { cwd: appDir, stdio: 'inherit', env }); } catch { }
    return execa('npm', ['run', 'test', '--silent', '--', ...args], { cwd: appDir, stdio: 'inherit', env });
  }
}

// === on-exists policy =======================================================
const ON_EXISTS = (process.env.PF_ON_EXISTS || 'rename').toLowerCase();

function isDirNonEmpty(dir) {
  try {
    if (!fs.existsSync(dir)) return false;
    const entries = fs.readdirSync(dir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function tsStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

async function handleExistingDir(appDir, appNameForLogs) {
  if (!isDirNonEmpty(appDir)) return { proceed: true };

  if (ON_EXISTS === 'overwrite') {
    console.log(yellow(`[on-exists=overwrite] Removing existing ${appNameForLogs} at ${appDir}`));
    await fse.remove(appDir);
    return { proceed: true };
  }

  if (ON_EXISTS === 'skip') {
    console.log(yellow(`[on-exists=skip] ${appNameForLogs} already exists and is not empty. Skipping.`));
    return { proceed: false };
  }

  // default: rename
  const backup = `${appDir}-bak-${tsStamp()}`;
  console.log(yellow(`[on-exists=rename] Moving existing ${appNameForLogs} → ${backup}`));
  await fse.move(appDir, backup, { overwrite: false });
  return { proceed: true };
}
// ===========================================================================

async function runCli(appName, args) {
  const full = [appName, ...args, '--root', OUT_ROOT, '--flat'];
  await fse.ensureDir(OUT_ROOT);
  await execaNode(CLI_BIN, full, { stdio: 'inherit', env: makeBaseEnv(), cwd: OUT_ROOT });
}

// The core worker for one job; supports "typecheck-only" mode in FAST runs
async function verifyOne(job, mode = 'full') {
  const Ora = await getOra();
  const spinner = Ora(cyan(` ${job.name}${mode === 'typecheck-only' ? ' [fast:typecheck]' : ''}`)).start();
  try {
    console.log(gray(`Output root: ${OUT_ROOT}`));
    const appDir = path.join(OUT_ROOT, job.app);

    await fse.ensureDir(OUT_ROOT);
    console.log(gray(`Target: ${appDir} [on-exists=${ON_EXISTS}]`));

    // handle existing dir according to PF_ON_EXISTS
    const { proceed } = await handleExistingDir(appDir, job.app);
    if (!proceed) {
      spinner.succeed(green(`SKIP: ${job.name}`));
      return { name: job.name, ok: true };
    }

    spinner.text = 'Scaffolding…';
    await runCli(job.app, job.args);

    // ---- Install step (skipped if deps already present)
    if (!hasDeps(appDir)) {
      preflightLog();
      console.log(yellow(`[skip] No node_modules found at ${appDir}. Skipping install due to restricted environment.`));
      console.log(yellow(` If needed, install manually: cd "${appDir}" && npm ci`));
    } else {
      console.log(gray(`[ok] node_modules detected. Skipping explicit npm install.`));
    }

    spinner.text = 'Typechecking…';
    await runTscIfPresent(appDir);

    if (mode === 'typecheck-only') {
      spinner.succeed(green(`PASS (fast:typecheck): ${job.name}`));
      return { name: job.name, ok: true, fast: true };
    }

    const { builder, tester } = detectTooling(appDir);
    if (!builder) {
      const hasPkg = fs.existsSync(path.join(appDir, 'package.json'));
      throw new Error(`Could not detect builder (vite/webpack/angular). (appDir=${appDir}, package.json=${hasPkg ? 'yes' : 'no'})`);
    }

    // --- Skip Webpack builds for Vite apps ---
    if (job.fw === 'react-vite' && builder === 'webpack') {
      spinner.succeed(green(`SKIP build (Vite app detected, no Webpack run): ${job.name}`));
    } else {
      spinner.text = `Building with ${builder}…`;
      await runBuildDirect(appDir, builder);
    }


    spinner.text = tester && !SKIP_TESTS ? `Unit tests (${tester})…` : 'Unit tests… (skipped or none)';
    await runTestsDirect(appDir, tester);

    spinner.succeed(green(`PASS: ${job.name}`));
    return { name: job.name, ok: true };
  } catch (e) {
    spinner.fail(red(`FAIL: ${job.name}`));
    console.error(red(e.shortMessage || e.message || e));
    return { name: job.name, ok: false };
  }
}

// Simple promise pool for concurrency
async function runWithConcurrency(jobs, modes, limit) {
  const results = new Array(jobs.length);
  let i = 0;
  let active = 0;

  return await new Promise(resolve => {
    const next = () => {
      if (i >= jobs.length && active === 0) return resolve(results);
      while (active < limit && i < jobs.length) {
        const idx = i++;
        active++;
        verifyOne(jobs[idx], modes[idx]).then(r => {
          results[idx] = r;
        }).catch(err => {
          results[idx] = { name: jobs[idx].name, ok: false, err };
        }).finally(() => {
          active--;
          next();
        });
      }
    };
    next();
  });
}

(async function main() {
  console.log(bold(`Polyfront Matrix (${MATRIX.toUpperCase()})`));
  console.log(gray(`Output root: ${OUT_ROOT}`));
  console.log(gray(`Languages: ${LANGS.join(', ') || 'ts,js'}`));
  console.log(gray(`Order: ${ORDER.join(' > ')}`));
  console.log(gray(`UI Order: ${UI_ORDER.join(' > ')}`));
  console.log(gray(`On-exists: ${ON_EXISTS}`));
  console.log(gray(`Concurrency: ${CONCURRENCY}`));
  console.log(gray(`FAST mode: ${FAST}`));
  console.log(gray(`Skip TSC: ${SKIP_TSC ? 'yes' : 'no'} | Skip Tests: ${SKIP_TESTS ? 'yes' : 'no'}\n`));

  await fse.ensureDir(OUT_ROOT);

  const allJobs = SETS[MATRIX] || SETS.quick;

  // Determine per-job mode based on FAST strategy
  const modes = new Array(allJobs.length).fill('full');
  if (FAST === 'fw-lang-first') {
    const seen = new Set();
    for (let idx = 0; idx < allJobs.length; idx++) {
      const j = allJobs[idx];
      const key = `${j.fw}:${j.lang}`;
      if (!seen.has(key)) { seen.add(key); modes[idx] = 'full'; }
      else { modes[idx] = 'typecheck-only'; }
    }
  }

  const results = await runWithConcurrency(allJobs, modes, CONCURRENCY);

  const pass = results.filter(r => r?.ok).length;
  const fail = results.length - pass;
  console.log(bold('Summary:'));
  results.forEach(r => console.log(r?.ok ? green(`PASS ${r.name}${r.fast ? ' (fast:typecheck)' : ''}`) : red(`FAIL ${r?.name || '(unknown job)'}`)));
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();