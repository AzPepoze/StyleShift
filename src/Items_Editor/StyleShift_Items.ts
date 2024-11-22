import { Get_Default_Items } from '../Default_Items';
import { Random } from '../Modules/NormalFunction';
import { Load, Save_Any } from '../Modules/Save';
import { SetUp_Setting_Function, Update_All } from '../Settings/Settings_Function';

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

	Settings: Setting[];
	Highlight_Color?: string;
};

export type option = {
	enable_css?: string;
	enable_function?: string | Function;

	disable_function?: string | Function;
};

export type color_obj = {
	RGB: { r: number; g: number; b: number };
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
			color?: color_obj;
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

			value: color_obj;

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

	for (const This_Setting of StyleShift_Items.Custom.flatMap(function (This_Setting) {
		return This_Setting.Settings;
	})) {
		This_Setting.Editable = true;
	}

	console.log("Updated Editable Items", StyleShift_Items);
}

let Settings_List = {};

export async function Get_Settings_List(Force = false) {
	if (!Force && Object.keys(Settings_List).length) {
		return Settings_List;
	}

	Settings_List = {};

	for (const Category_OBJ of Get_ALL_StyleShift_Items()) {
		try {
			for (const Setting of Category_OBJ.Settings) {
				Settings_List[Setting.id] = Setting;
			}
		} catch (error) {}
	}

	console.log("Test", Settings_List);

	return Settings_List;
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
