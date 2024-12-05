import {
	In_Setting_Page,
	Run_Text_Script,
	Update_StyleShift_Functions_List,
} from "./Modules/Main_Function";
import { ReArrange_Selector } from "./Modules/NormalFunction";
import {
	Clear_Unnessary_Save,
	Load,
	Load_ThisWeb_Save,
	Save,
	Save_All,
	Set_Null_Save,
} from "./Modules/Save";
import { SetUp_Setting_Function } from "./Settings/Settings_Function";
import { Create_StyleSheet_Holder } from "./Settings/Settings_StyleSheet";
import {
	Category,
	Get_ALL_StyleShift_Items,
	Get_ALL_StyleShift_Settings,
	Get_Settings_List,
	Update_StyleShift_Items,
} from "./Settings/StyleShift_Items";
import * as Global from "./Transfer_Functions/Extension_Functions";
import { Extension_Settings_UI } from "./UI/Extension_Setting_UI";
import { Update_All_UI } from "./UI/Extension_UI";
import { Toggle_Customize } from "./UI/Highlight_UI";

console.log(Global);
console.log(window.location.href);

console.log(chrome);

let Test_Editable_Items: Category[] = [
	{
		Category: "☕ Buy me a coffee!",
		Rainbow: true,
		Settings: [
			{
				type: "Button",
				name: "Ko-fi",
				icon: "https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion-p-500.png",
				color: "#ff040bff",
				font_size: 15,
				click_function: 'window.open("https://ko-fi.com/azpepoze");',
				text_align: "left",
			},
		],
	},
	{
		Category: "🎉 Join my Discord!",
		Rainbow: true,
		Settings: [
			{
				type: "Button",
				name: "NEWTUBE",
				icon: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
				color: "#1932ffff",
				font_size: 15,
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				text_align: "left",
			},
		],
	},
	{
		Category: "⚙️ Extention's settings",
		Settings: [
			{
				type: "Checkbox",
				id: "Enable_Extension",
				name: "Enable",
				value: true,
				enable_function: "Enable_Extension_Function()",
				disable_function: "Disable_Extension_Function()",
				enable_css: "wad",
				setup_css: "",
			},
			{
				type: "Checkbox",
				id: "Realtime_Extension",
				name: "Realtime Changing",
				value: false,
			},
			{
				type: "Checkbox",
				id: "Setting_BG_Transparent",
				name: "Setting Background transparent",
				value: false,
			},
			{
				type: "Button",
				id: "Test_Button",
				name: "Github",
				description: "Description of this Button",
				color: "#2e16feff",
				click_function: 'window.open("https://github.com/AzPepoze/Newtube");',
				text_align: "left",
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				font_size: 15,
			},
			{
				type: "Button",
				id: "Test_Button",
				name: "❗Report bugs / Issues❗\n",
				description: "Description of this Button",
				color: "#e60005ff",
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				font_size: 15,
				text_align: "center",
			},
		],
	},
	{
		Category: "🛍️ Themes 🛍️",
		Settings: [
			{
				type: "Button",
				id: "Test_Button",
				name: "✨ Select Theme ✨",
				description: "Description of this Button",
				color: "#e6aa00ff",
				click_function: "",
				text_align: "center",
				icon: "",
				font_size: 15,
			},
			{
				type: "Button",
				id: "Test_Button_1",
				name: "🛍️ Themes store 🛍️",
				description: "Description of this Button",
				color: "#0050c8ff",
				click_function: "",
				text_align: "center",
				font_size: 15,
			},
			{
				type: "Button",
				id: "Test_Button_2",
				name: "🛍️ Themes store 🛍️\n(Floating window)",
				description: "Description of this Button",
				color: "#0050c8ff",
				click_function: "",
				text_align: "center",
				font_size: 15,
			},
			{
				type: "Button",
				id: "Test_Button_3",
				name: "✳️ Share your themes ✳️",
				description: "Description of this Button",
				color: "#32b432ff",
				click_function: "",
				text_align: "center",
				font_size: 15,
			},
		],
	},
	{
		Category: "📜 Import / Export Style",
		Settings: [
			{
				type: "Button",
				name: 'Export "Custom Items" (Clipboard)',
				icon: "",
				color: "#1932ffff",
				font_size: 15,
				click_function: "await Copy_to_clipboard(await Export_Custom_Items_Text());",
				text_align: "center",
				description: "",
				id: "",
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
				setup_css: "video{\tborder-radius: var(--player-edge) !important;}",
			},
			{
				type: "Checkbox",
				id: "VdoAnim",
				name: "Enable Chaning Video transition",
				description: "bruh man",
				value: false,
				enable_css:
					"div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container{\n               transition: all 1s ,background 0.1s;\n               top: 0px !important\n          }\n         \n          div.ended-mode .html5-video-container,\n          div.unstarted-mode:not(.ytp-small-mode) .html5-video-container{\n               transform:scale(0.5);\n               opacity:0 !important;\n          }",
			},
			{
				type: "Color",
				id: "Time-LineBG",
				name: "Just Color Selector",
				description: "Description of this Dropdown",
				show_alpha_slider: true,
				value: "#24db28ff",
			},
			{
				type: "Color",
				id: "TimeLoaded",
				name: "Just Color Selector_1",
				description: "Description of this Dropdown",
				show_alpha_slider: true,
				value: "#24db28ff",
			},
			{
				type: "Color",
				id: "EndBG",
				name: "Just Color Selector_2",
				description: "Description of this Dropdown",
				show_alpha_slider: true,
				value: "#24db28ff",
			},
			{
				type: "Color",
				id: "Time-Play",
				name: "Progress line",
				description: "Description of this Dropdown",
				show_alpha_slider: true,
				value: "#24db28ff",
				setup_css:
					".ytp-play-progress{\n     background: var(--Time-Play) !important;\n}",
				setup_function: "",
			},
			{
				type: "Checkbox",
				id: "CenterUDF",
				name: "(Fullscreen) Move tittle to the center",
				description: "Description of this Checkbox",
				value: false,
				enable_css: ".ytp-big-mode .ytp-title-text {\n     text-align: center;\n}",
				enable_function: "",
			},
			{
				type: "Checkbox",
				id: "AutoTheater",
				name: "Auto Enter Theater Mode",
				description: "Description of this Checkbox",
				value: false,
				enable_function:
					"let GetTheaterButton = await WaitForElement(`.ytp-size-button`)\n          if (GetTheaterButton) {\n               let IsPlayerInNormalMode = await WaitForElement(`#player .html5-video-player`)\n               console.log(IsPlayerInNormalMode)\n               if (IsPlayerInNormalMode) {\n                    console.log(GetTheaterButton)\n                    GetTheaterButton.click()\n                    await sleep(1000)\n                    IsPlayerInNormalMode = await WaitForElement(`#player .html5-video-player`)\n                    if (IsPlayerInNormalMode) {\n                         AutoTheaterMode()\n                    }\n               }\n}",
				enable_css: "",
			},
		],
	},
	{
		Category: "📰 Thumbnail",
		Selector:
			"ytd-watch-next-secondary-results-renderer #contents > .ytd-item-section-renderer:not(ytd-reel-shelf-renderer),\nytd-rich-grid-renderer #contents > .ytd-rich-grid-renderer:(ytd-rich-item-renderer)",
		Settings: [
			{
				type: "Checkbox",
				id: "TESTTTTT",
				name: "Enable",
				value: true,
				setup_function: `Set_Value("TEST","YAY")`,
				enable_function: `//alert(Get_Value("TEST"))`,
				disable_function: "Disable_Extension_Function()",
				enable_css: "wad",
				setup_css: "",
			},
		],
	},
];

