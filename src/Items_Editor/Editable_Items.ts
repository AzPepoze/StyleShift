import { Get_Default_Items } from "../Default_Items";
import { Random } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";

let Highlight_Colors = [
	`255, 109, 109`,
	`167, 242, 255`,
	`255, 167, 248`,
	`188, 167, 255`,
	`255, 241, 167`,
];

let Editable_Items = {
	Default: [],
	Custom: [],
};

export function Get_Editable_Items() {
	return Editable_Items;
}

export function Get_Custom_Items() {
	return Editable_Items.Custom;
}

export function Get_ALL_Editable_Items() {
	return [...Editable_Items.Default, ...Editable_Items.Custom];
}

function Auto_Add_HightLight(Array) {
	for (const Category_OBJ of Array) {
		if (Category_OBJ.Highlight_Color == null) {
			let GetColorID = Random(0, Highlight_Colors.length - 1, Category_OBJ.Category);
			console.log("Random id", Category_OBJ.Category, GetColorID);
			//@ts-ignore
			Category_OBJ.Highlight_Color = Highlight_Colors[GetColorID];
		}
	}
}

export async function Update_Editable_Items() {
	Editable_Items.Default = Get_Default_Items();
	Editable_Items.Custom = (await Load("Custom_Editable_Items")) || [];

	Auto_Add_HightLight(Get_ALL_Editable_Items());

	for (const This_Setting of Editable_Items.Default.flatMap(function (This_Setting) {
		return This_Setting.Settings;
	})) {
		This_Setting.Editable = false;
	}

	for (const This_Setting of Editable_Items.Custom.flatMap(function (This_Setting) {
		return This_Setting.Settings;
	})) {
		This_Setting.Editable = true;
	}

	console.log("Updated Editable Items", Editable_Items);
}

let Settings_List = {};

export async function Get_Settings_List(Force = false) {
	if (!Force && Object.keys(Settings_List).length) {
		return Settings_List;
	}

	Settings_List = {};

	for (const Category_OBJ of Get_ALL_Editable_Items()) {
		try {
			for (const Setting of Category_OBJ.Settings) {
				Settings_List[Setting.id] = Setting;
			}
		} catch (error) {}
	}

	console.log("Test", Settings_List);

	return Settings_List;
}

// export function Get_Editable_Items_Selector_With_Value() {
// 	let Editable_Items_Selector_With_Color = {};

// 	for (let [Category_Name, Category_Value] of Object.entries(await Get_Editable_Items())) {
// 		if (Category_Value.Highlight_Color == null) {
// 			Category_Value.Color_ID = Random(0, Highlight_Colors.length - 1, Category_Name);
// 		}

// 		const Settings = Category_Value.Settings;

// 		// for (let [Selector, Selector_Value] of Category_Value.Settings as any) {
// 		// 	console.log("Waht", Selector_Value);

// 		// 	Selector_Value.Selector = Selector;
// 		// 	Selector_Value.Category = Category_Name;
// 		// 	Editable_Items_Selector_With_Color[Selector] = Selector_Value;
// 		// }
// 	}

// 	return Editable_Items_Selector_With_Color;
// }
