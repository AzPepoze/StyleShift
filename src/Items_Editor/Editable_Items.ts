import { Get_Default_Items } from "../Default_Items";
import { deepMerge, Random } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";

var Highlight_Colors = [
	`rgb(255, 109, 109`,
	`rgb(167, 242, 255`,
	`rgb(255, 167, 248`,
	`rgb(188, 167, 255`,
	`rgb(255, 241, 167`,
];

var Editable_Items = {
	Default: [],
	Custom: [],
};

export function Get_Editable_Items() {
	return Editable_Items;
}

export function Get_ALL_Editable_Items() {
	return [...Editable_Items.Default, ...Editable_Items.Custom];
}

function Auto_Add_HightLight(Array) {
	for (const Category_OBJ of Array) {
		if (Category_OBJ.Highlight_Color == null) {
			var GetColorID = Random(0, Highlight_Colors.length - 1, Category_OBJ.Category);
			//@ts-ignore
			Category_OBJ.Highlight_Color = Highlight_Colors[GetColorID];
		}
	}
}

export async function Update_Editable_Items() {
	Editable_Items.Default = Get_Default_Items();
	Editable_Items.Custom = (await Load("Custom_Editable_Items")) || [];

	Auto_Add_HightLight(Editable_Items.Default);
	Auto_Add_HightLight(Editable_Items.Custom);

	console.log("Updated Editable Items", Editable_Items);
}

export function Get_Custom_Items() {
	return Editable_Items.Custom;
}

var Settings_List = {};

export async function Get_Settings_List() {
	if (Object.keys(Settings_List).length) {
		return Settings_List;
	}

	for (const Category_OBJ of [...Get_Editable_Items().Default, ...Get_Editable_Items().Custom]) {
		try {
			for (const Setting of Category_OBJ.Settings) {
				Settings_List[Setting.id] = Setting;
			}
		} catch (error) {}
	}

	return Settings_List;
}

// export function Get_Editable_Items_Selector_With_Value() {
// 	let Editable_Items_Selector_With_Color = {};

// 	for (var [Category_Name, Category_Value] of Object.entries(await Get_Editable_Items())) {
// 		if (Category_Value.Highlight_Color == null) {
// 			Category_Value.Color_ID = Random(0, Highlight_Colors.length - 1, Category_Name);
// 		}

// 		const Settings = Category_Value.Settings;

// 		// for (var [Selector, Selector_Value] of Category_Value.Settings as any) {
// 		// 	console.log("Waht", Selector_Value);

// 		// 	Selector_Value.Selector = Selector;
// 		// 	Selector_Value.Category = Category_Name;
// 		// 	Editable_Items_Selector_With_Color[Selector] = Selector_Value;
// 		// }
// 	}

// 	return Editable_Items_Selector_With_Color;
// }
