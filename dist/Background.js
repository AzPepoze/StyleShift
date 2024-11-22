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

let Global_Functions_Data;

fetch(chrome.runtime.getURL("Global_Functions.js"))
	.then((response) => response.text())
	.then((data) => {
		Global_Functions_Data = data;
	});

async function Excute_Function(Excute_Text) {
	setTimeout(Excute_Text, 1);
}

chrome.runtime.onMessage.addListener(async (Recived_Message, Sender) => {
	console.log(Recived_Message);

	switch (Recived_Message.Command) {
		case "RunScript":
			while (!Global_Functions_Data) {
				console.log(Global_Functions_Data);
				await sleep(10);
			}

			const Excute_Data = `${Global_Functions_Data}(async () => {${Recived_Message.Script}})()`;

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
