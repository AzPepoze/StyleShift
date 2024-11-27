import { Category } from "./Settings/StyleShift_Items";
import { StyleShift_Functions } from "./Recived_Global_Functions";

let Setting_Page_Items: Category[] = [
	{
		Category: "📜 Import / Export Style",
		Settings: [
			{
				type: "Button",
				id: "Export_ZIP_File",
				name: "Export File",
				description: "Description of this Button",
				color: "#ffe21aff",
				font_size: 15,
				click_function: async function () {
					StyleShift_Functions["Export_JSON_To_ZIP"](
						JSON.parse(await StyleShift_Functions["Export_Custom_Items_Text"]()),
						"Test.zip"
					);
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
