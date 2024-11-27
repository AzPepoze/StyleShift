import { getElementCenterPosition } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Create_Inner_UI, Create_Setting_UI_Element, Dynamic_Append } from "./Settings_UI";
import { Start_Highlighter } from "./Highlight_UI";
import { Create_StyleShift_Window } from "./Extension_UI";

let Edtior_Width = 400;

let Current_Editor_Window: Awaited<ReturnType<typeof Create_StyleShift_Window>>;

let Scrollable: HTMLDivElement;

let Current_Edit_OBJ = {};
let Editor_Updater_ID;

export async function Create_Editor_UI(targetElement, Selector_Value, Skip_Animation = false) {
	Current_Editor_Window = await Create_StyleShift_Window(Skip_Animation);
	Current_Editor_Window.Editor.style.width = Edtior_Width + "px";

	Current_Edit_OBJ[0] = targetElement;
	Current_Edit_OBJ[1] = Selector_Value;

	Current_Editor_Window.Drag_Top.addEventListener("mousedown", function () {
		clearInterval(Editor_Updater_ID);
	});

	Current_Editor_Window.Close.addEventListener(
		"click",
		function () {
			Close_Editor();
		},
		{ once: true }
	);

	function Update_Position() {
		const targetElement_Center_Position = getElementCenterPosition(targetElement);
		let Cal_Position;

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
		Current_Editor_Window.Editor.style.left = `${Cal_Position}px`;
	}
	Update_Position();

	Editor_Updater_ID = setInterval(Update_Position, 10);

	//------------------------------

	Scrollable = document.createElement("div");
	Scrollable.className = "STYLESHIFT-Scrollable";
	Current_Editor_Window.Editor.append(Scrollable);

	await Create_Inner_UI(Scrollable, Selector_Value);

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
	if (Current_Editor_Window) {
		Remove_Editor_UI();
		Current_Edit_OBJ = {};
		Start_Highlighter();
	}
}

export function Remove_Editor_UI() {
	if (Current_Editor_Window) {
		clearInterval(Editor_Updater_ID);
		Current_Editor_Window.Setting_BG.remove();
		Current_Editor_Window = null;
	}
}

export async function Recreate_Editor_UI() {
	if (Current_Editor_Window) {
		let Scroll = Scrollable.scrollTop;
		Current_Editor_Window.Editor.style.animation = "";
		let Last_Style = Current_Editor_Window.Editor.style.cssText;
		Remove_Editor_UI();
		await Create_Editor_UI(Current_Edit_OBJ[0], Current_Edit_OBJ[1], true);
		Current_Editor_Window.Editor.style.cssText = Last_Style;
		Scrollable.scrollTo(0, Scroll);
	}
}
