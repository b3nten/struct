import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const DIR = "./.npm";
const LINK = "https://github.com/b3nten";
const REPO = "project";

if (!Deno.args[0]) throw new Error("Please specify a version number.");

await emptyDir(DIR);

await build({
  entryPoints: ["./mod.ts"],
  outDir: DIR,
  shims: { deno: true },
  typeCheck: "both",
  scriptModule: false,
  package: {
    // package.json properties
    name: REPO,
    version: Deno.args[0],
    description: "Your package.",
    license: "MIT",
    repository: {
      type: "git",
      url: `git+${LINK}/${REPO}.git`,
    },
    bugs: {
      url: `${LINK}/${REPO}/issues`,
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENCE", `${DIR}/LICENSE`);
    Deno.copyFileSync("README.md", `${DIR}/README.md`);
  },
});
