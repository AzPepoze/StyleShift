const esbuild = require("esbuild");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");

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
		// Read the file
		let data = await fs.readFile(filePath, "utf8");

		let modifiedContent;
		// Modify content based on file extension
		if (filePath.endsWith(".css") || filePath.endsWith(".js")) {
			modifiedContent = await Replace_for_Firefox_Text(data);
		} else {
			console.log(`Skipping file '${filePath}'`);
			return; // Skip processing non-CSS and non-JS files
		}

		// Write the modified content back to the file
		await fs.writeFile(filePath, modifiedContent, "utf8");
		console.log(`File '${filePath}' updated successfully!`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}

let Running = false;
async function build(Mode) {
	if (Running) {
		return;
	}
	Running = true;

	try {
		console.log("Building");

		await esbuild.build({
			entryPoints: ["./src/Run.ts"],
			bundle: true,
			outfile: "./dist/StyleShift.js",
			platform: "browser",
			// target: ["es2020"],
			// minify: true,
			// format: "esm",
			define: {
				"process.env.mode": `"${Mode}"`,
			},
		});

		await esbuild.build({
			entryPoints: ["./src/Modules/NormalFunction.ts"],
			outfile: "./temp/NormalFunction.js",
			platform: "browser",
			minify: true,
			keepNames: true,
			define: {
				"process.env.mode": `"${Mode}"`,
			},
		});

		await esbuild.build({
			entryPoints: ["./src/Sent_Global_Functions.ts"],
			outfile: "./dist/Global_Functions.js",
			platform: "browser",
			define: {
				"process.env.mode": `"${Mode}"`,
			},
		});

		let Functions_List_Data = "";
		const Functions_List_Content = fs.readFileSync(
			"./src/Recived_Global_Functions.ts",
			"utf-8"
		);
		const Functions_List = [...Functions_List_Content.matchAll(/(\w+)\s*:/g)].map(
			(x) => x[1]
		);

		for (const Function_Name of Functions_List) {
			Functions_List_Data += `async function ${Function_Name}(...args){return await StyleShift("${Function_Name}",...args)};`;
		}

		let Global_Functions_Data =
			(await fs.readFile("./temp/NormalFunction.js", "utf8")).replace(/export /g, "") +
			(await fs.readFile("./dist/Global_Functions.js", "utf8")).replace(/\n/g, "") +
			Functions_List_Data;

		await fs.writeFile("./dist/Global_Functions.js", Global_Functions_Data, "utf8");

		let Chromium;
		let Firefox;

		switch (Mode) {
			case "production":
				Chromium = "./out/build/Chromium";
				Firefox = "./out/build/Firefox";
				break;
			case "dev":
				Chromium = "./out/build/Chromium (Developer)";
				Firefox = "./out/build/Firefox (Developer)";
				break;
		}

		if (fs.existsSync(Chromium)) {
			fs.rmSync(Chromium, { recursive: true, force: true });
		}
		if (fs.existsSync(Firefox)) {
			fs.rmSync(Firefox, { recursive: true, force: true });
		}

		fs.copySync("./dist", Chromium);
		fs.copySync("./dist", Firefox);

		await Replace_for_Firefox(path.join(Firefox, "Style.css"));
		await Replace_for_Firefox(path.join(Firefox, "StyleShift.js"));

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.log(error);
	}

	Running = false;
	fs.removeSync("./temp");
}

chokidar.watch("./src").on("all", async (event, path) => {
	console.log(event, path);
	await build("production");
	await build("dev");
});
