const { spawnSync } = require("child_process");

function run(cmd, args = [], options = {}) {
  const hasInput = typeof options.input === "string" && options.input.length > 0;

  const env = { ...process.env, ...(options.env || {}) };

  const res = spawnSync(cmd, args, {
    stdio: hasInput ? ["pipe", "inherit", "inherit"] : ["inherit", "inherit", "inherit"],
    shell: process.platform === "win32",
    ...options,
    env,
    // make sure Node uses our stdio choice (options.stdio above wins)
    input: hasInput ? options.input : undefined,
  });

  if (res.error) throw res.error;
  if (typeof res.status === "number" && res.status !== 0) {
    process.exit(res.status);
  }
  return res;
}

module.exports = { run };
