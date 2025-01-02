import { Create_Notification } from "../Build-in_Functions/Extension_Functions";
import { sleep } from "../Build-in_Functions/Normal_Functions";
import { Update_All } from "../Run";
import { Create_StyleSheet } from "../Settings/Settings_StyleSheet";
import { color_obj } from "../types/Store_Data";
import { Save_All } from "./Save";

export let Ver = chrome.runtime.getManifest().version;

export let isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
console.log("isFirefox", navigator.userAgent.toLowerCase(), isFirefox);

let inIframe;
try {
	inIframe = window.self !== window.top;
} catch (e) {
	inIframe = true;
}

let DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`;
let DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`;

export let Extension_Location = chrome.runtime.getURL("").slice(0, -1);
export let Extension_ID = Extension_Location.slice(19, 0);

export let In_Setting_Page;

if (window.location.origin == Extension_Location) {
	In_Setting_Page = true;
} else {
	In_Setting_Page = false;
}

export async function Save_And_Update_ALL() {
	await Save_All();
	Update_All();
}

let StyleShift_Functions_List = {};

export async function Update_StyleShift_Functions_List() {
	if (In_Setting_Page) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [key, value] of Object.entries(window["StyleShift"])) {
			StyleShift_Functions_List[key] = Object.keys(value);
		}
		return;
	}

	return new Promise((resolve, reject) => {
		window.addEventListener(
			"Sent_StyleShift_Functions_List",
			function (event) {
				console.log("Recived", event);
				//@ts-ignore
				StyleShift_Functions_List = event.detail;
				resolve(true);
			},
			{ once: true }
		);

		Run_Text_Script({
			Text: `
			function Run_StyleShift_Functions_List(){

				if(window["StyleShift"] == null) {
					setTimeout(Run_StyleShift_Functions_List, 0);
					return;
				}

				let Get_Functions_List = {};

				for (const [key, value] of Object.entries(window["StyleShift"])) {
					Get_Functions_List[key] = Object.keys(value);
				}

				console.log("Sent", Get_Functions_List);

				window.dispatchEvent(
					new CustomEvent("Sent_StyleShift_Functions_List", {
						detail: Get_Functions_List,
					})
				);
			}
			
			Run_StyleShift_Functions_List();
		`,
			Replace: false,
		});
	});
}

export async function Get_Global_Data(Mode: "Build-in" | "Custom", Function_Name) {
	console.log(window, window["StyleShift"]);
	if (window["StyleShift"][Mode] == null || window["StyleShift"][Mode][Function_Name] == null) {
		await sleep(0);
		return await Get_Global_Data(Mode, Function_Name);
	} else {
		console.log(window["StyleShift"][Mode], window["StyleShift"][Mode][Function_Name]);
		return window["StyleShift"][Mode][Function_Name];
	}
}

