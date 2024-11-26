import { GetDocumentBody, getElementCenterPosition } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Create_Inner_UI, Create_Setting_UI_Element, Dynamic_Append } from "../Settings/Settings_UI";
import { Start_Highlighter } from "./Highlight_UI";

let Edtior_Width = 400;

let Setting_BG: HTMLDivElement;
let Editor: HTMLDivElement;

let Scrollable: HTMLDivElement;

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

	Editor.append(
		await Create_Setting_UI_Element("Title", Selector_Value.Category, Selector_Value.Rainbow)
	);

	Scrollable = document.createElement("div");
	Scrollable.className = "STYLESHIFT-Scrollable";
	Editor.append(Scrollable);

	//------------------------------

	Create_Inner_UI(Scrollable, Selector_Value);

	//------------------------------

	if (await Load("Developer_Mode")) {
		Dynamic_Append(
			Scrollable,
			await Create_Setting_UI_Element("Add_Setting_Button", Selector_Value.Settings)
		);
	}

	//When_Element_Remove();
}

export function Close_Editor() {
	if (Setting_BG) {
		Remove_Editor_UI();
		Current_Edit_OBJ = {};
		Start_Highlighter();
	}
}

export function Remove_Editor_UI() {
	if (Setting_BG) {
		clearInterval(Editor_Updater_ID);
		Setting_BG.remove();
		Setting_BG = null;
		Editor = null;
		Scrollable = null;
	}
}

export async function Recreate_Editor_UI() {
	if (Setting_BG) {
		let Scroll = Scrollable.scrollTop;
		let Last_Style = Editor.style.cssText;
		Remove_Editor_UI();
		await Create_Editor_UI(Current_Edit_OBJ[0], Current_Edit_OBJ[1]);
		Editor.style.cssText = Last_Style;
		Scrollable.scrollTo(0, Scroll);
	}
}
