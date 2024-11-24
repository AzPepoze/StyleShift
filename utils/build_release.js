const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * ฟังก์ชันบีบอัดโฟลเดอร์ (inputDir) เป็นไฟล์ .zip (output)
 * @param {string} inputDir - โฟลเดอร์ที่ต้องการบีบอัด
 * @param {string} output - ที่อยู่ไฟล์ .zip ที่จะบันทึก
 */
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

fs.readdirSync(path.join(__dirname, "../out/build")).forEach((file) => {
	zip(
		path.join(__dirname, "../out/build", file),
		path.join(__dirname, "../out/release", file + ".zip")
	);
});

