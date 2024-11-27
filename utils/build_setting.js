const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const { File_Content_Replace } = require("azpepoze.node_tools");

const workerEntryPoints = [
	"vs/editor/editor.main.js",
	"vs/editor/editor.worker.js",
	"vs/language/css/css.worker.js",
	"vs/language/typescript/ts.worker.js",
];

(async () => {
	await esbuild.build({
		entryPoints: workerEntryPoints.map((entry) =>
			path.join(__dirname, `../node_modules/monaco-editor/esm/${entry}`)
		),
		bundle: true,
		format: "iife",
		outdir: path.join(__dirname, "../out/build/Setting_Page/monaco"),
		minify: true,
		loader: {
			".ttf": "file",
		},
	});

	await esbuild.build({
		entryPoints: [path.join(__dirname, "../src/Setting_Page/index.js")],
		bundle: true,
		format: "iife",
		outfile: path.join(__dirname, "../out/build/Setting_Page/index.js"),
		minify: true,
		loader: {
			".ttf": "file",
		},
	});

	function getLocalThemes() {
		const themesDir = path.join(__dirname, "../node_modules/monaco-themes/themes");
		const themes = {};

		fs.readdirSync(themesDir).forEach((file) => {
			if (file.endsWith(".json")) {
				const themeContent = JSON.parse(
					fs.readFileSync(path.join(themesDir, file), "utf8")
				);
				themes[file.replace(".json", "")] = themeContent;
			}
		});

		return themes;
	}

	File_Content_Replace(
		path.join(__dirname, "../out/build/Setting_Page/index.js"),
		/"Monaco_All_Themes"/g,
		JSON.stringify(getLocalThemes())
	);
})();
