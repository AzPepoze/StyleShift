import { Is_Same_OBJ, sleep } from "../Build-in_Functions/Normal_Functions";
import { HEX_to_Color_OBJ, Run_Text_Script_From_Setting } from "../Core/Core_Function";
import { Load_Any } from "../Core/Save";
import { Setting } from "../types/Store_Data";
import { Create_StyleSheet } from "./Settings_StyleSheet";

export let Settings_Current_State = {};
let Settings_Update_Function: { [key: string]: Function } = {};

let Settings_Funcion = {
	["Checkbox"]: async function (This_Setting) {
		let StyleSheet: HTMLElement;
		if (This_Setting.setup_css || This_Setting.enable_css || This_Setting.disable_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
			console.log(StyleSheet);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			//----------------------

			if (Settings_Current_State[This_Setting.id] == value) return;
			Set_Variable(This_Setting.id, value);
			Settings_Current_State[This_Setting.id] = value;

			//----------------------

			if (StyleSheet) {
				StyleSheet.textContent = This_Setting.setup_css || ``;
			}

			if (value) {
				if (StyleSheet) {
					StyleSheet.textContent += This_Setting.enable_css || ``;
				}
				if (This_Setting.enable_function) {
					Run_Text_Script_From_Setting(This_Setting, "enable_function");
				}
			} else {
				if (StyleSheet) {
					StyleSheet.textContent += This_Setting.disable_css || ``;
				}
				if (This_Setting.disable_function) {
					Run_Text_Script_From_Setting(This_Setting, "disable_function");
				}
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Number_Slide"]: async function (This_Setting: Partial<Extract<Setting, { type: "Number_Slide" }>>) {
		let StyleSheet: HTMLElement;
		if (This_Setting.update_css || This_Setting.var_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
			console.log(StyleSheet);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			//----------------------

			if (Settings_Current_State[This_Setting.id] == value) return;
			Set_Variable(This_Setting.id, value);
			Settings_Current_State[This_Setting.id] = value;

			//----------------------

			if (StyleSheet) {
				StyleSheet.textContent = "";
				StyleSheet.textContent += `:root{${
					This_Setting.var_css ? This_Setting.var_css : `--${This_Setting.id}`
				}: ${value}px}`;
				if (This_Setting.update_css) {
					StyleSheet.textContent += This_Setting.update_css;
				}
			}

			if (This_Setting.update_function) {
				Run_Text_Script_From_Setting(This_Setting, "update_function");
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Dropdown"]: async function (This_Setting: Partial<Extract<Setting, { type: "Dropdown" }>>) {
		let StyleSheet: HTMLElement;
		StyleSheet = Create_StyleSheet(This_Setting.id);

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			if (Settings_Current_State[This_Setting.id] == value) return;
			Set_Variable(This_Setting.id, value);

			//----------------------

			const Old_Dropdown = This_Setting.options[Settings_Current_State[This_Setting.id]];
			Run_Text_Script_From_Setting(This_Setting, "disable_function");

			//----------------------

			Settings_Current_State[This_Setting.id] = value;
			const Current_Dropdown = This_Setting.options[value];
			Run_Text_Script_From_Setting(This_Setting, "enable_function");

			//----------------------

			StyleSheet.textContent = "";
			if (This_Setting.setup_css) {
				StyleSheet.textContent += This_Setting.setup_css;
			}
			if (Current_Dropdown.enable_css) {
				StyleSheet.textContent += Current_Dropdown.enable_css;
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Color"]: async function (This_Setting: Partial<Extract<Setting, { type: "Color" }>>) {
		let StyleSheet: HTMLElement;

		if (This_Setting.update_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
			console.log(StyleSheet);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			console.log("UPDATE!!!!");
			let value = await Load_Any(This_Setting.id);

			console.log(value);

			//----------------------

			if (Settings_Current_State[This_Setting.id] != null) {
				console.log(Is_Same_OBJ(Settings_Current_State[This_Setting.id], value));
			}

			Set_Variable(This_Setting.id, HEX_to_Color_OBJ(value));
			Settings_Current_State[This_Setting.id] = value;

			//----------------------

			console.log("Test", StyleSheet);

			if (StyleSheet) {
				StyleSheet.textContent = "";
				StyleSheet.textContent += `:root{${
					This_Setting.var_css ? This_Setting.var_css : `--${This_Setting.id}`
				}: ${value}}`;
				StyleSheet.textContent += This_Setting.update_css || ``;
				console.log(StyleSheet.textContent);
			}

			//----------------------

			if (This_Setting.update_function) {
				Run_Text_Script_From_Setting(This_Setting, "update_function");
			}
		}

		Update_Function();

		return Update_Function;
	},
};

export function Set_Variable(id, value) {
	console.log("SET", id, value);
	setTimeout(() => {
		window[id] = value;
	}, 0);
}

export async function SetUp_Setting_Function(This_Setting) {
	if (This_Setting.id == null) return;

	const Get_Update_Function = Settings_Funcion[This_Setting.type];
	if (!Get_Update_Function) return;

	let Update_Function = await Get_Update_Function(This_Setting);
	Settings_Update_Function[This_Setting.id] = Update_Function;

	return Update_Function;
}

let Updating_Setting_Function = {};

export async function Update_Setting_Function(id) {
	console.log("Update", id, Settings_Update_Function[id]);

	console.log(Updating_Setting_Function[id]);

	if (Updating_Setting_Function[id]) {
		return;
	}

	Updating_Setting_Function[id] = true;
	await Settings_Update_Function[id]();
	await sleep(100);
	await Settings_Update_Function[id]();
	delete Updating_Setting_Function[id];

	// console.log(Settings_Update_Function[id].toString());
}
