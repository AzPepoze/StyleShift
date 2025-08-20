function sleep(delay) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getNowTab() {
	let queryOptions = { active: true, currentWindow: true };

	try {
		let tabsArray = await chrome.tabs.query(queryOptions);

		if (tabsArray && tabsArray.length > 0) {
			return tabsArray[0];
		}

		queryOptions = { active: true };
		tabsArray = await chrome.tabs.query(queryOptions);

		if (tabsArray && tabsArray.length > 0) {
			return tabsArray[0];
		}

		return null;
	} catch (error) {
		console.error("Failed to get the current active tab:", error);
		return null;
	}
}

chrome.commands.onCommand.addListener(async (command) => {
	console.log(`Command "${command}" triggered`);
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	console.log(command);
	chrome.tabs.sendMessage(tab.id, command);
});

// let Build_in_Functions_Data;

// fetch(chrome.runtime.getURL("Build_in_Functions.js"))
// 	.then((response) => response.text())
// 	.then((data) => {
// 		Build_in_Functions_Data = data;
// 	});

async function Excute_Function(Excute_Text) {
	setTimeout(Excute_Text, 0);
}

chrome.runtime.onMessage.addListener(async (Recived_Message, Sender) => {
	console.log(Recived_Message);

	switch (Recived_Message.Command) {
		case "RunScript":
			// while (!Build_in_Functions_Data) {
			// 	console.log(Build_in_Functions_Data);
			// 	await sleep(10);
			// }

			let pre_code = "";

			if (Recived_Message.args != "") {
				const Recived_args = JSON.parse(Recived_Message.args);

				if (Recived_args) {
					const Setting_ID = Recived_args["Setting_ID"];
					if (Setting_ID) {
						// pre_code += `console.log(StyleShift["Build-in"]["_Call_Function"]());\n`;
						pre_code += `let This_Setting_Frame = document.querySelector(".STYLESHIFT-Window #${Setting_ID}");\n`;
						pre_code += `async function Save_Setting_Value(value){
                                   return await StyleShift["Build-in"]["_Call_Function"]("Save_StyleShift_Value", "${Setting_ID}", value)
                              }\n`;
						pre_code += `async function Load_Setting_Value(){
                                   return await StyleShift["Build-in"]["_Call_Function"]("Load_StyleShift_Value", "${Setting_ID}")
                              }\n`;
					}
					for (const [key, value] of Object.entries(Recived_args)) {
						pre_code += `let ${key} = "${value}";\n`;
					}
				}
			}

			const Excute_Data = `(async () => {${pre_code}\n\n${Recived_Message.Script}})()`;

			const Result = await chrome.scripting.executeScript({
				target: { tabId: Sender.tab.id },
				func: Excute_Function,
				args: [Excute_Data],
			});

			console.log("Excuted Script");
			console.log(Result);
			console.log(Sender);
			console.log(Excute_Data);
			console.log(Recived_Message.Script);

			break;
	}

	console.log("---------------------------------");
});
