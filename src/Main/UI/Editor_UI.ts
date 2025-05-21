import { getElementCenterPosition } from "../Build-in_Functions/Normal_Functions";
import { Category } from "../types/Store_Data";
import { Start_Highlighter } from "./Highlight_UI";
import { Create_Main_Settings_UI } from "./Settings/Settings_UI";

let Edtior_Width = 400;

export let Editor_UI: Awaited<ReturnType<typeof Create_Main_Settings_UI>>;

let Current_Edit_OBJ = {};
let Editor_Updater_ID;

(async () => {
	Editor_UI = await Create_Main_Settings_UI({
		Show_Category_List: false,
		On_Create: function (StyleShift_Window) {
			StyleShift_Window.Window.style.width = Edtior_Width + "px";
			StyleShift_Window.Window.style.minWidth = Edtior_Width + "px";

			let targetElement = Current_Edit_OBJ["Target"];

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

				// Current_Editor_Window.Editor.style.transform = `translate(${Cal_Position}px,0px)`;
				StyleShift_Window.Window.style.left = `${Cal_Position}px`;
			}

			Update_Position();

			Editor_Updater_ID = setInterval(Update_Position, 10);

			StyleShift_Window.Drag_Top.addEventListener("mousedown", () => {
				if (Editor_Updater_ID) {
					clearInterval(Editor_Updater_ID);
				}
			});

			StyleShift_Window.Close.addEventListener("click", () => {
				if (Editor_Updater_ID) {
					clearInterval(Editor_Updater_ID);
				}

				Start_Highlighter();
			});
		},
	});

	//------------------------------

	// if (await Load("Developer_Mode")) {
	// 	Dynamic_Append(
	// 		Scrollable,
	// 		await Create_Setting_UI_Element("Add_Setting_Button", This_Category.Settings)
	// 	);
	// }

	//Once_Element_Remove();
})();

export async function Create_Editor_UI(targetElement, This_Category: Category) {
	Current_Edit_OBJ["Target"] = targetElement;
	Current_Edit_OBJ["Category"] = This_Category;

	Editor_UI.Set_Get_Category(() => [This_Category]);
	Editor_UI.Create_UI();
}

// export function Close_Editor() {
// 	if (Current_Editor_Window) {
// 		Remove_Editor_UI();
// 		Current_Edit_OBJ = {};
// 		Start_Highlighter();
// 	}
// }

// export function Remove_Editor_UI() {
// 	if (Current_Editor_Window) {
// 		clearInterval(Editor_Updater_ID);
// 		Current_Editor_Window.BG_Frame.remove();
// 		Current_Editor_Window = null;
// 	}
// }

// export async function Recreate_Editor_UI() {
// 	if (Current_Editor_Window) {
// 		let Scroll = Scrollable.scrollTop;
// 		Current_Editor_Window.Window.style.animation = "";
// 		let Last_Style = Current_Editor_Window.Window.style.cssText;
// 		Remove_Editor_UI();
// 		await Create_Editor_UI(Current_Edit_OBJ[0], Current_Edit_OBJ[1], true);
// 		Current_Editor_Window.Window.style.cssText = Last_Style;
// 		Scrollable.scrollTo(0, Scroll);
// 	}
// }
