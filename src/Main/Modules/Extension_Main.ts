import { color_obj } from "../Settings/StyleShift_Items";
import { GetDocumentHead, HEX_to_RBGA, sleep } from "./NormalFunction";

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

export async function Run_Text_Script(Text) {
	console.log("Trying to run script");
	console.log(Text);

	setTimeout(Text, 0);

	// Inject_Text_Script(Text);

	// if (Text != null && Text != "") {
	// 	if (!In_Setting_Page) {
	// 		chrome.runtime.sendMessage({
	// 			Command: "RunScript",
	// 			Script: Text,
	// 		});
	// 	}
	// }
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
