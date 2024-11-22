import { color_obj } from "../Items_Editor/StyleShift_Items";
import { sleep } from "./NormalFunction";

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

let in_Setting_Page;

if (window.location.href.includes("Newtube_setting")) {
	document.title = "NewTube Setting";
	in_Setting_Page = true;
} else {
	in_Setting_Page = false;
}

export function Get_Extension_ID() {
	return Extension_ID;
}

export function Get_Extension_Location() {
	return Extension_Location;
}

export async function Run_Text_Script(Text) {
	console.log("Trying to run script");
	console.log(Text);

	if (Text != null && Text != "") {
		chrome.runtime.sendMessage({
			Command: "RunScript",
			Script: Text,
		});
	}
}

//----------------------------------------------

export function Color_OBJ_to_HEX({ RGB, Alpha }: color_obj): string {
	const { r, g, b } = RGB;

	// ตรวจสอบให้แน่ใจว่าค่าอยู่ในช่วง 0-255
	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

	// แปลง RGB เป็น HEX
	const toHex = (value: number) => clamp(value, 0, 255).toString(16).padStart(2, "0");

	const hexR = toHex(r);
	const hexG = toHex(g);
	const hexB = toHex(b);

	// แปลง Alpha (0-1) เป็น HEX (00-FF)
	const alphaHex = toHex(Math.round(clamp(Alpha, 0, 1) * 255));

	return `#${hexR}${hexG}${hexB}${alphaHex}`;
}

export function RGB_to_Color_OBJ(r, g, b, Alpha = 1.0) {
	return {
		RGB: { r, g, b },
		Alpha,
	};
}

export function Color_OBJ_to_Usable_OBJ(Color_OBJ: color_obj) {
	const { r, g, b } = Color_OBJ.RGB;
	const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
	return {
		HEX: hex,
		Alpha: Color_OBJ.Alpha,
	};
}
