import { Get_ALL_Editable_Items, Get_Editable_Items } from "../Items_Editor/Editable_Items";
import { Click_To_Scroll, GetDocumentBody } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Create_Setting_UI_Element } from "./Settings_UI";

var Setting_Frame: HTMLElement;
var Setting_BG: HTMLElement;

export async function Show_Extension_Setting() {
	Setting_BG = document.createElement("div");
	Setting_BG.className = "STYLESHIFT-FillScreen";
	(await GetDocumentBody()).appendChild(Setting_BG);

	Setting_Frame = document.createElement("div");
	Setting_BG.append(Setting_Frame);
	Setting_Frame.className = "STYLESHIFT-Main";

	Setting_Frame.style.width = "80%";
	Setting_Frame.style.height = "80%";

	//-----------------------------------------------

	var TopBar = document.createElement("div");
	TopBar.className = "STYLESHIFT-TopBar";
	Setting_Frame.append(TopBar);

	var Drag_Top = await Create_Setting_UI_Element("Drag", Setting_Frame);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	TopBar.append(Drag_Top);

	var Close = await Create_Setting_UI_Element("Close");
	Close.addEventListener(
		"click",
		function () {
			Hide_Extension_Setting();
		},
		{ once: true }
	);
	TopBar.append(Close);

	Setting_Frame.append(await Create_Setting_UI_Element("Title", "⚙️ StyleShift Settings ⚙️"));

	//------------------------------------------------

	var Main_Frame = await Create_Setting_UI_Element("Setting_Frame", true, false);
	Setting_Frame.append(Main_Frame);

	var Category_Scrollable = document.createElement("div");
	Category_Scrollable.className = "STYLESHIFT-Scrollable";
	Main_Frame.append(Category_Scrollable);

	Category_Scrollable.style.width = "300px";

	var Main_Scrollable_Frame = document.createElement("div");
	Main_Scrollable_Frame.className = "STYLESHIFT-Scrollable";
	Main_Frame.append(Main_Scrollable_Frame);

	Main_Frame.style.width = "calc(100% - 20px)";
	Main_Frame.style.height = "100%";

	//---------------------------------------------------

	for (const Selector_Value of await Get_ALL_Editable_Items()) {
		var Category_Title = await Create_Setting_UI_Element("Title", Selector_Value.Category);
		Main_Scrollable_Frame.append(Category_Title);

		var Left_Category_Title = await Create_Setting_UI_Element(
			"Title",
			Selector_Value.Category
		);
		Click_To_Scroll(Left_Category_Title, Category_Title);

		Category_Scrollable.append(Left_Category_Title);

		if (await Load("Developer_Mode")) {
			var Selector_Frame = await Create_Setting_UI_Element("Setting_Frame", true, true);

			Selector_Frame.append(await Create_Setting_UI_Element("Sub_Title", "Selector"));

			console.log(Selector_Value.Selector);

			var Selector_Text_Editor = await Create_Setting_UI_Element(
				"Text_Editor",
				Selector_Value,
				"Selector"
			);
			Selector_Text_Editor.Text_Editor.className += " STYLESHIFT-Selector-Text-Editor";
			Selector_Frame.append(Selector_Text_Editor.Text_Editor);

			Main_Scrollable_Frame.append(Selector_Frame);
		}

		for (const ThisSetting of Selector_Value.Settings) {
			Main_Scrollable_Frame.append(
				await Create_Setting_UI_Element(ThisSetting.type, ThisSetting)
			);
		}
	}
}

export function Hide_Extension_Setting() {
	if (Setting_BG) {
		Setting_BG.remove();
		Setting_BG = null;
		Setting_Frame = null;
	}
}

export async function Toggle_Extension_Setting() {
	if (Setting_Frame) {
		Hide_Extension_Setting();
	} else {
		Show_Extension_Setting();
	}
}

export async function Show_Confirm(ask) {
	return new Promise((resolve, reject) => {
		resolve(confirm(ask));
	});
}
