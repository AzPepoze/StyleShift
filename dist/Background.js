async function getNowtab() {
	let queryOptions = { active: true };
	let tabsArray = await chrome.tabs.query(queryOptions);

	return tabsArray[0];
}

chrome.commands.onCommand.addListener(async (command) => {
	console.log(`Command "${command}" triggered`);
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	console.log(command);
	chrome.tabs.sendMessage(tab.id, command);
});

// chrome.runtime.onMessage.addListener(async (Message_OBJ) => {
// 	console.log(Message_OBJ);

// 	if (Message_OBJ.Command == "RunScript") {
// 		var NowTab = await getNowtab();

// 		chrome.scripting.executeScript({
// 			target: { tabId: NowTab.id },
// 			func: function (Message_OBJ) {
// 				setTimeout(Message_OBJ.Script, 0);
// 			},
// 		});
// 		return;
// 	}
// });
