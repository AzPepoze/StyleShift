// @ts-nocheck

StyleShift["_Call_Function"] = function (function_name, ...args) {
	const remote_id = Create_UniqueID(10);

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
};
