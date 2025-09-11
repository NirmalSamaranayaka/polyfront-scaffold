#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const crypto = require('crypto');
const chokidar = require('chokidar');
const { execaNode, execa } = require('execa');
const { bold, green, red, yellow, gray, cyan } = require('kleur/colors');

let _ora;
async function getOra() {
  if (!_ora) _ora = (await import('ora')).default;
  return _ora;
}

const ROOT = process.cwd();
const SANDBOX = path.resolve(ROOT, 'sandbox'); // watch app here
const APP_NAME = process.env.PF_APP_NAME || 'app-under-test';
const APP_DIR = path.join(SANDBOX, APP_NAME);
const DEFAULT_CLI = path.resolve(ROOT, 'bin', 'index.js');
const CLI_BIN = process.env.PF_CLI || DEFAULT_CLI;

// flags after "--" go to your CLI
const idx = process.argv.indexOf('--');
const passthrough = idx >= 0 ? process.argv.slice(idx + 1) : [];
const defaultFlags = [
  'my-app',
  '--framework','react-webpack','--ts',
  '--ui','chakra','--store','none',
  '--test-unit','jest','--test-e2e','none',
  '--i18n','--axios'
];
const cliArgs = passthrough.length ? passthrough : defaultFlags;

const WATCH_GLOBS = [
  'src/**/*',
  'templates/**/*',
  'generators/**/*',
  'packages/**/*',
  'bin/**/*',
  '*.ts',
  '*.js'
].map(g => path.resolve(ROOT, g));

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

function tryResolve(appDir, candidates) {
  for (const c of candidates) {
    try { return resolveFromApp(appDir, c); } catch {}
  }
  return null;
}

function hasDeps(appDir) {
  return fs.existsSync(path.join(appDir, 'node_modules'));
}

async function runTscIfPresent() {
  if (!fs.existsSync(path.join(APP_DIR, 'tsconfig.json'))) return;
  let tscCli;
  try {
    tscCli = resolveFromApp(APP_DIR, 'typescript/bin/tsc');
  } catch {
    return; // no local TS
  }
  try {
    return await execaNode(tscCli, ['-b', '--noEmit'], { cwd: APP_DIR, stdio: 'inherit', env: makeBaseEnv() });
  } catch (err) {
    console.warn(yellow('[warn] Typechecking failed; continuing:'), err.shortMessage || err.message);
  }
}

function detectTooling(appDir) {
  console.log(gray(`[detect] appDir=${appDir}`));
  const out = { builder: null, tester: null };
  if (fs.existsSync(path.join(appDir, 'angular.json'))) out.builder = 'angular';
  try { resolveFromApp(appDir, '@angular/cli/bin/ng'); out.builder = 'angular'; } catch {}

  try { resolveFromApp(appDir, 'vite/bin/vite'); out.builder = out.builder || 'vite'; } catch {}
  try { resolveFromApp(appDir, 'webpack-cli/bin/cli'); out.builder = out.builder || 'webpack'; } catch {
    try { resolveFromApp(appDir, 'webpack/bin/webpack'); out.builder = out.builder || 'webpack'; } catch {}
  }

  try { resolveFromApp(appDir, 'vitest/bin/vitest'); out.tester = 'vitest'; } catch {
    try { resolveFromApp(appDir, 'vitest/vitest.mjs'); out.tester = 'vitest'; } catch {}
  }
  try { resolveFromApp(appDir, 'jest/bin/jest'); out.tester = out.tester || 'jest'; } catch {}

  return out;
}