export function Update_All() {
	Update_StyleShift_Functions_List();
	Update_StyleShift_Items();
	Update_All_UI();
}

async function Main_Run() {
	if (!In_Setting_Page) {
		let Build_in_Functions = await (
			await fetch(chrome.runtime.getURL("Build_in_Functions.js"))
		).text();

		Run_Text_Script(Build_in_Functions, false);

		console.log(window);
	}

	//------------------------------------------

	// await ClearSave();
	console.log("Loading");
	await Load_ThisWeb_Save();
	console.log("Listing Functions");
	await Update_StyleShift_Functions_List();

	console.log("Set Defult Items");
	// await Save("Custom_StyleShift_Items", Test_Editable_Items);
	await Create_StyleSheet_Holder();
	await Update_StyleShift_Items();
	await Set_Null_Save();
	console.log("Settings_List", await Get_Settings_List());

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
		console.log("ReArranged", This_Category.Selector);
	}
	await Save_All();

	console.log("Last Saved Data", await Load(null));

	setTimeout(() => {
		console.log("Window Variable", window);
	}, 1);
	Run_Text_Script(`console.log("Window Variable 2", window);`);

	if (In_Setting_Page) {
		Extension_Settings_UI.Create_UI();
	}
}

Main_Run();

chrome.runtime.onMessage.addListener(async function (message) {
	console.log(message);

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
});
