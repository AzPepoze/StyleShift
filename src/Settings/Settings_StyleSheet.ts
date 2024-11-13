import { GetDocumentHead, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";

let StyleSheet_Holder: HTMLElement;

export async function Create_StyleSheet_Holder() {
	StyleSheet_Holder = document.createElement("fieldset");
	StyleSheet_Holder.id = "STYLESHIFT_StyleSheet_Holder";

	if ((await Load("Enable_Extension")) == true) {
		Show_StyleSheet();
	} else {
		Hide_StyleSheet();
	}
}

export function Create_StyleSheet(id) {
	let StyleSheet = document.createElement("style");
	StyleSheet.setAttribute("STYLESHIFT_StyleSheet_id", id);
	StyleSheet_Holder.append(StyleSheet);
	return StyleSheet;
}

export async function Show_StyleSheet() {
	(await GetDocumentHead()).append(StyleSheet_Holder);
}

export async function Hide_StyleSheet() {
	if (StyleSheet_Holder) {
		StyleSheet_Holder.remove();
	} else {
		await sleep(10);
	}
}