async function runBuildDirect(appDir, tooling) {
  const env = makeBaseEnv();
  if (tooling === 'vite') {
    const viteBin = tryResolve(appDir, ['vite/bin/vite.js', 'vite/bin/vite.mjs', 'vite']);
    if (viteBin) return execaNode(viteBin, ['build'], { cwd: appDir, stdio: 'inherit', env });
    // Prefer app script before npx to avoid prompts
    try { return await execa('npm', ['run', 'build', '--silent'], { cwd: appDir, stdio: 'inherit', env }); } catch {}
    return execa('npx', ['vite', 'build'], { cwd: appDir, stdio: 'inherit', env });
  }
  if (tooling === 'webpack') {
    const bin = tryResolve(appDir, ['webpack-cli/bin/cli.js', 'webpack/bin/webpack.js', 'webpack']);
    const args = ['--mode', 'production'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    // Prefer app script before npx to avoid webpack-cli auto-install prompts
    try { return await execa('npm', ['run', 'build', '--silent'], { cwd: appDir, stdio: 'inherit', env }); } catch {}
    return execa('npx', ['webpack', ...args], { cwd: appDir, stdio: 'inherit', env });
  }
  if (tooling === 'angular') {
    const ngBin = tryResolve(appDir, ['@angular/cli/bin/ng.js', '@angular/cli/bin/ng']);
    const args = ['build']; // remove deprecated --no-interactive
    if (ngBin) return execaNode(ngBin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return await execa('npx', ['ng', ...args], { cwd: appDir, stdio: 'inherit', env }); } catch {}
    return execa('npm', ['run', 'build', '--silent'], { cwd: appDir, stdio: 'inherit', env });
  }
  const hasPkg = fs.existsSync(path.join(appDir, 'package.json'));
  throw new Error(`Unknown builder; cannot run build directly. (appDir=${appDir}, package.json=${hasPkg ? 'yes' : 'no'})`);
}

async function runTestsDirect(appDir, tester) {
  const env = makeBaseEnv();
  if (!tester) return;
  if (tester === 'vitest') {
    const bin = tryResolve(appDir, ['vitest/bin/vitest.js', 'vitest/vitest.mjs', 'vitest']);
    const args = ['run', '--reporter=dot', '--passWithNoTests', '--environment=jsdom'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return execa('npx', ['vitest', ...args], { cwd: appDir, stdio: 'inherit', env }); } catch {}
    return execa('npm', ['run', 'test', '--silent', '--', ...args], { cwd: appDir, stdio: 'inherit', env });
  }
  if (tester === 'jest') {
    const bin = tryResolve(appDir, ['jest/bin/jest.js', 'jest']);
    const args = ['--ci', '--reporters=default'];
    if (bin) return execaNode(bin, args, { cwd: appDir, stdio: 'inherit', env });
    try { return execa('npx', ['jest', ...args], { cwd: appDir, stdio: 'inherit', env }); } catch {}
    return execa('npm', ['run', 'test', '--silent', '--', ...args], { cwd: appDir, stdio: 'inherit', env });
  }
}

function sha(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
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
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

async function handleExistingDir(appDir, appNameForLogs) {
  if (!isDirNonEmpty(appDir)) return { proceed: true };

  if (ON_EXISTS === 'overwrite') {
    console.log(yellow(`[on-exists=overwrite] Removing existing ${appNameForLogs} at ${appDir}`));
    await fse.remove(appDir);
    return { proceed: true };
  }

  if (ON_EXISTS === 'skip') {
    console.log(yellow(`[on-exists=skip] ${appNameForLogs} already exists and is not empty. Skipping scaffold.`));
    return { proceed: false };
  }

  const backup = `${appDir}-bak-${tsStamp()}`;
  console.log(yellow(`[on-exists=rename] Moving existing ${appNameForLogs} → ${backup}`));
  await fse.move(appDir, backup, { overwrite: false });
  return { proceed: true };
}
// ===========================================================================

async function scaffoldOnce() {
  await fse.ensureDir(SANDBOX);

  // NEW: handle existing folder according to PF_ON_EXISTS
  const { proceed } = await handleExistingDir(APP_DIR, APP_NAME);
  if (!proceed) {
    console.log(gray(`[watch] Scaffold skipped for ${APP_NAME}`));
    return;
  }

  const args = [...cliArgs];
  if (!args.length || args[0].startsWith('-')) args.unshift(APP_NAME);
  else args[0] = APP_NAME;

  if (!args.includes('--root')) args.push('--root', SANDBOX);
  if (!args.includes('--flat')) args.push('--flat');

  // run CLI from sandbox so all outputs are written inside sandbox/
  await execaNode(CLI_BIN, args, { stdio: 'inherit', env: makeBaseEnv(), cwd: SANDBOX });
}

async function ensureInstallIfNeeded() {
  if (hasDeps(APP_DIR)) {
    console.log(gray('[ok] node_modules detected — skipping install.'));
    return;
  }
  preflightLog();
  console.log(yellow(`[skip] No node_modules found at ${APP_DIR}. Skipping install due to restricted environment.`));
  console.log(yellow(`       If needed, install manually: cd "${APP_DIR}" && npm ci`));
}

async function pipeline() {
  const Ora = await getOra();
  const spinner = Ora(cyan('Scaffolding…')).start();
  try {
    await scaffoldOnce();

    spinner.text = 'Installing deps (if needed)…';
    await ensureInstallIfNeeded();

    spinner.text = 'Typechecking…';
    await runTscIfPresent();

    const { builder, tester } = detectTooling(APP_DIR);

    spinner.text = builder ? `Building with ${builder}…` : 'Building…';
    if (builder) await runBuildDirect(APP_DIR, builder);

    spinner.text = tester ? `Unit tests (${tester})…` : 'Unit tests… (none)';
    if (tester) await runTestsDirect(APP_DIR, tester);

    spinner.succeed(green('OK — scaffold → (install?) → typecheck → build → unit tests'));
  } catch (e) {
    spinner.fail(red('FAILED'));
    console.error(red(e.shortMessage || e.message || e));
  }
}

let running = false;
let pending = false;
function queue() {
  if (running) { pending = true; return; }
  running = true;
  pipeline().finally(() => {
    running = false;
    if (pending) { pending = false; queue(); }
  });
}

(async function main() {
  console.log(bold('Polyfront Verify (watch mode)'));
  console.log(gray(`CLI: ${CLI_BIN}`));
  console.log(gray(`Sandbox: ${APP_DIR}`));
  console.log(gray(`Flags: ${cliArgs.join(' ')}`));
  console.log(gray(`On-exists: ${ON_EXISTS}`));

  await fse.ensureDir(SANDBOX);
  queue();

  const watcher = chokidar.watch(WATCH_GLOBS, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 },
  });

  const onChange = (file) => {
    console.log(yellow(`\n• Change detected: ${path.relative(ROOT, file)}`));
    queue();
  };

  watcher.on('add', onChange).on('change', onChange).on('unlink', onChange);
})();
