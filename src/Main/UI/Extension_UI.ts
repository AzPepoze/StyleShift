import { Get_Global_Data, Run_Text_Script } from "../Modules/Extension_Main";
import { GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Create_StyleSheet } from "../Settings/Settings_StyleSheet";
import { Recreate_Config_UI, Remove_Config_UI } from "./Config_UI";
import { Recreate_Editor_UI } from "./Editor_UI";
import { Recreate_Extension_Setting } from "./Extension_Setting_UI";
import { Create_Setting_UI_Element } from "./Settings_UI";

export async function Create_StyleShift_Window(Skip_Animation = false) {
	if (await Load("Developer_Mode")) {
		await Load_Developer_Modules();
	}

	const Setting_BG = await Create_Setting_UI_Element("Fill_Screen", false);

	(await GetDocumentBody()).appendChild(Setting_BG);

	const Editor = document.createElement("div");
	Editor.className = "STYLESHIFT-Main STYLESHIFT-Editor";
	Editor.style.pointerEvents = "all";

	if (!Skip_Animation) {
		Show_Window_Animation(Editor);
	}

	Setting_BG.appendChild(Editor);

	let TopBar = document.createElement("div");
	TopBar.className = "STYLESHIFT-TopBar";
	Editor.append(TopBar);

	let Drag_Top = await Create_Setting_UI_Element("Drag", Editor);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	TopBar.append(Drag_Top);

	let Close = await Create_Setting_UI_Element("Close");
	TopBar.append(Close);
	Close.addEventListener(
		"click",
		async function () {
			await Hide_Window_Animation(Editor);
			Setting_BG.remove();
		},
		{ once: true }
	);

	return {
		Setting_BG,
		Editor,
		TopBar,
		Drag_Top,
		Close,
	};
}

export let Animation_Time = 0.25;

export async function Show_Window_Animation(Target: HTMLDivElement) {
	Target.style.animation = `STYLESHIFT-Show-Pop-Animation ${Animation_Time}s forwards`;
	await sleep(Animation_Time * 1000);
}

export async function Hide_Window_Animation(Target: HTMLDivElement) {
	Target.style.animation = `STYLESHIFT-Hide-Pop-Animation ${Animation_Time}s forwards`;
	await sleep(Animation_Time * 1000);
}

//---------------------------------

export async function Show_Confirm(ask) {
	return new Promise((resolve, reject) => {
		resolve(confirm(ask));
	});
}

export let Loaded_Developer_Modules = false;

export let Monaco: typeof import("monaco-editor");
export let Monaco_Themes;
export let JSzip: typeof import("jszip");

export async function Load_Developer_Modules() {
	if (Loaded_Developer_Modules) {
		return;
	}

	Loaded_Developer_Modules = true;

	//---------------------------------------------------------------------

	const Modules_Data = await (
		await fetch(chrome.runtime.getURL("Setting_Page/index.js"))
	).text();
	Run_Text_Script(Modules_Data, false);

	Create_StyleSheet("Monaco").textContent = await (
		await fetch(chrome.runtime.getURL("Setting_Page/index.css"))
	).text();

	//---------------------------------------------------------------------

	Monaco = await Get_Global_Data("Build-in", "Monaco");
	Monaco_Themes = await Get_Global_Data("Build-in", "Monaco_Themes");

	for (const [Theme_Name, Theme_Content] of Object.entries(Monaco_Themes) as [string, any][]) {
		if (Theme_Name == "themelist") continue;
		console.log("Themes Name", Theme_Name.replace(/[^a-zA-Z0-9_-]/g, ""));
		Monaco.editor.defineTheme(Theme_Name.replace(/[^a-zA-Z0-9]|_|-/g, ""), Theme_Content);
	}

	Monaco.editor.setTheme("Dracula");

	//---------------------------------------------------------------------

	JSzip = (await Get_Global_Data("Build-in", "JSzip")).default;

	console.log(window);
}

export async function Update_All_UI() {
	if ((await Load("Developer_Mode")) && !Loaded_Developer_Modules) {
		await Load_Developer_Modules();
	}

	Recreate_Editor_UI();
	Recreate_Extension_Setting();
	if (!(await Load("Developer_Mode"))) {
		Remove_Config_UI();
	} else {
		Recreate_Config_UI();
	}
}
