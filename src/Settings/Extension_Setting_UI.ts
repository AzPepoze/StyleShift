import { Get_ALL_Editable_Items, Get_Editable_Items } from "../Items_Editor/Editable_Items";
import { Click_To_Scroll, GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Create_Setting_UI_Element } from "./Settings_UI";

let Setting_Frame: HTMLElement;
let Setting_BG: HTMLElement;

let Update_Setting_Interval;

export async function Create_Extension_Setting() {
	Setting_BG = await Create_Setting_UI_Element("Fill_Screen", false);

	(await GetDocumentBody()).appendChild(Setting_BG);

	Setting_Frame = document.createElement("div");
	Setting_BG.append(Setting_Frame);
	Setting_Frame.className = "STYLESHIFT-Main";

	Setting_Frame.style.width = "60%";
	Setting_Frame.style.height = "80%";
	Setting_Frame.style.minWidth = "600px";
	Setting_Frame.style.minHeight = "250px";
	Setting_Frame.style.resize = "both";
	Setting_Frame.style.overflow = "auto";
	Setting_Frame.style.pointerEvents = "all";

	//-----------------------------------------------

	let TopBar = document.createElement("div");
	TopBar.className = "STYLESHIFT-TopBar";
	Setting_Frame.append(TopBar);

	let Drag_Top = await Create_Setting_UI_Element("Drag", Setting_Frame);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	TopBar.append(Drag_Top);

	let Close = await Create_Setting_UI_Element("Close");
	Close.addEventListener(
		"click",
		function () {
			Remove_Extension_Setting();
		},
		{ once: true }
	);
	TopBar.append(Close);

	// Setting_Frame.append(await Create_Setting_UI_Element("Title", "⚙️ StyleShift Settings ⚙️"));

	//------------------------------------------------

	let Main_Frame = await Create_Setting_UI_Element("Setting_Frame", false, false);
	Setting_Frame.append(Main_Frame);

	let Left_Category_Scrollable = document.createElement("div");
	Left_Category_Scrollable.className = "STYLESHIFT-Scrollable";
	Left_Category_Scrollable.setAttribute("Left", "true");
	Main_Frame.append(Left_Category_Scrollable);

	Left_Category_Scrollable.style.minWidth = "220px";
	Left_Category_Scrollable.style.width = "220px";

	let Category_Scrollable = document.createElement("div");
	Category_Scrollable.className = "STYLESHIFT-Scrollable";
	Main_Frame.append(Category_Scrollable);

	Main_Frame.style.width = "calc(100% - 5px)";
	Main_Frame.style.height = "-webkit-fill-available";
	Main_Frame.style.gap = "10px";
	Main_Frame.style.overflow = "hidden";
	Main_Frame.style.background = "transparent";

	//---------------------------------------------------

	let Left_UI = [];
	let Right_UI = [];

	for (const Selector_Value of await Get_ALL_Editable_Items()) {
		let Category_Title = await Create_Setting_UI_Element("Title", Selector_Value.Category);
		Category_Scrollable.append(Category_Title);

		let Left_Category_Title = await Create_Setting_UI_Element(
			"Left-Title",
			Selector_Value.Category
		);
		Click_To_Scroll(Left_Category_Title, Category_Title);

		Left_UI.push(Left_Category_Title);
		Right_UI.push(Category_Title);

		Left_Category_Scrollable.append(Left_Category_Title);

		if (await Load("Developer_Mode")) {
			let Selector_Frame = await Create_Setting_UI_Element("Setting_Frame", true, true);

			Selector_Frame.append(await Create_Setting_UI_Element("Sub_Title", "Selector"));

			await Create_Setting_UI_Element(
				"Selector_Text_Editor",
				Selector_Frame,
				Selector_Value
			);

			Category_Scrollable.append(Selector_Frame);
		}

		for (const ThisSetting of Selector_Value.Settings) {
			Category_Scrollable.append(
				await Create_Setting_UI_Element(ThisSetting.type, ThisSetting)
			);
		}

		if (await Load("Developer_Mode")) {
			Category_Scrollable.append(
				(await Create_Setting_UI_Element("Add_Setting_Button")).Frame
			);
		}
	}

	let Current_Selected: HTMLElement;

	Update_Setting_Interval = setInterval(async () => {
		const Last_Index = Right_UI.length - 1;
		for (let index = 0; index <= Last_Index; index++) {
			await sleep(50);
			const Category_Scrollable_Box = Category_Scrollable.getBoundingClientRect();
			if (
				index == Last_Index ||
				(Right_UI[index].getBoundingClientRect().top <= Category_Scrollable_Box.top &&
					Right_UI[index + 1].getBoundingClientRect().top >=
						Category_Scrollable_Box.top)
			) {
				if (Current_Selected == Left_UI[index]) {
					return;
				}
				if (Current_Selected) {
					Current_Selected.removeAttribute("Selected");
				}
				Current_Selected = Left_UI[index];
				Current_Selected.setAttribute("Selected", "");
				return;
			}
		}
	}, 50 * Right_UI.length);
}

export function Remove_Extension_Setting() {
	if (Setting_BG) {
		clearInterval(Update_Setting_Interval);
		Setting_BG.remove();
		Setting_BG = null;
		Setting_Frame = null;
	}
}

export async function Toggle_Extension_Setting() {
	if (Setting_Frame) {
		Remove_Extension_Setting();
	} else {
		Create_Extension_Setting();
	}
}

export function Recreate_Extension_Setting() {
	if (Setting_Frame) {
		Remove_Extension_Setting();
		Create_Extension_Setting();
	}
}

export async function Show_Confirm(ask) {
	return new Promise((resolve, reject) => {
		resolve(confirm(ask));
	});
}
