import { Get_ALL_StyleShift_Items } from "../Items_Editor/StyleShift_Items";
import { In_Setting_Page } from "../Modules/Extension_Main";
import { Click_To_Scroll, GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Get_Setting_Page_Only_Items } from "../Setting_Only_Items";
import { Create_Setting_UI_Element, Dynamic_Append } from "./Settings_UI";

let Setting_Frame: HTMLElement;
let Setting_BG: HTMLElement;

let Scroll_Left: HTMLDivElement;
let Scroll_Right: HTMLDivElement;

let Skip_Animation = false;

let Update_Setting_Interval;

export async function Create_Extension_Setting() {
	Setting_BG = await Create_Setting_UI_Element("Fill_Screen", false);

	(await GetDocumentBody()).appendChild(Setting_BG);

	Setting_Frame = document.createElement("div");
	Setting_BG.append(Setting_Frame);
	Setting_Frame.className = "STYLESHIFT-Main";

	Setting_Frame.style.width = "50%";
	Setting_Frame.style.height = "80%";
	Setting_Frame.style.minWidth = "600px";
	Setting_Frame.style.minHeight = "250px";
	Setting_Frame.style.resize = "both";
	Setting_Frame.style.overflow = "auto";
	Setting_Frame.style.pointerEvents = "all";

	if (In_Setting_Page) {
		Setting_Frame.style.width = "100%";
		Setting_Frame.style.height = "100%";
		Setting_Frame.style.resize = "none";
	}

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

	Scroll_Left = document.createElement("div");
	Scroll_Left.className = "STYLESHIFT-Scrollable";
	Scroll_Left.setAttribute("Left", "true");
	Main_Frame.append(Scroll_Left);

	Scroll_Left.style.minWidth = "220px";
	Scroll_Left.style.width = "220px";

	Scroll_Right = document.createElement("div");
	Scroll_Right.className = "STYLESHIFT-Scrollable";
	Main_Frame.append(Scroll_Right);

	Main_Frame.style.width = "calc(100% - 5px)";
	Main_Frame.style.height = "-webkit-fill-available";
	Main_Frame.style.gap = "10px";
	Main_Frame.style.overflow = "hidden";
	Main_Frame.style.background = "transparent";

	//---------------------------------------------------

	let Left_UI = [];
	let Right_UI = [];

	for (const Selector_Value of await Get_ALL_StyleShift_Items()) {
		let Category_Title = await Create_Setting_UI_Element(
			"Title",
			Selector_Value.Category,
			Selector_Value.Rainbow
		);
		Scroll_Right.append(Category_Title);

		let Left_Category_Title = await Create_Setting_UI_Element(
			"Left-Title",
			Selector_Value.Category,
			Skip_Animation
		);
		Click_To_Scroll(Left_Category_Title, Category_Title);

		Left_UI.push(Left_Category_Title);
		Right_UI.push(Category_Title);

		Scroll_Left.append(Left_Category_Title);

		if (await Load("Developer_Mode")) {
			let Selector_Frame = await Create_Setting_UI_Element("Setting_Frame", true, true);

			Selector_Frame.append(await Create_Setting_UI_Element("Sub_Title", "Selector"));

			await Create_Setting_UI_Element(
				"Selector_Text_Editor",
				Selector_Frame,
				Selector_Value
			);

			Scroll_Right.append(Selector_Frame);
		}

		for (const ThisSetting of Selector_Value.Settings) {
			Dynamic_Append(
				Scroll_Right,
				await Create_Setting_UI_Element(ThisSetting.type, ThisSetting as any)
			);
		}

		//------------------------------

		if (In_Setting_Page) {
			const Get_Setting_Page_Only = Get_Setting_Page_Only_Items().filter(
				(x) => x.Category === Selector_Value.Category
			)[0];

			if (Get_Setting_Page_Only) {
				for (const This_Setting_Only of Get_Setting_Page_Only.Settings) {
					Dynamic_Append(
						Scroll_Right,
						await Create_Setting_UI_Element(
							This_Setting_Only.type,
							This_Setting_Only as any
						)
					);
				}
			}
		}

		//------------------------------

		if (await Load("Developer_Mode")) {
			Dynamic_Append(
				Scroll_Right,
				await Create_Setting_UI_Element("Add_Setting_Button", Selector_Value.Settings)
			);
		}

		await Create_Setting_UI_Element("Space", Scroll_Right);

		//------------------------------------------------------
	}

	if (!Skip_Animation) {
		requestAnimationFrame(function () {
			for (let Left_Order = 0; Left_Order < Left_UI.length; Left_Order++) {
				const Left_Category_Title = Left_UI[Left_Order];
				setTimeout(() => {
					Left_Category_Title.style.transform = "";
					Left_Category_Title.style.opacity = "1";
				}, 50 * Left_Order);
			}
		});
	}

	let Current_Selected: HTMLElement;

	Update_Setting_Interval = setInterval(async function () {
		const Last_Index = Right_UI.length - 1;

		for (let index = 0; index <= Last_Index; index++) {
			const Scroll_Right_Box = Scroll_Right.getBoundingClientRect();
			if (
				index == Last_Index ||
				(Right_UI[index].getBoundingClientRect().top - 10 <= Scroll_Right_Box.top &&
					Right_UI[index + 1].getBoundingClientRect().top - 10 >=
						Scroll_Right_Box.top)
			) {
				if (Current_Selected == Left_UI[index]) {
					break;
				}
				if (Current_Selected) {
					Current_Selected.removeAttribute("Selected");
				}
				Current_Selected = Left_UI[index];
				Current_Selected.setAttribute("Selected", "");
				break;
			}
		}
	}, 100);
}

export function Remove_Extension_Setting() {
	if (Setting_BG) {
		clearInterval(Update_Setting_Interval);
		Setting_BG.remove();
		Setting_BG = null;
		Setting_Frame = null;
		Scroll_Left = null;
		Scroll_Right = null;
	}
}

export async function Toggle_Extension_Setting() {
	if (Setting_BG) {
		Remove_Extension_Setting();
	} else {
		Create_Extension_Setting();
	}
}

export async function Recreate_Extension_Setting() {
	if (Setting_BG) {
		let Last_Scroll = Scroll_Left.scrollTop;
		let Right_Scroll = Scroll_Right.scrollTop;
		let Last_Style = Setting_Frame.style.cssText;
		Remove_Extension_Setting();
		Skip_Animation = true;
		await Create_Extension_Setting();
		Skip_Animation = false;
		Setting_Frame.style.cssText = Last_Style;
		Scroll_Left.scrollTo(0, Last_Scroll);
		Scroll_Right.scrollTo(0, Right_Scroll);
	}
}

export async function Show_Confirm(ask) {
	return new Promise((resolve, reject) => {
		resolve(confirm(ask));
	});
}
