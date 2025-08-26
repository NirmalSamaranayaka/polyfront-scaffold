// Cross-platform target directory handling for scaffolding commands.

const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("node:process");

function dirExists(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function isEmptyDir(p) {
  if (!dirExists(p)) return true;
  return fs.readdirSync(p).length === 0;
}
function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}
function nextAvailableName(parentDir, baseName) {
  let i = 1;
  let candidate = baseName;
  while (dirExists(path.resolve(parentDir, candidate))) {
    candidate = `${baseName}-${i++}`;
  }
  return candidate;
}

/**
 * Ensure a safe target directory before running a project generator.
 * @param {object} opts
 * @param {string} opts.parentDir   Absolute parent directory where the project will be created
 * @param {string} opts.projectName Desired folder name
 * @param {"prompt"|"overwrite"|"rename"|"skip"} [opts.onExists="prompt"]
 * @returns {Promise<{ targetDir: string, finalName: string, decision: "create"|"overwrite"|"rename"|"skip" }>}
 */
async function ensureTargetDir({ parentDir, projectName, onExists = "prompt" }) {
  const mode = String(onExists || "prompt").toLowerCase();
  const want = String(projectName);
  const target = path.resolve(parentDir, want);

  // If folder does not exist or is empty → create in place.
  if (isEmptyDir(target)) {
    return { targetDir: target, finalName: want, decision: "create" };
  }

  // onExists policies
  if (mode === "overwrite") {
    rmrf(target);
    return { targetDir: target, finalName: want, decision: "overwrite" };
  }

  if (mode === "rename") {
    const renamed = nextAvailableName(parentDir, want);
    return { targetDir: path.resolve(parentDir, renamed), finalName: renamed, decision: "rename" };
  }

  if (mode === "skip") {
    // Fail fast so callers/CI stop here.
    throw new Error(`Target directory "${want}" already exists and is not empty (skip).`);
  }

  // "prompt" (default). In CI or non-TTY, auto-rename.
  const nonInteractive = process.env.CI === "true" || !process.stdout.isTTY;
  if (nonInteractive) {
    const renamed = nextAvailableName(parentDir, want);
    return { targetDir: path.resolve(parentDir, renamed), finalName: renamed, decision: "rename" };
  }

  // Minimal interactive prompt
  const rl = readline.createInterface({ input, output });
  console.log(`\nFolder "${want}" already exists and is not empty.`);
  const answer = (await rl.question("Choose: [o]verwrite / [r]ename / [s]kip ? (default: r) ")).trim().toLowerCase();
  rl.close();

  if (answer.startsWith("o")) {
    rmrf(target);
    return { targetDir: target, finalName: want, decision: "overwrite" };
  }
  if (answer.startsWith("s")) {
    throw new Error(`Target directory "${want}" already exists and is not empty (skip).`);
  }
  // default → rename
  const renamed = nextAvailableName(parentDir, want);
  return { targetDir: path.resolve(parentDir, renamed), finalName: renamed, decision: "rename" };
}

module.exports = { ensureTargetDir, isEmptyDir, dirExists };
