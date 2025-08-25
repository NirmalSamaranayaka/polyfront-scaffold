const { spawnSync } = require("child_process");

function run(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...options });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

module.exports = { run };
