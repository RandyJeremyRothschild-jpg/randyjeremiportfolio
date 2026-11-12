import { execSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

process.env.NEXT_PUBLIC_BASE_PATH = "/randyjeremiportfolio";
process.env.STATIC_EXPORT = "true";

execSync("npx next build --webpack", { stdio: "inherit", env: process.env });

const outDir = join(process.cwd(), "out");
if (existsSync(outDir)) {
  writeFileSync(join(outDir, ".nojekyll"), "");
  console.log("Created out/.nojekyll for GitHub Pages");
}
