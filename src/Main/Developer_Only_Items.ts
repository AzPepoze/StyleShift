import * as StyleShift_Functions from "./Build-in_Functions/Extension_Functions";
import { sleep } from "./Build-in_Functions/Normal_Functions";
import { Category } from "./types/Store_Data";

let Setting_Page_Items: Category[] = [
	{
		Category: "↕️ Import / Export Theme",
		Settings: [
			{
				type: "Setting_Sub_Title",
				color: "#1a34ffff",
				font_size: 15,
				text_align: "center",
				text: "File (.StyleShift.zip)",
			},
			{
				type: "Button",
				id: "Export_ZIP_File",
				name: "Export File",
				description: "Description of this Button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					let Notification = await StyleShift_Functions["Create_Notification"]({
						Icon: "🔄️",
						Title: "StyleShift - Exporting File",
						Content: "Please wait...",
						Timeout: -1,
					});

					try {
						StyleShift_Functions["Export_StyleShift_Zip"](
							JSON.parse(await StyleShift_Functions["Export_StyleShift_JSON_Text"]()),
							"Test.StyleShift.zip"
						);

						Notification.Set_Icon("✅");
						Notification.Set_Title("StyleShift - Exported File");
						Notification.Set_Content("Exported successfully!");

						await sleep(3000);

						Notification.Close();
					} catch (error) {
						Notification.Close();
						StyleShift_Functions["Create_Error"](error).then((Notification) => {
							Notification.Set_Title("StyleShift - Error exporting file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
			{
				type: "Button",
				id: "Import_ZIP_File",
				name: "Import File",
				description: "Description of this Button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					let Notification = await StyleShift_Functions["Create_Notification"]({
						Icon: "🔄️",
						Title: "StyleShift - Choosing file",
						Content: "Please choose file...",
						Timeout: -1,
					});
					try {
						StyleShift_Functions["Import_StyleShift_Zip"](
							await StyleShift_Functions["Get_File"](".StyleShift.zip")
						);

						Notification.Set_Icon("✅");
						Notification.Set_Title("StyleShift - Imported File");
						Notification.Set_Content("Imported successfully!");

						await sleep(3000);

						Notification.Close();
					} catch (error) {
						Notification.Close();
						StyleShift_Functions["Create_Error"](error).then((Notification) => {
							Notification.Set_Title("StyleShift - Error importing file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
		],
	},
];

export function Get_Setting_Page_Only_Items() {
	return Setting_Page_Items;
}
