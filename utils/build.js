const esbuild = require("esbuild");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");

const args = process.argv.slice(2);
const isProduction = args.includes("--production");
const isOnce = args.includes("--once");

async function Replace_for_Firefox_Text(data) {
	data = data.replace(/webkit-fill/g, "moz");
	data = data.replace(/-webkit-mask-box/g, "mask");

	data = data.replace(/webkit-slider-runnable-track/g, "moz-range-track");
	data = data.replace(/webkit-slider-thumb/g, "moz-range-thumb");

	data = data.replace(/webkit/g, "moz");
	data = data.replace(/nowrap/g, "pre");

	return data;
}

async function Replace_for_Firefox(filePath) {
	try {
		let data = await fs.readFile(filePath, "utf8");

		let modifiedContent;
		if (filePath.endsWith(".css") || filePath.endsWith(".js")) {
			modifiedContent = await Replace_for_Firefox_Text(data);
		} else {
			console.log(`Skipping file '${filePath}'`);
			return;
		}

		await fs.writeFile(filePath, modifiedContent, "utf8");
		console.log(`File '${filePath}' updated successfully!`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}

let Running = false;
async function build() {
	if (Running) {
		return;
	}
	Running = true;

	try {
		console.log("Building");

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/Extension/Run.ts")],
			bundle: true,
			outfile: path.join(__dirname, "../dist/StyleShift.js"),
			platform: "browser",
			minify: isProduction, // Enable minification for production builds
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/Extension/Modules/NormalFunction.ts")],
			outfile: path.join(__dirname, "../temp/NormalFunction.js"),
			platform: "browser",
			minify: isProduction,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/Extension/Sent_Global_Functions.ts")],
			outfile: path.join(__dirname, "../dist/Global_Functions.js"),
			platform: "browser",
		});

		let Functions_List_Data = "";
		const Functions_List_Content = fs.readFileSync(
			path.join(__dirname, "../src/Extension/Recived_Global_Functions.ts"),
			"utf-8"
		);
		const Functions_List = [...Functions_List_Content.matchAll(/(\w+)\s*:/g)].map(
			(x) => x[1]
		);

		for (const Function_Name of Functions_List) {
			Functions_List_Data += `async function ${Function_Name}(...args){return await StyleShift("${Function_Name}",...args)};`;
		}

		let Global_Functions_Data =
			(
				await fs.readFile(path.join(__dirname, "../temp/NormalFunction.js"), "utf8")
			).replace(/export /g, "") +
			(
				await fs.readFile(path.join(__dirname, "../dist/Global_Functions.js"), "utf8")
			).replace(/\n/g, "") +
			Functions_List_Data;

		await fs.writeFile(
			path.join(__dirname, "../dist/Global_Functions.js"),
			Global_Functions_Data,
			"utf8"
		);

		let Chromium = path.join(__dirname, "../out/build/Chromium");
		let Firefox = path.join(__dirname, "../out/build/Firefox");

		if (fs.existsSync(Chromium)) {
			fs.rmSync(Chromium, { recursive: true, force: true });
		}
		if (fs.existsSync(Firefox)) {
			fs.rmSync(Firefox, { recursive: true, force: true });
		}

		fs.copySync(path.join(__dirname, "../dist"), Chromium);
		fs.copySync(path.join(__dirname, "../dist"), Firefox);

		await Replace_for_Firefox(path.join(Firefox, "Style.css"));
		await Replace_for_Firefox(path.join(Firefox, "StyleShift.js"));

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.log("Error!, Trying again!");
		setTimeout(() => {
			build();
		}, 500);
	}

	Running = false;
	try {
		fs.removeSync(path.join(__dirname, "../temp"));
	} catch (error) {
		console.log("Error!, Trying again!");
		setTimeout(() => {
			build();
		}, 500);
	}
}

if (isOnce) {
	build();
} else {
	chokidar.watch(path.join(__dirname, "../src/Extension")).on("all", async (event, path) => {
		console.log(event, path);
		await build();
	});
}
