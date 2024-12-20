import { JSzip } from "../Modules/Main_Function";
import {
	deepClone,
	Download_File,
	HEX_to_RBGA,
	HSV_to_RGB,
	On_Function_Event,
	RGB_to_HSV,
	RGBA_to_HEX,
} from "../Modules/NormalFunction";
import { Settings_Current_State } from "../Settings/Settings_Function";
import { Hide_StyleSheet, Show_StyleSheet } from "../Settings/Settings_StyleSheet";
import { Get_Custom_Items } from "../Settings/StyleShift_Items";
import { Create_Error, Create_Notification } from "../UI/Extension_UI";

export let StyleShift_Functions = {
	/*
	-------------------------------------------------------
	For normal user !!!
	-------------------------------------------------------
	*/
	Copy_to_clipboard: function (text) {
		navigator.clipboard.writeText(text).then(
			() => {
				return true;
			},
			(err) => {
				console.error("Failed to copy text: ", err);
				return false;
			}
		);
	},

	Create_Notification: Create_Notification,

	Create_Error: Create_Error,

	/*
	-------------------------------------------------------
	For advanced user !!!
	-------------------------------------------------------
	*/

	Export_Custom_Items: function () {
		let Export_Custom_Items = deepClone(Get_Custom_Items());

		for (const This_Category of Export_Custom_Items) {
			delete This_Category.Highlight_Color;
			delete This_Category.Editable;

			for (const This_Setting of This_Category.Settings) {
				delete This_Setting.Editable;
			}
		}

		return Export_Custom_Items;
	},

	Export_Custom_Items_Text: function () {
		return JSON.stringify(StyleShift_Functions["Export_Custom_Items"](), null, 2);
	},

	Export_JSON_To_ZIP: async (jsonData, zipFileName) => {
		console.log("Data", jsonData);

		try {
			const zip = new JSzip();

			for (const [Category_index, This_Category] of jsonData.entries()) {
				let Renamed_Category = This_Category.Category.replace(/\/|\n/g, "_");

				const Category_Folder = zip.folder(`${Category_index} - ${Renamed_Category}`);

				if (This_Category.Category != Renamed_Category) {
					Category_Folder.file(
						"Category_Config.json",
						JSON.stringify(
							{
								Actual_Name: This_Category.Category,
							},
							null,
							2
						)
					);
				}

				if (This_Category.Settings) {
					for (const [
						Setting_index,
						This_Setting,
					] of This_Category.Settings.entries()) {
						let Renamed_Setting = This_Setting.name
							? This_Setting.name.replace(/\/|\n/g, "_")
							: This_Setting.id.replace(/\/|\n/g, "_");

						const Settings_Folder = Category_Folder.folder(
							`${Setting_index} - ${Renamed_Setting}`
						);

						for (const This_Key of Object.keys(This_Setting) as string[]) {
							if (This_Key.includes("function")) {
								Settings_Folder.file(
									`${This_Key}.js`,
									This_Setting[This_Key]
								);
								delete This_Setting[This_Key];
							}
						}

						Settings_Folder.file(
							"Config.json",
							JSON.stringify(This_Setting, null, 2)
						);
					}
				}
			}

			// Generate the ZIP file
			const zipBlob = await zip.generateAsync({ type: "blob" });

			// Trigger the download
			Download_File(zipBlob, zipFileName);
		} catch (error) {
			console.error("Error creating structured ZIP file:", error);
		}
	},

	Import_ZIP_TO_JSON: async (zipData) => {
		const JSON_Data = {};

		try {
			const zip = new JSzip();
			const zipContent = await zip.loadAsync(zipData);

			for (let This_Category_Folder_Name of Object.keys(zipContent.files)) {
				const This_Category_Folder = zip.folder(This_Category_Folder_Name);

				const Settings = [];

				//--------------------------------

				for (let This_Setting_Folder_Name of Object.keys(This_Category_Folder.files)) {
					const This_Setting_Folder =
						This_Category_Folder.folder(This_Setting_Folder_Name);

					const Config_File = This_Setting_Folder.file("Config.json");
					const Config_Data = await Config_File.async("string");
					const This_Setting_Data = JSON.parse(Config_Data);

					for (let This_Setting_Type_Name of Object.keys(
						This_Category_Folder.files
					)) {
						if (This_Setting_Type_Name != "Config.json") {
							This_Setting_Data[This_Setting_Type_Name] =
								await This_Setting_Folder.file(
									`${This_Setting_Type_Name}`
								).async("string");
						}
					}

					Settings.push(This_Setting_Data);
				}

				//--------------------------------

				const Category_Config_File = This_Category_Folder.file("Category_Config.json");

				if (Category_Config_File) {
					const Category_Config_Data = JSON.parse(
						await Category_Config_File.async("string")
					);
					This_Category_Folder_Name = Category_Config_Data.Actual_Name;
				}

				//--------------------------------

				JSON_Data[This_Category_Folder_Name] = Settings;
			}
		} catch (error) {
			console.error("Error reading ZIP file:", error);
		}

		return JSON_Data;
	},

	HEX_to_RBGA: HEX_to_RBGA,
	RGBA_to_HEX: RGBA_to_HEX,
	RGB_to_HSV: RGB_to_HSV,
	HSV_to_RGB: HSV_to_RGB,

	Get_StyleShift_Value: function (id) {
		return Settings_Current_State[id];
	},

	/*
	-------------------------------------------------------
	Danger functions !!!
	-------------------------------------------------------
	*/
	Enable_Extension_Function: function () {
		Show_StyleSheet();
	},

	Disable_Extension_Function: function () {
		Hide_StyleSheet();
	},
};

for (const This_Function_Name of Object.keys(StyleShift_Functions)) {
	On_Function_Event("StyleShift", This_Function_Name, StyleShift_Functions[This_Function_Name]);
}
