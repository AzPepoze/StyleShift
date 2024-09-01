import { Get_Settings_List, Update_Editable_Items } from "./Items_Editor/Editable_Items";
import { Toggle_Customize } from "./Items_Editor/Editor";
import { Recreate_Editor_UI } from "./Items_Editor/Editor_UI";
import { sleep } from "./Modules/NormalFunction";
import { ClearSave, Load, Save, Save_All, Set_Null_Save } from "./Modules/Save";
import { Toggle_Extension_Setting } from "./Settings/Extension_Setting";
import { SetUp_Setting_Function } from "./Settings/Settings_Function";
import { Create_StyleSheet_Holder } from "./Settings/Settings_StyleSheet";

console.log("Test");
console.log(window.location.href);

var Test_Editable_Items = [
	{
		Category: "Video 📺",
		Selector: ".html5-video-player",

		Settings: [
			{
				type: "Checkbox",
				id: "TestCheckbox",
				name: "TestCheck",
				main_des: "none",
				value: false,
				enable_css: `video{
    display: none !important;
}`,
			},
		],
	},
	{
		Category: "Thumbnail 📰",
		Selector: "ytd-compact-video-renderer , ytd-compact-radio-renderer",

		Settings: [
			{
				type: "Checkbox",
				id: "test",
				name: "Test",
				main_des: "none",
				value: true,
				setup_function: `
				var JustGetMeBro = "Hey yo you got me XD"
				`,
				enable_function: `
				alert(JustGetMeBro)
				`,
			},
		],
	},
];

async function Main_Run() {
	//await ClearSave();
	await sleep(1000);
	Create_StyleSheet_Holder();
	await Set_Null_Save();
	//await Save("Custom_Editable_Items", Test_Editable_Items);
	await Update_Editable_Items();
	await Get_Settings_List();
	console.log(await Get_Settings_List());
	await Save_All();
	for (const [id, value] of Object.entries(await Get_Settings_List())) {
		if (id == "Themes") {
			continue;
		}
		SetUp_Setting_Function(id);
	}
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
	}

	if (message == "Setting") {
		Toggle_Extension_Setting();
	}
});
