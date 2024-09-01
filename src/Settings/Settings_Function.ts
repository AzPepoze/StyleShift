import { Get_Settings_List } from "../Items_Editor/Editable_Items";
import { Load } from "../Modules/Save";
import { Create_StyleSheet } from "./Settings_StyleSheet";

var Settings_Current_State = {};
var Settings_Update_Function = {};

var Settings_Funcion = {
	["Checkbox"]: async function (id, args) {
		console.log(args);

		// Require StyleSheet
		var StyleSheet: HTMLElement;
		if (args.enable_css || args.disable_css) {
			StyleSheet = Create_StyleSheet(id);
			console.log(StyleSheet);
		}

		if (args.setup_function) {
			console.log("RUN SETUP FUNCTION");
			console.log(args.setup_function);
			try {
				setTimeout(args.setup_function, 1);
			} catch (error) {}
		}

		async function Update_Function() {
			var value = await Load(id);
			console.log(id, value);
			if (Settings_Current_State[id] == value) {
				return;
			}

			Settings_Current_State[id] = value;

			if (value) {
				if (StyleSheet) {
					StyleSheet.textContent = args.enable_css || ``;
				}
				if (args.enable_function) {
					setTimeout(args.enable_function, 1);
					// chrome.runtime.sendMessage({
					// 	Command: "RunScript",
					// 	Script: args.enable_function,
					// });
				}
			} else {
				if (StyleSheet) {
					StyleSheet.textContent = args.disable_css || ``;
				}
				if (args.disable_function) {
					setTimeout(args.disable_function, 1);
					// chrome.runtime.sendMessage({
					// 	Command: "RunScript",
					// 	Script: args.disable_function,
					// });
				}
			}
		}

		Update_Function();

		return Update_Function;
	},
};

export async function SetUp_Setting_Function(id) {
	console.log("SetUp", id);
	var This_Setting = (await Get_Settings_List())[id];
	console.log(await Get_Settings_List());
	console.log(This_Setting);
	var Update_Function = await Settings_Funcion[This_Setting.type](id, This_Setting);
	Settings_Update_Function[id] = Update_Function;
	console.log(Settings_Update_Function);
	return Update_Function;
}

export async function Update_Setting_Function(id) {
	console.log("Update", id, Settings_Update_Function[id]);
	Settings_Update_Function[id]();
}