function Is_Safe_Code(code: string, Code_Name: string) {
	const LoweredCase_Code = code.toLowerCase();

	const dangerousPatterns = [
		/\bwindow(?!\.open)/,
		/document/,
		/eval/,
		/Function/,
		/import /,
		/require/,
		/fetch/,
		/XMLHttpRequest/,
		/<\/?script>/i,
		/document\.createElement\s*\(\s*['"]script['"]\s*\)/i,
		/document\.(body|head)\.append\s*\(/i,
		/\.innerHTML\s*=/i,
	];

	for (const pattern of dangerousPatterns) {
		if (pattern.test(LoweredCase_Code)) {
			const match = LoweredCase_Code.match(pattern);
			if (match) {
				const matchIndex = match.index;

				const beforeMatch = LoweredCase_Code.slice(0, matchIndex);
				const lineNumber = beforeMatch.split("\n").length;
				const charPosition = matchIndex - beforeMatch.lastIndexOf("\n");

				Create_Notification({
					Icon: "🚫",
					Title: "StyleShift - Error",
					Content: `<b>"${match[0]}"</b> is not allowed.\nFound at line : <b>${lineNumber}</b> character : <b>${charPosition}</b>\nFrom : <b>${Code_Name}</b>`,
					Timeout: 0,
				});
			}
			return false;
		}
	}

	return true;
}

export async function Run_Text_Script({
	Text = null as string | Function,
	Replace = true,
	Code_Name = "StyleShift",
	args = {},
}) {
	console.log("Trying to run script");
	console.log(Text);

	if (typeof Text == "function") {
		Text();
	} else {
		if (Text != null && Text != "") {
			//--------------------------------

			// console.log("Before :", Text);

			if (Replace && Is_Safe_Code(Text, Code_Name) == true) {
				// console.log(StyleShift_Functions_List);
				for (const [Function_Mode, Functions_List] of Object.entries(StyleShift_Functions_List) as [
					string,
					Array<string>
				][]) {
					for (const Function_Name of Functions_List) {
						Text = Text.replace(
							new RegExp(`\\b${Function_Name}\\b`, "g"),
							`window["StyleShift"]["${Function_Mode}"]["${Function_Name}"]`
						);
					}
				}
			}

			console.log("After :", Text, JSON.stringify(StyleShift_Functions_List));

			//--------------------------------

			// if (Advanced) {
			if (!In_Setting_Page) {
				chrome.runtime.sendMessage({
					Command: "RunScript",
					Script: Text,
					args: args,
				});
			}
			// } else {
			// setTimeout(`(async () => {${Text}})()`, 0);
			// }
		}
	}
}

export function Run_Text_Script_From_Setting(This_Setting, Function_Name: string = "script") {
	Run_Text_Script({
		Text: This_Setting[Function_Name],
		Code_Name: `${This_Setting.id} : ${Function_Name}`,
	});
}

// export async function Inject_Text_Script(Text: string) {
// 	console.log("Inject_Text_Script", Text);
// 	try {
// 		const script = document.createElement("script");
// 		script.textContent = Text;
// 		(await GetDocumentHead()).appendChild(script);
// 		script.remove();
// 	} catch (e) {
// 		await sleep(100);
// 		Inject_Text_Script(Text);
// 	}
// }

export let Loaded_Developer_Modules = false;

export let Monaco: typeof import("monaco-editor");
export let Monaco_Themes;
export let JSzip: typeof import("jszip");

export async function Load_Developer_Modules() {
	if (Loaded_Developer_Modules) {
		return;
	}

	Loaded_Developer_Modules = true;

	if (!isFirefox || In_Setting_Page) {
		const Loading_UI = await Create_Notification({
			Icon: "🔃",
			Title: "StyleShift - Loading Developer Modules",
			Content: "Loading : Monaco editor (Code editor)",
			Timeout: -1,
		});

		//---------------------------------------------------------------------

		let Monaco_Data = await (await fetch(chrome.runtime.getURL("External_Modules/Monaco.js"))).text();

		// if (isFirefox) {
		// 	console.log("StyleShift_Extension_ID", Extension_Location);
		// 	Modules_Data = Modules_Data.replace("StyleShift_Extension_ID", Extension_Location);
		// }

		Run_Text_Script({
			Text: Monaco_Data,
			Replace: false,
		});

		Loading_UI.Set_Content("Loading : JSzip (Export theme as zip)");

		let JSzip_Data = await (await fetch(chrome.runtime.getURL("External_Modules/JSzip.js"))).text();
		Run_Text_Script({
			Text: JSzip_Data,
			Replace: false,
		});

		//---------------------------------------------------------------------

		Create_StyleSheet("Monaco", true).textContent = await (
			await fetch(chrome.runtime.getURL("External_Modules/Monaco.css"))
		).text();

		//---------------------------------------------------------------------

		Loading_UI.Set_Content("Getting : Monaco editor (Code editor)");

		Monaco = await Get_Global_Data("Build-in", "Monaco");
		Monaco_Themes = await Get_Global_Data("Build-in", "Monaco_Themes");

		for (const [Theme_Name, Theme_Content] of Object.entries(Monaco_Themes) as [string, any][]) {
			if (Theme_Name == "themelist") continue;
			console.log("Themes Name", Theme_Name.replace(/[^a-zA-Z0-9_-]/g, ""));
			Monaco.editor.defineTheme(Theme_Name.replace(/[^a-zA-Z0-9]|_|-/g, ""), Theme_Content);
		}

		Monaco.editor.setTheme("Dracula");

		//----------------------------------------------

		Loading_UI.Set_Content("Getting : Jzip (Export theme as zip)");

		JSzip = (await Get_Global_Data("Build-in", "JSzip")).default;

		Loading_UI.Set_Icon("✅");
		Loading_UI.Set_Title("StyleShift - Loaded Developer Modules");
		Loading_UI.Set_Content("");

		setTimeout(() => {
			Loading_UI.Close();
		}, 4000);
	}

	if (isFirefox && !In_Setting_Page) {
	}
}

//----------------------------------------------

export function Color_OBJ_to_HEX({ HEX, Alpha }: color_obj): string {
	const alpha = Math.round((Alpha / 100) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${HEX}${alpha}`;
}

export function HEX_to_Color_OBJ(hex: string): { HEX: string; Alpha: number } {
	const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
	const rgbHex = cleanHex.length === 8 ? cleanHex.slice(0, 6) : cleanHex;
	const alphaHex = cleanHex.length === 8 ? cleanHex.slice(6) : "FF";

	console.log(
		"Test Color",
		alphaHex,
		alphaHex,
		parseInt(alphaHex, 16) / 255,
		Math.round((parseInt(alphaHex, 16) / 255) * 100)
	);

	return {
		HEX: `#${rgbHex}`,
		Alpha: Math.round((parseInt(alphaHex, 16) / 255) * 100),
	};
}
