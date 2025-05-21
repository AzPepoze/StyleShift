import { Create_Error, Create_Notification } from "../Build-in_Functions/Extension_Functions";
import { sleep } from "../Build-in_Functions/Normal_Functions";
import { In_Setting_Page, isFirefox, Update_All } from "../Run";
import { Create_StyleSheet } from "../Settings/Settings_StyleSheet";
import { color_obj } from "../types/Store_Data";
import { Save_All } from "./Save";

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
					setTimeout(Run_StyleShift_Functions_List, 1);
					return;
				}

				let Get_Functions_List = {};

				for (const [key, value] of Object.entries(window["StyleShift"])) {
					Get_Functions_List[key] = Object.keys(value);
				}

				console.log("Avaliable StyleShift functions", Get_Functions_List);

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
	if (
		(window["StyleShift"] && window["StyleShift"][Mode] == null) ||
		window["StyleShift"][Mode][Function_Name] == null
	) {
		await sleep(0);
		return await Get_Global_Data(Mode, Function_Name);
	} else {
		console.log(window["StyleShift"][Mode], window["StyleShift"][Mode][Function_Name]);
		return window["StyleShift"][Mode][Function_Name];
	}
}

export function Is_Safe_Code(code: string, Code_Name: string) {
	if (!code) return false;
	const LoweredCase_Code = code.toLowerCase();

	const dangerousPatterns = [
		/eval/i,
		/new function/i,
		/(?<!@)\bimport\b/i,
		/require/i,
		/fetch/i,
		/xmlhttprequest/i,
		/xhr/i,
		/<\/?script>/i,
		/document\.createelement\s*\(\s*['"]script['"]\s*\)/i,
		/\.write\s*\(/i,
		/\.execcommand\s*\(/i,
		/\.cookie\s*=/i,
		/localstorage/i,
		/sessionstorage/i,
		/indexeddb/i,
		/opendatabase/i,
		/postmessage/i,
		/sendbeacon/i,
		/importscripts/i,
		/createobjecturl/i,
		/revokeobjecturl/i,
		/webkitrequestfilesystem/i,
		/webkitresolvelocalfilesystemurl/i,
		/showopenfilepicker/i,
		/showsavefilepicker/i,
		/showdirectorypicker/i,
		/new\s+worker\s*\(/i,
		/new\s+sharedworker\s*\(/i,
		/new\s+blob\s*\(/i,
		/url\.createobjecturl\s*\(/i,
		/\.__proto__\s*=/i,
		/\.constructor\s*=/i,
		/javascript:/i,
		/reflect\.(apply|construct|defineproperty|get|set|deleteproperty|ownkeys)/i,
		/globalthis\./i,
		/window\[(["'`"]).*\1\]/i,
		/new\s+eventsource\s*\(/i,
		/webassembly\./i,
		/\.contenteditable\s*=/i,
		/\?callback=/i,
		/new\s+proxy\s*\(/i,
		/function\.prototype\.tostring/i,
		/intl\./i,
		/symbol\./i,
	];

	for (const pattern of dangerousPatterns) {
		if (pattern.test(LoweredCase_Code)) {
			const match = LoweredCase_Code.match(pattern);
			if (match) {
				const matchIndex = match.index;

				const beforeMatch = LoweredCase_Code.slice(0, matchIndex);
				const lineNumber = beforeMatch.split("\n").length;
				const charPosition = matchIndex - beforeMatch.lastIndexOf("\n");

				// Extract the line of code where the match occurred
				const codeLines = LoweredCase_Code.split("\n");
				const errorLine = codeLines[lineNumber - 1];

				// ตรวจสอบว่าคำว่า import อยู่ในคอมเมนต์หรือไม่
				const isComment = errorLine.replaceAll(" ", "").replaceAll("\t", "").startsWith("//");
				if (isComment) {
					continue;
				}

				// Get surrounding context (10 characters before and after the match)
				const startContext = Math.max(0, charPosition - 15);
				const endContext = Math.min(errorLine.length, charPosition + match[0].length + 15);
				const contextSnippet = errorLine.slice(startContext, endContext);

				// Highlight the matched part in red with underline
				const highlightedError = contextSnippet.replace(
					match[0],
					`<span style="color: red; text-decoration: underline;">${match[0]}</span>`
				);

				Create_Notification({
					Icon: "🚫",
					Title: "StyleShift - Error",
					Content: `<b>"${match[0]}"</b> is not allowed.<br>Found at line: <b>${lineNumber}</b>, character: <b>${charPosition}</b><br>From: <b>${Code_Name}</b><br><br><pre>${highlightedError}</pre>`,
					Timeout: 0,
				});

				console.warn(match, pattern);
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
	args = "",
}) {
	// console.log("Trying to run script");
	// console.log(Text);

	if (typeof Text == "function") {
		Text();
	} else {
		if (Text != null && Text != "") {
			//--------------------------------

			if (Replace) {
				if (Is_Safe_Code(Text, Code_Name)) {
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
				} else {
					return;
				}
			}

			//--------------------------------

			if (!In_Setting_Page) {
				chrome.runtime.sendMessage({
					Command: "RunScript",
					Script: Text,
					args: args,
				});
			}
		}
	}
}

export function Run_Text_Script_From_Setting(This_Setting, Function_Name: string = "script") {
	Run_Text_Script({
		Text: This_Setting[Function_Name],
		Code_Name: `${This_Setting.id} : ${Function_Name}`,
		args: JSON.stringify({ Setting_ID: This_Setting.id }),
	});
}

export let Loaded_Developer_Modules = false;
export let Try_Loaded_Developer_Modules = false;

export let Monaco: typeof import("monaco-editor");
export let Monaco_Themes;
export let JSzip: typeof import("jszip");

export async function Load_Developer_Modules() {
	if (Try_Loaded_Developer_Modules || Loaded_Developer_Modules) {
		return;
	}

	Try_Loaded_Developer_Modules = true;

	const Loading_UI = await Create_Notification({
		Icon: "🔃",
		Title: "StyleShift - Loading Developer Modules",
		Content: "Loading...",
		Timeout: -1,
	});

	if (isFirefox) {
		if (!In_Setting_Page) {
			Loading_UI.Set_Icon("⚠️");
			Loading_UI.Set_Title("StyleShift - Can't Load Developer Modules");
			Loading_UI.Set_Content("If you want to use code editor, please consider enter setting page.");
			setTimeout(() => {
				Loading_UI.Close();
			}, 4000);
		}
	} else {
		try {
			Loading_UI.Set_Content("Loading : Monaco editor (Code editor)");

			let Monaco_Data = await (await fetch(chrome.runtime.getURL("External_Modules/Monaco.js"))).text();

			Run_Text_Script({
				Text: Monaco_Data,
				Replace: false,
			});

			//---------------------------------------------------------------------

			Create_StyleSheet("Monaco", true).textContent = await (
				await fetch(chrome.runtime.getURL("External_Modules/Monaco.css"))
			).text();

			//---------------------------------------------------------------------

			Loading_UI.Set_Content("Getting : Monaco editor (Code editor)");
		} catch (error) {
			Loading_UI.Close();
			(await Create_Error(error)).Set_Title("StyleShift - Error loading developer modules");
		}
	}

	if (!In_Setting_Page) {
		try {
			Loading_UI.Set_Content("Loading : JSzip (Export theme as zip)");

			let JSzip_Data = await (await fetch(chrome.runtime.getURL("External_Modules/JSzip.js"))).text();
			Run_Text_Script({
				Text: JSzip_Data,
				Replace: false,
			});
		} catch (error) {
			Loading_UI.Close();
			(await Create_Error(error)).Set_Title("StyleShift - Error loading developer modules");
		}
	}

	if (!isFirefox || In_Setting_Page) {
		try {
			Monaco = await Get_Global_Data("Build-in", "Monaco");
			Monaco_Themes = await Get_Global_Data("Build-in", "Monaco_Themes");

			for (const [Theme_Name, Theme_Content] of Object.entries(Monaco_Themes) as [string, any][]) {
				if (Theme_Name == "themelist") continue;
				// console.log("Themes Name", Theme_Name.replace(/[^a-zA-Z0-9_-]/g, ""));
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

			Loaded_Developer_Modules = true;
		} catch (error) {
			Loading_UI.Close();
			(await Create_Error(error)).Set_Title("StyleShift - Error loading developer modules");
		}
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

	return {
		HEX: `#${rgbHex}`,
		Alpha: Math.round((parseInt(alphaHex, 16) / 255) * 100),
	};
}
