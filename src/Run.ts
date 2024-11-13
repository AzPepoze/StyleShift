import {
	Get_ALL_Editable_Items,
	Get_Settings_List,
	Update_Editable_Items,
} from "./Items_Editor/Editable_Items";
import { Toggle_Customize } from "./Items_Editor/Editor";
import { Recreate_Editor_UI } from "./Items_Editor/Editor_UI";
import { Disable_Extension, Enable_Extension } from "./Modules/ExtensionVariable";
import { ReArrange_Selector } from "./Modules/NormalFunction";
import {
	Clear_Unnessary_Save,
	Load,
	Load_ThisWeb_Save,
	Save,
	Save_All,
	Set_Null_Save
} from "./Modules/Save";
import {
	Recreate_Extension_Setting,
	Toggle_Extension_Setting,
} from "./Settings/Extension_Setting_UI";
import { SetUp_Setting_Function } from "./Settings/Settings_Function";
import {
	Create_StyleSheet_Holder
} from "./Settings/Settings_StyleSheet";

console.log("Test");
console.log(window.location.href);

let temp = 0;
if (1 == temp) {
	Enable_Extension();
	Disable_Extension();
}

let STORE_FUNCTION_PRESET = [
	{
		type: "Button",
		id: "TestButton",
		name: "none",
		description: "bruh man",
	},
	{
		type: "Checkbox",
		id: "TestCheckbox",
		name: "none",
		description: "bruh man",

		value: false,

		setup_css: ``,
		enable_css: ``,
		disable_css: ``,

		setup_function: ``,
		enable_function: ``,
		disable_function: ``,
	},
	{
		type: "Number_Slide",
		id: "PlayerEdge",
		name: "Round edges amount",
		description: "bruh man",

		min: 0,
		max: 100,
		step: 1,
		value: 20,

		var_css: "--player-edge",
		setup_css: ``,

		setup_function: ``,
		update_function: ``,
	},
];

let Test_Editable_Items = [
	{
		Category: "⚙️ Extention's settings",

		Settings: [
			{
				type: "Checkbox",
				id: "Enable_Extension",
				name: "Enable",
				value: true,
				enable_function: `
				Enable_Extension()
				`,
				disable_function: `
				Disable_Extension()
				`,
			},
		],
	},
	{
		Category: "📺 Video",
		Selector: ".html5-video-player",

		Settings: [
			{
				type: "Number_Slide",
				id: "PlayerEdge",
				name: "Round edges amount",
				value: 20,
				var_css: "--player-edge",
				setup_css: `video{
					border-radius: var(--player-edge) !important;
				}`,
			},
			{
				type: "Checkbox",
				id: "TestCheckbox",
				name: "none",
				description: "bruh man",
				value: false,
				enable_css: `video{
					display: none !important;
				}`,
			},
		],
	},
	{
		Category: "📰 Thumbnail",
		Selector:
			"ytd-watch-next-secondary-results-renderer #contents > .ytd-item-section-renderer:not(ytd-reel-shelf-renderer), ytd-rich-grid-renderer #contents > .ytd-rich-grid-renderer:(ytd-rich-item-renderer)",

		Settings: [
			{
				type: "Checkbox",
				id: "test",
				name: "Test",
				value: true,
				setup_function: `
				let JustGetMeBro = "Hey yo you got me XD"
				`,
				enable_function: `
				alert(JustGetMeBro)
				`,
			},
		],
	},
];

async function Main_Run() {
	// await ClearSave();
	await Load_ThisWeb_Save();
	await Save("Custom_Editable_Items", Test_Editable_Items);
	await Create_StyleSheet_Holder();
	await Update_Editable_Items();
	await Set_Null_Save();
	console.log("Settings_List", await Get_Settings_List());

	//------------------------------------------

	for (const [id, value] of Object.entries(await Get_Settings_List())) {
		if (id == "Themes") {
			continue;
		}
		SetUp_Setting_Function(id);
	}

	await Clear_Unnessary_Save();
	for (const This_Category of Get_ALL_Editable_Items()) {
		if (This_Category.Selector == null) continue;
		This_Category.Selector = ReArrange_Selector(This_Category.Selector);
		console.log("ReArranged", This_Category.Selector);
	}
	await Save_All();

	console.log("Last Saved Data", await Load(null));

	setTimeout(() => {
		console.log("Window Variable", window);
	}, 1);
}

Main_Run();

chrome.runtime.onMessage.addListener(async function (message) {
	console.log(message);
	if (message == "Customize") {
		Toggle_Customize();
	}

	if (message == "Developer") {
		await Save("Developer_Mode", !(await Load("Developer_Mode")));
		Recreate_Editor_UI();
		Recreate_Extension_Setting();
	}

	if (message == "Setting") {
		Toggle_Extension_Setting();
	}
});
