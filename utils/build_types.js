const fs = require("fs");
const path = require("path");

const typesDir = path.join(__dirname, "../types");
const typesSubDir = path.join(typesDir, "types");
const Build_in_Functions_Dir = path.join(typesDir, "Build-in_Functions");
const normalFunctionsPath = path.join(Build_in_Functions_Dir, "Normal_Functions.d.ts");
const extensionFunctionsPath = path.join(Build_in_Functions_Dir, "Extension_Functions.d.ts");
const styleShiftPath = path.join(typesDir, "StyleShift.d.ts");

// Read contents of Normal_Functions.d.ts and Extension_Functions.d.ts
const normalFunctionsContent = fs.readFileSync(normalFunctionsPath, "utf-8");
const extensionFunctionsContent = fs.readFileSync(extensionFunctionsPath, "utf-8");

// Read contents of all files in ../types/types
let typesSubDirContent = "";
fs.readdirSync(typesSubDir).forEach((file) => {
	const filePath = path.join(typesSubDir, file);
	if (fs.statSync(filePath).isFile()) {
		typesSubDirContent += fs.readFileSync(filePath, "utf-8") + "\n";
	}
});

// Combine contents and write to StyleShift.d.ts
const defaultExport = `
export function Set_Value(id: string, value: any): void;
export function Get_Value(id: string): any;
`;

const combinedContent =
	`${defaultExport}\n${normalFunctionsContent}\n${extensionFunctionsContent}\n${typesSubDirContent}`
		.replaceAll("declare", "")
		.replaceAll('import { Category } from "../types/Store_Data";', "");

fs.writeFileSync(styleShiftPath, `declare global {\n${combinedContent}\n}\nexport {};`, "utf-8");

fs.readdirSync(typesDir).forEach((file) => {
	if (file !== "StyleShift.d.ts") {
		try {
			fs.unlinkSync(path.join(typesDir, file));
		} catch (error) {}
		try {
			fs.rmSync(path.join(typesDir, file), { recursive: true });
		} catch (error) {}
	}
});

console.log("Types built successfully!");
