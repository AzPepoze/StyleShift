import { Load_Developer_Modules, Loaded_Developer_Modules } from "../Modules/Main_Function";
import { GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
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

//---------------------------------

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
