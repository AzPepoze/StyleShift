import { Hide_StyleSheet, Show_StyleSheet } from "../Settings/Settings_StyleSheet";

let Ver = chrome.runtime.getManifest().version;

let isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

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

export function Enable_Extension() {
	Show_StyleSheet();
}

export function Disable_Extension() {
	Hide_StyleSheet();
}
