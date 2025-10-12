const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

function zip(inputDir, output) {
	const outputStream = fs.createWriteStream(output);

	const archive = archiver("zip", {
		zlib: { level: 9 },
	});

	outputStream.on("close", function () {
		console.log(`Created zip file: ${output} (${archive.pointer()} total bytes)`);
	});

	archive.on("error", function (err) {
		throw err;
	});

	archive.pipe(outputStream);
	archive.directory(inputDir, false);
	archive.finalize();
}

fs.readdirSync(path.join(__dirname, "../out/dist")).forEach((file) => {
	zip(path.join(__dirname, "../out/dist", file), path.join(__dirname, "../out/release", file + ".zip"));
});

export {};
