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
import { StyleShift_Property_List, Category, Get_Custom_Items, Setting } from "../Settings/StyleShift_Items";
import { Create_Error, Create_Notification } from "../UI/Extension_UI";

let Type_Convert_Table = {
	function: "js",
	css: "css",
};

function Clear_Bloat(thisSetting: any): any | null {
	const settingType = thisSetting.type;

	const Setting_Properties = StyleShift_Property_List[settingType];

	if (!Setting_Properties) {
		return null;
	}

	const cleanedSetting: any = {};
	for (const key of Setting_Properties) {
		if (key in thisSetting) {
			cleanedSetting[key] = thisSetting[key];
		}
	}

	return cleanedSetting;
}

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

	Get_File: async function (type) {
		return new Promise((resolve, reject) => {
			var input = document.createElement("input");
			input.type = "file";
			input.accept = type;

			input.click();

			input.addEventListener("change", function () {
				var file = input.files[0];
				if (file) {
					resolve(file);
				} else {
					reject(new Error("No file selected"));
				}
			});

			input.addEventListener("cancel", () => {
				reject(new Error("Canceled by the user"));
			});
		});
	},

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

	Export_StyleShift_Zip: async (jsonData, zipFileName) => {
		console.log("Data", jsonData);

		try {
			const zip = new JSzip();

			for (const [Category_index, This_Category] of jsonData.entries()) {
				const Renamed_Category = This_Category.Category.replace(/\/|\n/g, "_");
				const Category_Folder = zip.folder(`${Category_index} - ${Renamed_Category}`);

				if (This_Category.Category !== Renamed_Category) {
					Category_Folder.file(
						"Category_Config.json",
						JSON.stringify({ Actual_Name: This_Category.Category }, null, 2)
					);
				}

				if (This_Category.Settings) {
					for (const [Setting_index, This_Setting] of This_Category.Settings.entries()) {
						const Renamed_Setting = (This_Setting.name || This_Setting.id).replace(/\/|\n/g, "_");
						const Settings_Folder = Category_Folder.folder(`${Setting_index} - ${Renamed_Setting}`);

						for (const This_Key of Object.keys(This_Setting)) {
							for (const [StyleShift_Type, Converted_Type] of Object.entries(Type_Convert_Table)) {
								if (This_Key.endsWith(StyleShift_Type)) {
									Settings_Folder.file(
										`${This_Key}.${Converted_Type}`,
										This_Setting[This_Key]
									);
									delete This_Setting[This_Key];
								}
							}
						}

						Settings_Folder.file("Config.json", JSON.stringify(This_Setting, null, 2));
					}
				}
			}

			const zipBlob = await zip.generateAsync({ type: "blob" });
			Download_File(zipBlob, zipFileName);
		} catch (error) {
			console.error("Error creating structured ZIP file:", error);
		}
	},

	Import_StyleShift_Zip: async (zipFile) => {
		const zip = new JSzip();

		const loaded_zip = await zip.loadAsync(zipFile, {
			createFolders: true,
		});

		const StyleShift_Data: Category[] = [];

		const Category_Folders = Object.keys(loaded_zip.files).filter((path) => {
			const Path_Array = path.split("/");
			if (Path_Array.length === 2 && Path_Array[1] == "") {
				return true;
			}
		});

		for (const Category_Path of Category_Folders) {
			const Category_Path_Name = Category_Path.slice(0, -1);
			const Category_Array = Category_Path_Name.split(" - ");
			const Category_Index = Number(Category_Array[0]);
			let Category_Name = Category_Array[1];

			let Category_Config = loaded_zip.file(`${Category_Path_Name}/Category_Config.json`);

			if (Category_Config) {
				const ConfigContent = await Category_Config.async("string");
				const ConfigJson = JSON.parse(ConfigContent);
				Category_Name = ConfigJson.Actual_Name;
			}

			let Settings: Setting[] = [];

			for (const Setting_Path of Object.keys(loaded_zip.files)) {
				if (
					Setting_Path.split("/").length === 3 &&
					Setting_Path.startsWith(`${Category_Path_Name}/`) &&
					Setting_Path.endsWith("/")
				) {
					let Setting_Path_Name = Setting_Path.slice(Category_Path.length, -1);

					const Setting_Array = Setting_Path_Name.split(" - ");
					const Setting_Index = Number(Setting_Array[0]);

					let Setting_Data = JSON.parse(
						await loaded_zip.file(`${Setting_Path}Config.json`).async("string")
					);

					for (const Setting_Property_Path of Object.keys(loaded_zip.files)) {
						if (
							Setting_Property_Path.split("/").length === 3 &&
							Setting_Property_Path.startsWith(Setting_Path) &&
							!Setting_Property_Path.endsWith("/") &&
							!Setting_Property_Path.endsWith("Config.json")
						) {
							let Setting_Property_Name = Setting_Property_Path.slice(
								Setting_Path.length,
								Setting_Property_Path.lastIndexOf(".")
							);

							console.log(Setting_Property_Path);

							Setting_Data[Setting_Property_Name] = await loaded_zip
								.file(Setting_Property_Path)
								.async("string");
						}
					}

					Settings[Setting_Index] = Setting_Data;
				}
			}

			StyleShift_Data[Category_Index] = {
				Category: Category_Name,
				Settings: Settings,
			};
		}

		console.log(StyleShift_Data);

		return StyleShift_Data;
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
