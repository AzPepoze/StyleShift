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
	_Variables: {},
	_Call_Function: async function (function_name, ...args) {
		return await StyleShift["Build-in"]["Fire_Function_Event_With_Return"]("StyleShift", function_name, ...args);
	},
};

for (const [Function_name, This_function] of Object.entries(Build_in_Functions)) {
	StyleShift["Build-in"][Function_name] = This_function;
}
