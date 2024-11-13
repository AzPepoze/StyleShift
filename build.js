const esbuild = require("esbuild");
const chokidar = require("chokidar");
const { minify } = require("terser");
const fs = require("fs");

function build() {
	esbuild
		.build({
			entryPoints: ["./src/Run.ts"],
			bundle: true,
			outfile: "./temp/temp.js",
			platform: "browser",
			target: ["es2020"],
			minify: false,
			format: "esm",
			keepNames: true,
		})
		.then(async () => {
			const result = await minify(fs.readFileSync("./temp/temp.js", "utf-8"), {
				mangle: {
					reserved: ["Enable_Extension", "Disable_Extension"],
					toplevel: true,
				},
			});
			fs.writeFileSync("./dist/StyleShift.js", result.code);
			console.log("Build succeeded!");
		})
		.catch((error) => {
			console.error("Build failed.", error);
		});
}

// Initial build
build();

chokidar.watch("./src").on("all", (event, path) => {
	console.log(event, path);
	build();
});
