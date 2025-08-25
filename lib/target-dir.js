// Cross-platform target directory handling for scaffolding commands.

const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("node:process");

function isDirEmpty(absPath) {
  return !fs.existsSync(absPath) || fs.readdirSync(absPath).length === 0;
}

/**
 * Ensure a safe target directory before running a project generator.
 * @param {object} opts
 * @param {string} opts.parentDir   Absolute parent directory where the project will be created
 * @param {string} opts.projectName Desired folder name
 * @param {"prompt"|"overwrite"|"rename"|"skip"} opts.onExists
 * @returns {Promise<{ targetDir: string, finalName: string }>}
 */
async function ensureTargetDir({ parentDir, projectName, onExists = "prompt" }) {
  const normalize = (v) => String(v || "").toLowerCase();
  const choice = normalize(onExists);
  let name = projectName;
  const abs = path.resolve(parentDir, name);

  // If empty or missing → all good
  if (isDirEmpty(abs)) {
    return { targetDir: abs, finalName: name };
  }

  // Helpers
  const makeUnique = () => {
    let n = 1;
    let candidate = `${name}-${n}`;
    while (fs.existsSync(path.resolve(parentDir, candidate))) {
      n++;
      candidate = `${name}-${n}`;
    }
    return candidate;
  };

  if (choice === "overwrite") {
    fs.rmSync(abs, { recursive: true, force: true });
    return { targetDir: abs, finalName: name };
  }

  if (choice === "rename") {
    const next = makeUnique();
    return { targetDir: path.resolve(parentDir, next), finalName: next };
  }

  if (choice === "skip") {
    throw new Error(`Target directory "${name}" already exists and is not empty.`);
  }

  // prompt (default)
  const rl = readline.createInterface({ input, output });
  console.log(`\nFolder "${name}" already exists and is not empty.`);
  const answer = (await rl.question("Choose: [o]verwrite / [r]ename / [s]kip ? ")).trim().toLowerCase();
  rl.close();

  if (answer.startsWith("o")) {
    fs.rmSync(abs, { recursive: true, force: true });
    return { targetDir: abs, finalName: name };
  }
  if (answer.startsWith("r")) {
    const next = makeUnique();
    return { targetDir: path.resolve(parentDir, next), finalName: next };
  }
  throw new Error("Operation cancelled by user.");
}

module.exports = { ensureTargetDir, isDirEmpty };
