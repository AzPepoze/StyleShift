import { Category } from "./Items_Editor/StyleShift_Items";
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
				color: {
					RGB: {
						r: 0,
						g: 255,
						b: 220,
					},
					Alpha: 1,
				},
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
