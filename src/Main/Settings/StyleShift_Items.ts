import { Get_Default_Items } from "../Default_Items";
import { Random } from "../Modules/NormalFunction";
import { Load, Save_All, Save_Any } from "../Modules/Save";
import { Update_All } from "../Run";
import { SetUp_Setting_Function } from "./Settings_Function";

let Highlight_Colors = [
	`255, 109, 109`,
	`167, 242, 255`,
	`255, 167, 248`,
	`188, 167, 255`,
	`255, 241, 167`,
];

export type Category = {
	Category: string;
	Rainbow?: boolean;
	Selector?: string;

	Editable?: boolean;
	Settings: Setting[];
	Highlight_Color?: string;
};

export type option = {
	enable_css?: string;
	enable_function?: string | Function;

	disable_function?: string | Function;
};

export type color_obj = {
	HEX: string;
	Alpha: number;
};

export type Setting =
	| {
			type: "Text";
			id?: string;

			html: string;

			text_align?: "left" | "center" | "right";
			color?: color_obj;
			font_size?: number;

			Editable?: boolean;
	  }
	| {
			type: "Button";
			id?: string;
			name: string;
			description?: string;

			icon?: string;
			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			click_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Checkbox";
			id: string;
			name: string;
			description?: string;

			value: boolean;

			setup_css?: string;
			setup_function?: string | Function;

			enable_css?: string;
			enable_function?: string | Function;

			disable_css?: string;
			disable_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Number_Slide";
			id: string;
			name: string;
			description?: string;

			min?: number;
			max?: number;
			step?: number;
			value: number;

			var_css?: string;

			setup_css?: string;
			setup_function?: string | Function;

			update_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Dropdown";
			id: string;
			name: string;
			description?: string;

			value: string;

			setup_css?: string;
			setup_function?: string | Function;

			options: { [key: string]: option };

			Editable?: boolean;
	  }
	| {
			type: "Color";
			id: string;
			name: string;
			description?: string;
			show_alpha_slider?: boolean;

			value: string;

			var_css?: string;

			setup_css?: string;
			setup_function?: string | Function;

			update_function?: string | Function;

			Editable?: boolean;
	  };

let StyleShift_Items: { Default: Category[]; Custom: Category[] } = {
	Default: [],
	Custom: [],
};

export function Get_StyleShift_Items() {
	return StyleShift_Items;
}

export function Get_Custom_Items() {
	return StyleShift_Items.Custom;
}

export function Get_Custom_Settings() {
	return StyleShift_Items.Custom.map((item) => item.Settings).flat();
}

export function Get_ALL_StyleShift_Items() {
	return [...StyleShift_Items.Default, ...StyleShift_Items.Custom];
}

export function Get_ALL_StyleShift_Settings() {
	return Get_ALL_StyleShift_Items()
		.map((item) => item.Settings)
		.flat();
}

export function Find_Exist_Settings(Setting: Setting) {
	return Get_ALL_StyleShift_Settings().some(
		(This_Setting) =>
			This_Setting.id === Setting.id &&
			//@ts-ignore
			(This_Setting.name == null || This_Setting.name === Setting.name)
	);
}

export function Get_Setting_Category(Setting: Setting) {
	for (const This_Category of Get_ALL_StyleShift_Items()) {
		for (const This_Setting of This_Category.Settings) {
			if (This_Setting === Setting) {
				return This_Category;
			}
		}
	}
	return 0;
}

export function Find_Exist_Category(Category: Category) {
	return Get_ALL_StyleShift_Items().some(
		(This_Category) => This_Category.Category === Category.Category
	);
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

export async function Update_StyleShift_Items() {
	StyleShift_Items.Default = Get_Default_Items();
	StyleShift_Items.Custom = (await Load("Custom_StyleShift_Items")) || [];

	Auto_Add_HightLight(Get_ALL_StyleShift_Items());

	for (const This_Setting of StyleShift_Items.Default.flatMap(function (This_Setting) {
		return This_Setting.Settings;
	})) {
		This_Setting.Editable = false;
	}

	for (const This_Category of StyleShift_Items.Custom) {
		This_Category.Editable = true;
	}

	for (const This_Setting of StyleShift_Items.Custom.flatMap(function (This_Setting) {
		return This_Setting.Settings;
	})) {
		This_Setting.Editable = true;
	}

	console.log("Updated Editable Items", StyleShift_Items);
}

let Settings_List = {};

export async function Get_Settings_List(Force = false): Promise<Setting[] | {}> {
	if (!Force && Object.keys(Settings_List).length) {
		return Settings_List;
	}

	Settings_List = {};

	for (const Category_OBJ of Get_ALL_StyleShift_Items()) {
		try {
			for (const Setting of Category_OBJ.Settings) {
				if (Setting.id == "") {
					continue;
				}
				Settings_List[Setting.id] = Setting;
			}
		} catch (error) {}
	}

	return Settings_List;
}

//--------------------------------------------------

export async function Add_Setting(Category_Settings: Setting[], This_Setting) {
	let Find_Similar = Find_Exist_Settings(This_Setting);
	let New_Preset;
	let Times = 0;

	while (Find_Similar) {
		Times++;
		New_Preset = Object.assign({}, This_Setting);
		New_Preset.id += `_${Times}`;
		New_Preset.name += `_${Times}`;
		Find_Similar = Find_Exist_Settings(New_Preset);
		console.log(Find_Similar, Times, New_Preset);
	}

	if (New_Preset) {
		This_Setting = New_Preset;
	}

	Category_Settings.push(This_Setting);
	console.log("Update Category Settings", Category_Settings);

	if (This_Setting.value) {
		await Save_Any(This_Setting.id, This_Setting.value);
	}

	SetUp_Setting_Function(This_Setting);
	Update_All();
}

export async function Remove_Setting(This_Setting) {
	for (const This_Category of Get_Custom_Items()) {
		const index = (This_Category.Settings || []).findIndex(
			(Check_Setting) => Check_Setting === This_Setting
		);

		if (index > -1) {
			This_Category.Settings.splice(index, 1);
		}
	}
	Update_All();
}

//--------------------------------------------------

export async function Add_Category(Category_Name: string) {
	let This_Category: Category = {
		Category: Category_Name,
		Settings: [],
	};

	let Find_Similar = Find_Exist_Category(This_Category);
	let New_Category: Category;
	let Times = 0;

	while (Find_Similar) {
		Times++;
		New_Category = Object.assign({}, This_Category);
		New_Category.Category += `_${Times}`;
		Find_Similar = Find_Exist_Category(New_Category);
		console.log(Find_Similar, Times, New_Category);
	}

	if (New_Category) {
		This_Category = New_Category;
	}

	const Custom_Items = Get_Custom_Items();

	Custom_Items.push(This_Category);
	console.log("Added Category", Custom_Items);

	Save_All();
	Update_All();
}

export async function Remove_Category(This_Category) {
	const Custom_Items = Get_Custom_Items();

	const index = Custom_Items.findIndex((Check_Category) => Check_Category === This_Category);

	if (index > -1) {
		Custom_Items.splice(index, 1);
	}

	Update_All();
}

//-------------------------------------------------

export function Get_StyleShift_Data_Type(This_Data) {
	if (This_Data.Category != null) {
		return "Category";
	}

	return "Setting";
}
