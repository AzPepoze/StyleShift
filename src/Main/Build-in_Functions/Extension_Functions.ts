import { JSzip } from "../Modules/Main_Function";
import { Settings_Current_State } from "../Settings/Settings_Function";
import { Hide_StyleSheet, Show_StyleSheet } from "../Settings/Settings_StyleSheet";
import { Get_Custom_Items } from "../Settings/StyleShift_Items";
import { Type_Convert_Table } from "../Transfer_Functions/Extension_Functions_Loader";
import { Category, Setting } from "../types/Store_Data";
import { Notification_Container, Run_Animation } from "../UI/Extension_UI";
import { Settings_UI } from "../UI/Settings/Settings_UI_Components";
import { deepClone, Download_File, sleep } from "./Normal_Functions";

/*
-------------------------------------------------------
For Normal user !!!
-------------------------------------------------------
*/

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {boolean}
 * @example
 * Copy_to_clipboard("Hello, world!"); // Copies "Hello, world!" to the clipboard
 */
export const Copy_to_clipboard = function (text) {
	navigator.clipboard.writeText(text).then(
		() => {
			return true;
		},
		(err) => {
			console.error("Failed to copy text: ", err);
			return false;
		}
	);
};

/**
 * Creates a notification.
 * @param {Object} options - The notification options.
 * @param {string} [options.Icon=null] - The icon.
 * @param {string} [options.Title="StyleShift"] - The title.
 * @param {string} [options.Content=""] - The content.
 * @param {number} [options.Timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await Create_Notification({ Title: "Hello", Content: "This is a notification" });
 */
export async function Create_Notification({ Icon = null, Title = "StyleShift", Content = "", Timeout = 3000 }) {
	console.log(Title, Content);

	const Notification_Frame = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Notification_Frame.className = "STYLESHIFT-Notification";
	Notification_Container.append(Notification_Frame);

	let Icon_UI;

	if (Icon) {
		Icon_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Icon_UI.className += " STYLESHIFT-Notification-Icon";
		Icon_UI.textContent = Icon;
		Notification_Frame.append(Icon_UI);
	}

	//---------------------------------

	const Notification_Content_Frame = await Settings_UI["Setting_Frame"](false, true);
	Notification_Content_Frame.className += " STYLESHIFT-Notification-Content-Frame";
	Notification_Frame.append(Notification_Content_Frame);

	const Title_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Title_UI.className += " STYLESHIFT-Notification-Title";
	Title_UI.textContent = Title;
	Notification_Content_Frame.append(Title_UI);

	const Content_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Content_UI.className += " STYLESHIFT-Notification-Content";
	Notification_Content_Frame.append(Content_UI);

	let Set_Content = (New_Content) => {
		New_Content = String(New_Content);
		Content_UI.innerHTML = New_Content.replaceAll("<script", "").replaceAll("/script>", "");
	};

	Set_Content(Content);

	//---------------------------------

	async function Close() {
		await Run_Animation(Notification_Frame, "Notification-Hide");
		Notification_Frame.remove();
	}

	if (Timeout == 0) {
		const Close_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Close_UI.className += " STYLESHIFT-Notification-Close";
		Close_UI.textContent = "X";
		Notification_Frame.append(Close_UI);

		Close_UI.addEventListener("click", function (e) {
			e.preventDefault();
			Close();
		});
	}

	//---------------------------------

	await Run_Animation(Notification_Frame, "Notification-Show");
	setTimeout(async () => {
		if (Timeout > 0) {
			await sleep(Timeout);
			Close();
		}
	}, 0);

	return {
		Set_Icon: (New_Icon) => {
			if (Icon_UI) {
				Icon_UI.textContent = New_Icon;
			}
		},
		Set_Content,
		Set_Title: (New_Title) => {
			Title_UI.textContent = New_Title;
		},
		Close,
	};
}

/**
 * Creates an error notification.
 * @param {string} Content - The error content.
 * @returns {Promise<Object>}
 * @example
 * await Create_Error("An error occurred");
 */
export async function Create_Error(Content) {
	return await Create_Notification({
		Icon: "❌",
		Title: "StyleShift - Error",
		Content: Content,
		Timeout: 0,
	});
}

/*
-------------------------------------------------------
For advanced user !!!
-------------------------------------------------------
*/

/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<File>}
 * @example
 * const file = await Get_File(".txt");
 */
export const Get_File = async function (type) {
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
};

/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = Export_Custom_Items();
 */
export const Export_Custom_Items = function () {
	let Export_Custom_Items = deepClone(Get_Custom_Items());

	for (const This_Category of Export_Custom_Items) {
		delete This_Category.Highlight_Color;
		delete This_Category.Editable;

		for (const This_Setting of This_Category.Settings) {
			delete This_Setting.Editable;
		}
	}

	return Export_Custom_Items;
};

/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = Export_Custom_Items_Text();
 */
export const Export_Custom_Items_Text = function () {
	return JSON.stringify(Export_Custom_Items(), null, 2);
};

/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} jsonData - The JSON data.
 * @param {string} zipFileName - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await Export_StyleShift_Zip(data, "styleshift.zip");
 */
export const Export_StyleShift_Zip = async (jsonData, zipFileName) => {
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
								Settings_Folder.file(`${This_Key}.${Converted_Type}`, This_Setting[This_Key]);
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
};

/**
 * Imports StyleShift data from a ZIP file.
 * @param {File} zipFile - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await Import_StyleShift_Zip(file);
 */
export const Import_StyleShift_Zip = async (zipFile) => {
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

				let Setting_Data = JSON.parse(await loaded_zip.file(`${Setting_Path}Config.json`).async("string"));

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
};

/**
 * Gets the value of a StyleShift setting.
 * @param {string} id - The setting ID.
 * @returns {any}
 * @example
 * const value = Get_StyleShift_Value("setting_id");
 */
export const Get_StyleShift_Value = function (id) {
	return Settings_Current_State[id];
};

/*
-------------------------------------------------------
Danger functions !!!
-------------------------------------------------------
*/

/**
 * Enables the extension.
 * @example
 * Enable_Extension_Function();
 */
export const Enable_Extension_Function = function () {
	Show_StyleSheet();
};

/**
 * Disables the extension.
 * @example
 * Disable_Extension_Function();
 */
export const Disable_Extension_Function = function () {
	Hide_StyleSheet();
};
