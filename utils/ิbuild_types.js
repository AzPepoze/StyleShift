const fs = require("fs");
const path = require("path");

const typesDir = path.join(__dirname, "../types");
const normalFunctionsPath = path.join(typesDir, "Normal_Functions.d.ts");
const extensionFunctionsPath = path.join(typesDir, "Extension_Functions.d.ts");
const styleShiftPath = path.join(typesDir, "StyleShift.d.ts");

// Read contents of Normal_Functions.d.ts and Extension_Functions.d.ts
const normalFunctionsContent = fs.readFileSync(normalFunctionsPath, "utf-8");
const extensionFunctionsContent = fs.readFileSync(extensionFunctionsPath, "utf-8");

// Combine contents and write to StyleShift.d.ts
const combinedContent = `${normalFunctionsContent}\n${extensionFunctionsContent}`;
fs.writeFileSync(styleShiftPath, combinedContent, "utf-8");

// Remove all files in the types directory
fs.readdirSync(typesDir).forEach((file) => {
	if (file !== "StyleShift.d.ts") {
		fs.unlinkSync(path.join(typesDir, file));
	}
});
