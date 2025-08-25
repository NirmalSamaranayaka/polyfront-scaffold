function pkgManager(pm) {
  switch (pm) {
    case "pnpm": return { i: ["pnpm", ["i"]], dev: ["pnpm", ["i", "-D"]], run: (s)=>["pnpm",[s]], exec:(b,a=[])=>["pnpm",["dlx",b,...a]], create:(b,a=[])=>["pnpm",["create",b,...a]] };
    case "yarn": return { i: ["yarn", ["add"]], dev: ["yarn", ["add", "-D"]], run: (s)=>["yarn",[s]], exec:(b,a=[])=>["yarn",["dlx",b,...a]], create:(b,a=[])=>["yarn",["create",b,...a]] };
    case "bun":  return { i: ["bun", ["add"]],  dev: ["bun", ["add", "-d"]],  run: (s)=>["bun",[s]],  exec:(b,a=[])=>["bunx",[b,...a]], create:(b,a=[])=>["bunx",[b,...a]] };
    default:     return { i: ["npm", ["i"]],    dev: ["npm", ["i", "-D"]],    run: (s)=>["npm",["run",s]], exec:(b,a=[])=>["npx",[b,...a]], create:(b,a=[])=>["npm",["create",b,...a]] };
  }
}
module.exports = { pkgManager };
