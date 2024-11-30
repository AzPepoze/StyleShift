import { color_obj } from "../Settings/StyleShift_Items";
import { Create_UniqueID, GetDocumentHead, sleep } from "./NormalFunction";

export let Ver = chrome.runtime.getManifest().version;

export let isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

let inIframe;
try {
	inIframe = window.self !== window.top;
} catch (e) {
	inIframe = true;
}

let DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`;
let DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`;

let Extension_Location = chrome.runtime.getURL("");
let Extension_ID = Extension_Location.slice(19, -1);

export let In_Setting_Page;

if (window.location.origin == Get_Extension_Location().slice(0, -1)) {
	In_Setting_Page = true;
} else {
	In_Setting_Page = false;
}

console.log(In_Setting_Page);

export function Get_Extension_ID() {
	return Extension_ID;
}

export function Get_Extension_Location() {
	return Extension_Location;
}

// export async function Get_Global_Data(Mode: "Build-in" | "Custom", Key: string): Promise<any> {
// 	const remote_id = Create_UniqueID(8);
// 	return new Promise((resolve, reject) => {
// 		window.addEventListener(
// 			`StyleShift_Transaction_${Key}_${remote_id}`,
// 			function (event) {
// 				//@ts-ignore
// 				console.log("Recived", remote_id, event.detail);
// 				//@ts-ignore
// 				resolve(event.detail);
// 			},
// 			{ once: true }
// 		);

// 		Run_Text_Script(`
// 			function StyleShift_Run() {
// 				if (
// 					window["StyleShift"] == null ||
// 					window["StyleShift"]["${Mode}"] == null ||
// 					window["StyleShift"]["${Mode}"]["${Key}"] == null
// 				) {
// 					setTimeout(StyleShift_Run, 0);
// 					return;
// 				} else {
// 					let Data = window["StyleShift"]["${Mode}"]["${Key}"];

// 					console.log("Sent", Data);

// 					window.dispatchEvent(
// 						new CustomEvent("StyleShift_Transaction_${Key}_${remote_id}", {
// 							detail: Data,
// 						})
// 					);
// 				}
// 			}
// 			StyleShift_Run();
// 		`);
// 	});
// }

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

		Run_Text_Script(`
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
		`);
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

export async function Run_Text_Script(Text: string | Function, Replace = true) {
	console.log("Trying to run script");
	console.log(Text);

	if (typeof Text == "function") {
		Text();
	} else {
		if (Text != null && Text != "") {
			//--------------------------------

			// console.log("Before :", Text);

			if (Replace) {
				// console.log(StyleShift_Functions_List);
				for (const [Function_Mode, Functions_List] of Object.entries(
					StyleShift_Functions_List
				) as [string, Array<string>][]) {
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
				});
			}
			// } else {
			// setTimeout(`(async () => {${Text}})()`, 0);
			// }
		}
	}
}

export async function Inject_Text_Script(Text: string) {
	console.log("Inject_Text_Script", Text);
	try {
		const script = document.createElement("script");
		script.textContent = Text;
		(await GetDocumentHead()).appendChild(script);
		script.remove();
	} catch (e) {
		await sleep(100);
		Inject_Text_Script(Text);
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