import { Get_Settings_List } from "../Items_Editor/Editable_Items";
import { Load_Any, Save_External } from "../Modules/Save";
import { Create_StyleSheet } from "./Settings_StyleSheet";

let Settings_Current_State = {};
let Settings_Update_Function = {};
var Global_Variables = {};

let Settings_Funcion = {
	["Checkbox"]: async function (id, args) {
		let StyleSheet: HTMLElement;
		if (args.setup_css || args.enable_css || args.disable_css) {
			StyleSheet = Create_StyleSheet(id);
			console.log(StyleSheet);
		}

		if (args.setup_function) {
			setTimeout(args.setup_function, 1);
		}

		async function Update_Function() {
			let value = await Load_Any(id);
			Set_Variable(id, value);

			console.log(id, value);
			if (Settings_Current_State[id] == value) {
				return;
			}

			Settings_Current_State[id] = value;

			if (StyleSheet) {
				StyleSheet.textContent = args.setup_css;
			}

			if (value) {
				if (StyleSheet) {
					StyleSheet.textContent += args.enable_css || ``;
				}
				if (args.enable_function) {
					setTimeout(args.enable_function, 1);
				}
			} else {
				if (StyleSheet) {
					StyleSheet.textContent += args.disable_css || ``;
				}
				if (args.disable_function) {
					setTimeout(args.disable_function, 1);
				}
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Number_Slide"]: async function (id, args) {
		let StyleSheet: HTMLElement;
		if (args.setup_css || args.var_css) {
			StyleSheet = Create_StyleSheet(id);
			console.log(StyleSheet);
		}

		if (args.setup_function) {
			try {
				setTimeout(args.setup_function, 1);
			} catch (error) {}
		}

		async function Update_Function() {
			let value = await Load_Any(id);
			Set_Variable(id, value);

			console.log(id, value);
			if (Settings_Current_State[id] == value) {
				return;
			}

			Settings_Current_State[id] = value;

			if (StyleSheet) {
				StyleSheet.textContent = `
				:root{${args.var_css}: ${value}px}

				${args.setup_css}`;
			}

			if (args.update_function) {
				setTimeout(args.update_function, 1);
			}
		}

		Update_Function();

		return Update_Function;
	},
};

export function Set_Variable(id, value) {
	if (Save_External.includes(id)) return;

	console.log("SET", id, value);
	setTimeout(`${id} = ${value};`, 0);
}

export async function SetUp_Setting_Function(id) {
	console.log("SetUp", id);
	let This_Setting = (await Get_Settings_List())[id];
	console.log(await Get_Settings_List());
	console.log(This_Setting);

	if (!Save_External.includes(id)) {
		setTimeout(`var ${id};`, 0);
	}

	let Update_Function = await Settings_Funcion[This_Setting.type](id, This_Setting);

	Settings_Update_Function[id] = Update_Function;
	console.log(Settings_Update_Function);
	return Update_Function;
}

export async function Update_Setting_Function(id) {
	console.log("Update", id, Settings_Update_Function[id]);
	Settings_Update_Function[id]();
}
