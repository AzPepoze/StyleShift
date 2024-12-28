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

		let Build_Path = path.join(__dirname, "../out/build");

		fs.copySync(path.join(__dirname, "../src/Extension"), Build_Path, {
			filter: (src) => {
				const relativePath = path.relative(path.join(__dirname, "../src/Extension"), src);
				return !relativePath.startsWith("External_Modules");
			},
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/Main/Run.ts")],
			bundle: true,
			outfile: path.join(Build_Path, "StyleShift.js"),
			platform: "browser",
			minify: isProduction, // Enable minification for production builds
		});

		fs.copySync(
			path.join(__dirname, "../src/Main/Build-in_Functions/Normal_Functions.ts"),
			path.join(__dirname, "../temp/Normal_Functions.ts")
		);

		//---------------------------------------------

		const codePath = path.join(__dirname, "../temp/Normal_Functions.ts");
		let code = await fs.readFile(codePath, "utf8");

		const functionNames = [];
		code = code.replace(/\bexport\s+(async\s+)?function\s+([\w$]+)\s*\(/g, (_, asyncKeyword, name) => {
			functionNames.push(name);
			return `${asyncKeyword || ""}function ${name}(`;
		});

		functionNames.forEach((name) => {
			const wrapRegex = new RegExp(`\\b(async\\s+)?function\\s+${name}\\s*\\(`, "g");
			const callRegex = new RegExp(`\\b${name}\\s*\\(`, "g");
			code = code
				.replace(
					wrapRegex,
					(_, asyncKeyword) => `StyleShift["Build-in"]["${name}"] = ${asyncKeyword || ""}function (`
				)
				.replace(callRegex, `StyleShift["Build-in"]["${name}"](`);
		});

		fs.writeFileSync(codePath, code);

		//---------------------------------------------

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../temp/Normal_Functions.ts")],
			outfile: path.join(__dirname, "../temp/Normal_Functions.js"),
			platform: "browser",
			minify: isProduction,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/Main/Transfer_Functions/Webpage_Functions.ts")],
			outfile: path.join(Build_Path, "Build_in_Functions.js"),
			platform: "browser",
		});

		let Functions_List_Data = "";
		const Functions_List_Content = fs.readFileSync(
			path.join(__dirname, "../src/Main/Build-in_Functions/Extension_Functions.ts"),
			"utf-8"
		);

		const Functions_List = [
			...new Set(
				[
					...Functions_List_Content.matchAll(/\b(\w+)\s*:\s*(async\s*function|function|async)?\s*\(/g),
					...Functions_List_Content.matchAll(/(\w+)\s*:\s*([a-zA-Z_]\w*)/g),
				].map((x) => x[1])
			),
		];

		for (const Function_Name of Functions_List) {
			Functions_List_Data += `StyleShift["Build-in"]["${Function_Name}"] = async function(...args){return await StyleShift["Build-in"]["_Call_Function"]("${Function_Name}",...args)};`;
		}

		Functions_List_Data += "window['StyleShift'] = StyleShift;";

		let Build_in_Functions_Data =
			`StyleShift = {"Build-in":{},"Custom":{}};` +
			(await fs.readFile(path.join(__dirname, "../temp/Normal_Functions.js"), "utf8")) +
			(await fs.readFile(path.join(Build_Path, "Build_in_Functions.js"), "utf8")).replace(/\n/g, "") +
			Functions_List_Data;

		await fs.writeFile(path.join(Build_Path, "Build_in_Functions.js"), Build_in_Functions_Data, "utf8");

		let Chromium = path.join(__dirname, "../out/dist/Chromium");
		let Firefox = path.join(__dirname, "../out/dist/Firefox");

		if (fs.existsSync(Chromium)) {
			fs.rmSync(Chromium, { recursive: true, force: true });
		}
		if (fs.existsSync(Firefox)) {
			fs.rmSync(Firefox, { recursive: true, force: true });
		}

		fs.copySync(path.join(__dirname, "../out/build"), Chromium);
		fs.copySync(path.join(__dirname, "../out/build"), Firefox);

		await Replace_for_Firefox(path.join(Firefox, "Style.css"));
		await Replace_for_Firefox(path.join(Firefox, "StyleShift.js"));

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.log("Error!");
		console.log(error);
		console.log("Trying again!");
		setTimeout(() => {
			build();
		}, 500);
	}

	Running = false;
	try {
		fs.removeSync(path.join(__dirname, "../temp"));
	} catch (error) {
		console.log("Error!");
		console.log(error);
		console.log("Trying again!");
		setTimeout(() => {
			build();
		}, 500);
	}
}

if (isOnce) {
	build();
} else {
	chokidar.watch(path.join(__dirname, "../src/Main")).on("all", async (event, path) => {
		console.log(event, path);
		await build();
	});
}
