import { Add_Category, Get_ALL_StyleShift_Items } from "../Settings/StyleShift_Items";
import { In_Setting_Page } from "../Modules/Extension_Main";
import { Click_To_Scroll, GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Get_Setting_Page_Only_Items } from "../Setting_Only_Items";
import {
	Create_Inner_UI,
	Create_Setting_UI_Element,
	Create_Setting_UI_Element_With_Able_Developer_Mode,
	Dynamic_Append,
	Setup_Left_Title_Animation,
} from "./Settings_UI";
import { Create_StyleShift_Window } from "./Extension_UI";

let Scroll_Left: HTMLDivElement;
export let Scroll_Right: HTMLDivElement;

let Current_Settings_Window: Awaited<ReturnType<typeof Create_StyleShift_Window>>;

let Update_Setting_Interval;

export async function Create_Extension_Setting(Skip_Animation = false) {
	Current_Settings_Window = await Create_StyleShift_Window(Skip_Animation);
	const Setting_Frame = Current_Settings_Window.Editor;

	Setting_Frame.style.width = "47%";
	Setting_Frame.style.height = "80%";
	Setting_Frame.style.minWidth = "600px";
	Setting_Frame.style.minHeight = "250px";

	if (In_Setting_Page) {
		Setting_Frame.style.width = "100%";
		Setting_Frame.style.height = "100%";
		Setting_Frame.style.resize = "none";
	}

	//------------------------------------------------

	let Main_Frame = await Create_Setting_UI_Element(
		"Setting_Frame",
		false,
		false,
		{ x: false, y: false },
		true
	);
	Main_Frame.style.width = "calc(100% - 5px)";
	Main_Frame.style.height = "-webkit-fill-available";
	Main_Frame.style.gap = "10px";
	Main_Frame.style.overflow = "hidden";
	Setting_Frame.append(Main_Frame);

	//------------------------------------------------

	Scroll_Left = document.createElement("div");
	Scroll_Left.className = "STYLESHIFT-Scrollable";
	Scroll_Left.style.minWidth = "100px";
	Scroll_Left.style.width = "250px";
	Scroll_Left.setAttribute("Left", "true");
	Main_Frame.append(Scroll_Left);

	//------------------------------------------------

	const Right_Frame = await Create_Setting_UI_Element(
		"Setting_Frame",
		false,
		true,
		{ x: false, y: false },
		true
	);
	Right_Frame.style.width = "-webkit-fill-available";
	Right_Frame.style.height = "100%";
	Right_Frame.style.gap = "10px";
	Main_Frame.append(Right_Frame);

	const Search_Input = document.createElement("input");
	Search_Input.className = "STYLESHIFT-Search";
	Search_Input.placeholder = "🔍 Search";
	Right_Frame.append(Search_Input);

	Scroll_Right = document.createElement("div");
	Scroll_Right.className = "STYLESHIFT-Scrollable";
	Right_Frame.append(Scroll_Right);

	//---------------------------------------------------

	Current_Settings_Window.Close.addEventListener(
		"click",
		() => {
			Remove_Extension_Setting();
		},
		{ once: true }
	);

	//---------------------------------------------------

	let Left_UI = [];
	let Right_UI = [];

	for (const Selector_Value of await Get_ALL_StyleShift_Items()) {
		const Category_Frame = await Create_Setting_UI_Element("Setting_Frame", true, true);
		Category_Frame.className += " STYLESHIFT-Category-Frame";
		Scroll_Right.append(Category_Frame);

		let Category_Title = (
			await Create_Setting_UI_Element_With_Able_Developer_Mode(
				Category_Frame,
				Selector_Value
			)
		).Frame;

		let Left_Category_Title = await Create_Setting_UI_Element(
			"Left-Title",
			Selector_Value.Category,
			Skip_Animation
		);

		Click_To_Scroll(Left_Category_Title, Category_Title);

		Left_UI.push(Left_Category_Title);
		Right_UI.push(Category_Title);

		Scroll_Left.append(Left_Category_Title);

		//------------------------------

		await Create_Inner_UI(Category_Frame, Selector_Value);

		//------------------------------

		if (In_Setting_Page) {
			const Get_Setting_Page_Only = Get_Setting_Page_Only_Items().filter(
				(x) => x.Category === Selector_Value.Category
			)[0];

			if (Get_Setting_Page_Only) {
				for (const This_Setting_Only of Get_Setting_Page_Only.Settings) {
					await Create_Setting_UI_Element_With_Able_Developer_Mode(
						Category_Frame,
						This_Setting_Only
					);
				}
			}
		}

		//------------------------------

		if (await Load("Developer_Mode")) {
			Dynamic_Append(
				Category_Frame,
				await Create_Setting_UI_Element("Add_Setting_Button", Selector_Value.Settings)
			);
		}

		await Create_Setting_UI_Element("Space", Scroll_Right);

		//------------------------------------------------------
	}

	let Add_Button = (
		await Create_Setting_UI_Element("Button", {
			name: "+",
			color: "#FFFFFF",
			text_align: "center",
			click_function: function () {
				Add_Category("🥳 New_Category");
			},
		})
	).Button;
	Add_Button.className += " STYLESHIFT-Add-Category-Button";

	Add_Button.style.padding = "5px";
	Add_Button.style.marginInline = "10px";
	Add_Button.style.marginTop = "3px";

	Left_UI.push(Add_Button);
	Scroll_Left.append(Add_Button);

	if (!Skip_Animation) {
		Setup_Left_Title_Animation(Add_Button);
	}

	//------------------------------------------------------

	if (!Skip_Animation) {
		requestAnimationFrame(function () {
			for (let Left_Order = 0; Left_Order < Left_UI.length; Left_Order++) {
				const Left_Category_Title = Left_UI[Left_Order];
				setTimeout(() => {
					Left_Category_Title.style.transform = "";
					Left_Category_Title.style.opacity = "";
				}, 50 * Left_Order);
			}
		});
	}

	//------------------------------------------------------

	let Current_Selected: HTMLElement;

	Update_Setting_Interval = setInterval(async function () {
		const Last_Index = Right_UI.length - 1;

		for (let index = 0; index <= Last_Index; index++) {
			const Scroll_Right_Box = Scroll_Right.getBoundingClientRect();
			if (
				index == Last_Index ||
				(Right_UI[index].getBoundingClientRect().top - 10 <= Scroll_Right_Box.top &&
					Right_UI[index + 1].getBoundingClientRect().top - 10 >=
						Scroll_Right_Box.top) ||
				(index == 0 &&
					Right_UI[index].getBoundingClientRect().top >= Scroll_Right_Box.top)
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

export function Remove_Extension_Setting(Skip_Animation = false) {
	if (Current_Settings_Window) {
		clearInterval(Update_Setting_Interval);
		if (Skip_Animation) {
			Current_Settings_Window.Setting_BG.remove();
		} else {
			Current_Settings_Window.Close.click();
		}
		Current_Settings_Window = null;
	}
}

export async function Toggle_Extension_Setting() {
	if (Current_Settings_Window) {
		Remove_Extension_Setting();
	} else {
		Create_Extension_Setting();
	}
}

export async function Recreate_Extension_Setting() {
	if (Current_Settings_Window) {
		let Last_Scroll = Scroll_Left.scrollTop;
		let Right_Scroll = Scroll_Right.scrollTop;
		Current_Settings_Window.Editor.style.animation = "";
		let Last_Style = Current_Settings_Window.Editor.style.cssText;
		Remove_Extension_Setting(true);
		await Create_Extension_Setting(true);
		Current_Settings_Window.Editor.style.cssText = Last_Style;
		Scroll_Left.scrollTo(0, Last_Scroll);
		Scroll_Right.scrollTo(0, Right_Scroll);
	}
}
