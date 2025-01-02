import { JSzip } from "../Core/Core_Function";
import { Convert_To_Export_Setting } from "../Core/Export_Converter";
import { StyleShift_Category_List } from "../Settings/Settings_Default_Items";
import { Settings_Current_State } from "../Settings/Settings_Function";
import { Hide_StyleSheet, Show_StyleSheet } from "../Settings/Settings_StyleSheet";
import { Get_Custom_Items } from "../Settings/StyleShift_Items";
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
export function Copy_to_clipboard(text: string) {
	navigator.clipboard.writeText(text).then(
		() => {
			return true;
		},
		(err) => {
			console.error("Failed to copy text: ", err);
			return false;
		}
	);
}

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
export async function Get_File(type) {
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
}

/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = Export_Custom_Items();
 */
export function Export_Custom_Items() {
	let Export_Custom_Items = deepClone(Get_Custom_Items());

	for (const This_Category of Export_Custom_Items) {
		delete This_Category.Highlight_Color;
		delete This_Category.Editable;

		for (const This_Setting of This_Category.Settings) {
			delete This_Setting.Editable;
		}
	}

	return Export_Custom_Items;
}

/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = Export_Custom_Items_Text();
 */
export function Export_Custom_Items_Text() {
	return JSON.stringify(Export_Custom_Items(), null, 2);
}

/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} StyleShift_Data - The JSON data.
 * @param {string} zipFileName - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await Export_StyleShift_Zip(data, "styleshift.zip");
 */
export async function Export_StyleShift_Zip(StyleShift_Data, zipFileName) {
	console.log("Data", StyleShift_Data);

	try {
		const zip = new JSzip();

		for (const [Category_index, This_Category] of StyleShift_Data.entries()) {
			const Renamed_Category = This_Category.Category.replace(/\/|\n/g, "_");
			const Category_Folder = zip.folder(`${Category_index} - ${Renamed_Category}`);

			const Category_Config = {};

			for (const [key, value] of Object.entries(StyleShift_Category_List)) {
				if (key !== "Settings") {
					if (This_Category[key]) {
						Category_Config[key] = This_Category[key];
					} else {
						Category_Config[key] = value;
					}
				}
			}

			Category_Folder.file("Config.json", JSON.stringify(Category_Config, null, 2));

			if (This_Category.Settings) {
				for (const [Setting_index, Original_Setting] of This_Category.Settings.entries()) {
					const Renamed_Setting_Name = (Original_Setting.name || Original_Setting.id).replace(
						/\/|\n/g,
						"_"
					);

					const This_Setting = deepClone(Original_Setting);
					const Settings_Folder = Category_Folder.folder(`${Setting_index} - ${Renamed_Setting_Name}`);

					await Convert_To_Export_Setting(This_Setting, async (File_Name, File_Data) => {
						Settings_Folder.file(File_Name, File_Data);
					});

					Settings_Folder.file("Config.json", JSON.stringify(This_Setting, null, 2));
				}
			}
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });
		Download_File(zipBlob, zipFileName);
	} catch (error) {
		console.error("Error creating structured ZIP file:", error);
	}
}

/**
 * Imports StyleShift data from a ZIP file.
 * @param {File} zipFile - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await Import_StyleShift_Zip(file);
 */
export async function Import_StyleShift_Zip(zipFile) {
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

		let Category_Config = loaded_zip.file(`${Category_Path_Name}/Config.json`);

		const ConfigContent = await Category_Config.async("string");
		const Category_Data = JSON.parse(ConfigContent);

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

		Category_Data["Settings"] = Settings;

		StyleShift_Data[Category_Index] = Category_Data;
	}

	console.log(StyleShift_Data);

	return StyleShift_Data;
}

/**
 * Gets the value of a StyleShift setting.
 * @param {string} id - The setting ID.
 * @returns {any}
 * @example
 * const value = Get_StyleShift_Value("setting_id");
 */
export async function Get_StyleShift_Value(id) {
	return Settings_Current_State[id];
}

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
export async function Enable_Extension_Function() {
	Show_StyleSheet();
}

/**
 * Disables the extension.
 * @example
 * Disable_Extension_Function();
 */
export async function Disable_Extension_Function() {
	Hide_StyleSheet();
}
