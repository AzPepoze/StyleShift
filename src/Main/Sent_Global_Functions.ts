// @ts-nocheck

const Build_in_Functions = {
	/*-------------------------------------------------------*/
	/*For normal user !!!*/
	/*-------------------------------------------------------*/
	["Set_Value"]: function (id: string, value: any) {
		window["StyleShift"]["Build-in"]["_Variables"][id] = value;
	},

	["Get_Value"]: function (id: string) {
		return window["StyleShift"]["Build-in"]["_Variables"][id];
	},

	/*-------------------------------------------------------*/
	/*For advanced user !!!*/
	/*-------------------------------------------------------*/
	_Variables: {},
	_Call_Function: function (function_name, ...args) {
		const remote_id = StyleShift["Build-in"]["Create_UniqueID"](10);

		const Sent_Event = new CustomEvent(`StyleShift_${function_name}`, {
			detail: { remote_id: remote_id, data: args },
		});

		console.log("Sent", Sent_Event);

		window.dispatchEvent(Sent_Event);

		return new Promise((resolve, reject) => {
			window.addEventListener(
				`StyleShift_${remote_id}`,
				function (event) {
					//@ts-ignore
					console.log("Return Data", `StyleShift_${remote_id}`, event.detail);
					//@ts-ignore
					resolve(event.detail);
				},
				{ once: true }
			);
		});
	},
};

for (const [Function_name, This_function] of Object.entries(Build_in_Functions)) {
	StyleShift["Build-in"][Function_name] = This_function;
}
