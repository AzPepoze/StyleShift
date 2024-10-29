const esbuild = require("esbuild");

esbuild
	.build({
		entryPoints: ["./src/Run.ts"],
		bundle: true,
		outfile: "./dist/StyleShift.js",
		platform: "browser",
		target: ["es2020"],
		minify: true,
		format: "esm",
	})
	.catch(() => process.exit(1));

