import { Create_Error } from "./Build-in_Functions/Extension_Functions";
import { GetDocumentBody, ReArrange_Selector } from "./Build-in_Functions/Normal_Functions";
import { In_Setting_Page, Run_Text_Script, Update_StyleShift_Functions_List } from "./Core/Core_Function";
import { Clear_Unnessary_Save, Load, Load_ThisWeb_Save, Save, Save_All } from "./Core/Save";
import { SetUp_Setting_Function } from "./Settings/Settings_Function";
import { Create_StyleSheet_Holder } from "./Settings/Settings_StyleSheet";
import {
	Get_ALL_StyleShift_Items,
	Get_ALL_StyleShift_Settings,
	Update_StyleShift_Items,
} from "./Settings/StyleShift_Items";
import * as Global from "./Transfer_Functions/Extension_Functions_Loader";
import { Category } from "./types/Store_Data";
import { Extension_Settings_UI } from "./UI/Extension_Setting_UI";
import { Update_All_UI } from "./UI/Extension_UI";
import { Toggle_Customize } from "./UI/Highlight_UI";

console.log(Global);

let Test_Editable_Items: Category[] = [
	{
		Category: "↕️ Import / Export Theme",
		Settings: [
			{
				click_function:
					'await Copy_to_clipboard(await Export_StyleShift_JSON_Text());\n\nCreate_Notification({\nIcon : "✅",\nTitle : "StyleShift",\nContent : "Copied to clipboard!"\n})',
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Export "StyleShift Data" (Clipboard)',
				text_align: "center",
				type: "Button",
			},
			{
				click_function: `const Data = await Enter_Text_Prompt({ Title : 'Import_StyleShift Data', Placeholder : 'Paste StyleShift data text here.'});
                    await Import_StyleShift_JSON_Text(Data);
                    `,
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Import "StyleShift Data"',
				text_align: "center",
				type: "Button",
			},
		],
	},
];

export let StyleShift_Station: HTMLElement = document.createElement("div");
StyleShift_Station.className = "StyleShift-Station";
StyleShift_Station.style.display = "none";

export function Update_All() {
	Update_StyleShift_Functions_List();
	Update_StyleShift_Items();
	Update_All_UI();
}

async function Main_Run() {
	setTimeout(async () => {
		(await GetDocumentBody()).append(StyleShift_Station);
	}, 1);

	if (!In_Setting_Page) {
		let Build_in_Functions = await (await fetch(chrome.runtime.getURL("Build_in_Functions.js"))).text();

		Run_Text_Script({
			Text: Build_in_Functions,
			Replace: false,
		});
	}

	//------------------------------------------

	// await ClearSave();
	// console.log("Loading");
	await Load_ThisWeb_Save();
	// console.log("Listing Functions");
	await Update_StyleShift_Functions_List();

	// console.log("Set Defult Items");
	// await Save("Custom_StyleShift_Items", Test_Editable_Items);
	await Create_StyleSheet_Holder();
	await Update_StyleShift_Items();
	// await Set_Null_Save();
	// console.log("Settings_List", await Get_Settings_List());
	// console.log("Settings_List_Text", JSON.stringify(await Get_Settings_List(), null, 2));

	//------------------------------------------

	for (const This_Setting of await Get_ALL_StyleShift_Settings()) {
		if (This_Setting.id == "Themes") {
			continue;
		}
		SetUp_Setting_Function(This_Setting);
	}

	await Clear_Unnessary_Save();
	for (const This_Category of Get_ALL_StyleShift_Items()) {
		if (This_Category.Selector == null) continue;
		This_Category.Selector = ReArrange_Selector(This_Category.Selector);
		// console.log("ReArranged", This_Category.Selector);
	}
	await Save_All();

	// console.log("Last Saved Data", await Load(null));

	// setTimeout(() => {
	// 	console.log("Window Variable", window);
	// }, 1);
	// Run_Text_Script({ Text: `console.log("Window Variable 2", window);`, Replace: false });

	if (In_Setting_Page) {
		Extension_Settings_UI.Create_UI();
	}
}

try {
	Main_Run();
} catch (error) {
	Create_Error(error).then((Notification) => {
		Notification.Set_Title("StyleShift - Main run error");
	});
}

chrome.runtime.onMessage.addListener(async function (message) {
	try {
		if (message == "Developer") {
			await Save("Developer_Mode", !(await Load("Developer_Mode")));
			Update_All_UI();
		}

		//----------------------------------------------

		if (In_Setting_Page) return;

		//----------------------------------------------

		if (message == "Customize") {
			Toggle_Customize();
		}

		if (message == "Setting") {
			Extension_Settings_UI.Toggle();
		}
	} catch (error) {
		Create_Error(error);
	}
});
