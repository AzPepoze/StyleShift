import { GetDocumentHead } from "../Modules/NormalFunction";

var StyleSheet_Holder: HTMLElement;

export async function Create_StyleSheet_Holder() {
	StyleSheet_Holder = document.createElement("fieldset");
	StyleSheet_Holder.id = "STYLESHIFT_StyleSheet_Holder";

	(await GetDocumentHead()).append(StyleSheet_Holder);
}

export function Create_StyleSheet(id) {
	var StyleSheet = document.createElement("style");
	StyleSheet.setAttribute("STYLESHIFT_StyleSheet_id", id);
	StyleSheet_Holder.append(StyleSheet);
	return StyleSheet;
}
