function log(s) { console.log("\x1b[36m%s\x1b[0m", s); }
function warn(s) { console.warn("\x1b[33m%s\x1b[0m", s); }
function error(s) { console.error("\x1b[31m%s\x1b[0m", s); }
module.exports = { log, warn, error };
