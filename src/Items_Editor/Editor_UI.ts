import { GetDocumentBody, getElementCenterPosition } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";

import { Create_Setting_UI_Element } from "../Settings/Settings_UI";
import { Start_Highlighter } from "./Editor";

let Edtior_Width = 400;

let Setting_BG: HTMLElement;
let Editor: HTMLElement;

let Current_Edit_OBJ = {};
let Editor_Updater_ID;

export async function Create_Editor_UI(targetElement, Selector_Value) {
	Setting_BG = await Create_Setting_UI_Element("Fill_Screen", false);

	(await GetDocumentBody()).appendChild(Setting_BG);

	Current_Edit_OBJ[0] = targetElement;
	Current_Edit_OBJ[1] = Selector_Value;

	console.log(Selector_Value);

	let targetElement_Center_Position, Cal_Position;

	Editor = document.createElement("div");
	Editor.className = "STYLESHIFT-Main STYLESHIFT-Editor";

	Editor.style.width = `${Edtior_Width}px`;
	Editor.style.pointerEvents = "all";

	function Update_Position() {
		targetElement_Center_Position = getElementCenterPosition(targetElement);

		if (targetElement_Center_Position.x < window.innerWidth / 2) {
			//console.log("Left");
			Cal_Position = targetElement.getBoundingClientRect().right + 10;
		} else {
			//console.log("Right");
			Cal_Position = targetElement.getBoundingClientRect().left - Edtior_Width - 20 - 10;
		}

		if (Cal_Position + Edtior_Width > window.innerWidth) {
			Cal_Position = window.innerWidth - Edtior_Width - 20 - 20;
		}

		// Editor.style.transform = `translate(${Cal_Position}px,0px)`;
		Editor.style.left = `${Cal_Position}px`;
	}
	Update_Position();

	Editor_Updater_ID = setInterval(Update_Position, 10);

	Setting_BG.appendChild(Editor);

	// Object in Editor

	let TopBar = document.createElement("div");
	TopBar.className = "STYLESHIFT-TopBar";
	Editor.append(TopBar);

	let Drag_Top = await Create_Setting_UI_Element("Drag", Editor);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	Drag_Top.addEventListener("mousedown", function () {
		clearInterval(Editor_Updater_ID);
	});
	TopBar.append(Drag_Top);

	let Close = await Create_Setting_UI_Element("Close");
	Close.addEventListener(
		"click",
		function () {
			Close_Editor();
		},
		{ once: true }
	);
	TopBar.append(Close);

	Editor.append(await Create_Setting_UI_Element("Title", Selector_Value.Category));

	let Scrollable = document.createElement("div");
	Scrollable.className = "STYLESHIFT-Scrollable";
	Editor.append(Scrollable);

	if (await Load("Developer_Mode")) {
		let Selector_Frame = await Create_Setting_UI_Element("Setting_Frame", true, true);

		Selector_Frame.append(await Create_Setting_UI_Element("Sub_Title", "Selector"));

		await Create_Setting_UI_Element("Selector_Text_Editor", Selector_Frame, Selector_Value);

		Scrollable.append(Selector_Frame);
	}

	for (const ThisSetting of Selector_Value.Settings) {
		Scrollable.append(await Create_Setting_UI_Element(ThisSetting.type, ThisSetting));
	}

	if (await Load("Developer_Mode")) {
		Scrollable.append((await Create_Setting_UI_Element("Add_Setting_Button")).Frame);
	}

	//When_Element_Remove();
}

export function Close_Editor() {
	if (Editor) {
		Remove_Editor_UI();
		Current_Edit_OBJ = {};
		Start_Highlighter();
	}
}

export function Remove_Editor_UI() {
	if (Editor) {
		clearInterval(Editor_Updater_ID);
		Setting_BG.remove();
		Setting_BG = null;
		Editor = null;
	}
}

export function Recreate_Editor_UI() {
	if (Editor) {
		Remove_Editor_UI();
		Create_Editor_UI(Current_Edit_OBJ[0], Current_Edit_OBJ[1]);
	}
}
