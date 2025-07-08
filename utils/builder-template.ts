import { Convert_To_Export_Setting } from "../src/main/core/export-converter";
import { UI_Preset } from "../src/main/settings/default-items";

const fs = require("fs");
const path = require("path");

async function Create_Setting_Folder(Category_Folder_Path, This_Setting, Setting_Folder_Name) {
	const Settings_Folder_Path = path.join(Category_Folder_Path, Setting_Folder_Name);

	fs.mkdirSync(Settings_Folder_Path, { recursive: true });

	await Convert_To_Export_Setting(This_Setting, async (File_Name, File_Data) => {
		fs.writeFileSync(path.join(Settings_Folder_Path, `${File_Name}`), File_Data);
	});

	fs.writeFileSync(path.join(Settings_Folder_Path, "config.json"), JSON.stringify(This_Setting, null, 2));
}

const Template_Folder = path.join(__dirname, "../devs/templates");

(async () => {
	for (const This_Preset of UI_Preset) {
		await Create_Setting_Folder(Template_Folder, This_Preset, This_Preset.type);
	}
})();
