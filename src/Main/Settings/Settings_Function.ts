import { HEX_to_Color_OBJ, Run_Text_Script } from "../Modules/Main_Function";
import { Is_Same_OBJ } from "../Modules/NormalFunction";
import { Load_Any } from "../Modules/Save";
import { Create_StyleSheet } from "./Settings_StyleSheet";
import { Setting } from "./StyleShift_Items";

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
			Run_Text_Script(This_Setting.setup_function);
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
					Run_Text_Script(This_Setting.enable_function);
				}
			} else {
				if (StyleSheet) {
					StyleSheet.textContent += This_Setting.disable_css || ``;
				}
				if (This_Setting.disable_function) {
					Run_Text_Script(This_Setting.disable_function);
				}
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Number_Slide"]: async function (This_Setting) {
		let StyleSheet: HTMLElement;
		if (This_Setting.setup_css || This_Setting.var_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
			console.log(StyleSheet);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script(This_Setting.setup_function);
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
				if (This_Setting.var_css) {
					StyleSheet.textContent += `:root{${This_Setting.var_css}: ${value}px}`;
				}
				if (This_Setting.setup_css) {
					StyleSheet.textContent += This_Setting.setup_css;
				}
			}

			if (This_Setting.update_function) {
				Run_Text_Script(This_Setting.update_function);
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Dropdown"]: async function (This_Setting: Partial<Extract<Setting, { type: "Dropdown" }>>) {
		let StyleSheet: HTMLElement;
		StyleSheet = Create_StyleSheet(This_Setting.id);

		if (This_Setting.setup_function) {
			Run_Text_Script(This_Setting.setup_function);
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			if (Settings_Current_State[This_Setting.id] == value) return;
			Set_Variable(This_Setting.id, value);

			//----------------------

			const Old_Dropdown = This_Setting.options[Settings_Current_State[This_Setting.id]];
			Run_Text_Script(Old_Dropdown.disable_function);

			//----------------------

			Settings_Current_State[This_Setting.id] = value;
			const Current_Dropdown = This_Setting.options[value];
			Run_Text_Script(Current_Dropdown.enable_function);

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

		if (This_Setting.setup_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
			console.log(StyleSheet);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script(This_Setting.setup_function);
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
				StyleSheet.textContent += `:root{--${This_Setting.id}: ${value}}`;
				StyleSheet.textContent += This_Setting.setup_css || ``;
				console.log(StyleSheet.textContent);
			}

			//----------------------

			if (This_Setting.update_function) {
				Run_Text_Script(This_Setting.update_function);
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

export async function Update_Setting_Function(id) {
	console.log("Update", id, Settings_Update_Function[id]);
	Settings_Update_Function[id]();
	console.log(Settings_Update_Function[id].toString());
}
