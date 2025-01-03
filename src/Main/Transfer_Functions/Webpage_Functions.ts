// @ts-nocheck

const Build_in_Functions = {
	/*
	-------------------------------------------------------
	For normal user !!!
	-------------------------------------------------------
	*/
	["Set_Value"]: function (id: string, value: any) {
		window["StyleShift"]["Build-in"]["_Variables"][id] = value;
	},

	["Get_Value"]: function (id: string) {
		return window["StyleShift"]["Build-in"]["_Variables"][id];
	},

	/*
	-------------------------------------------------------
	For advanced user !!!
	-------------------------------------------------------
	*/

	Get_StyleShift_Value: async function (id) {
		return JSON.parse(await StyleShift["Build-in"]["_Call_Function"]("_Get_StyleShift_Value", id));
	},

	Save_StyleShift_Value: async function (id, value) {
		return JSON.parse(
			await StyleShift["Build-in"]["_Call_Function"]("_Save_StyleShift_Value", id, JSON.stringify(value))
		);
	},

	Create_StyleShift_Setting: async function (type, This_Setting, ...args) {
		const UI_ID = await StyleShift["Build-in"]["_Call_Function"](
			"_Create_StyleShift_Setting",
			type,
			This_Setting,
			...args
		);

		const UI = await StyleShift["Build-in"]["WaitForElement"](
			`.StyleShift-Station [styleshift-ui-id="${UI_ID}"]`
		);

		console.log("UI", UI);

		UI.removeAttribute("styleshift-ui-id");

		return UI;
	},

	/*
	-------------------------------------------------------
	Danger zone !!!
	-------------------------------------------------------
	*/

	_Variables: {},
	_Call_Function: async function (function_name, ...args) {
		return await StyleShift["Build-in"]["Fire_Function_Event_With_Return"]("StyleShift", function_name, ...args);
	},
};

for (const [Function_name, This_function] of Object.entries(Build_in_Functions)) {
	StyleShift["Build-in"][Function_name] = This_function;
}
