import { GetDocumentBody, sleep } from "../Build-in_Functions/Normal_Functions";
import { Load_Developer_Modules, Loaded_Developer_Modules } from "../Core/Core_Functions";
import { Load } from "../Core/Save";
import { Recreate_Config_UI, Remove_Config_UI } from "./Config_UI";
import { Editor_UI } from "./Editor_UI";
import { Extension_Settings_UI } from "./Extension_Setting_UI";
import { Settings_UI } from "./Settings/Settings_UI_Components";

export async function Create_StyleShift_Window({ Width = "30%", Height = "80%", Skip_Animation = false }) {
	if (await Load("Developer_Mode")) {
		await Load_Developer_Modules();
	}

	console.log("Setting up");

	const BG_Frame = await Settings_UI["Fill_Screen"](false);

	const Window = document.createElement("div");
	Window.className = "STYLESHIFT-Main STYLESHIFT-Window";
	Window.style.pointerEvents = "all";
	Window.style.width = Width;
	Window.style.height = Height;

	if (!Skip_Animation) {
		Show_Window_Animation(Window);
	}

	BG_Frame.appendChild(Window);

	let TopBar = document.createElement("div");
	TopBar.className = "STYLESHIFT-TopBar";
	Window.append(TopBar);

	let Drag_Top = await Settings_UI["Drag"](Window);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	TopBar.append(Drag_Top);

	let Close = await Settings_UI["Close"]();
	TopBar.append(Close);

	let Run_Close = async function () {
		await Hide_Window_Animation(Window);
		BG_Frame.remove();
	};

	Close.addEventListener("click", Run_Close, { once: true });

	requestAnimationFrame(async () => {
		(await GetDocumentBody()).appendChild(BG_Frame);
	});

	return {
		BG_Frame,
		Window,
		TopBar,
		Drag_Top,
		Close,
		Run_Close,
	};
}

export let Notification_Container;

(async () => {
	const Notification_BG = await Settings_UI["Fill_Screen"](false);
	setTimeout(async () => {
		(await GetDocumentBody()).append(Notification_BG);
	}, 1);

	Notification_Container = document.createElement("div");
	Notification_Container.className = "STYLESHIFT-Notification-Container";
	Notification_BG.append(Notification_Container);
})();

export let Animation_Time = 0.25;

export async function Run_Animation(Target: HTMLDivElement, Animation_Name: string) {
	Target.style.animation = `STYLESHIFT-${Animation_Name} ${Animation_Time}s forwards`;
	await sleep(Animation_Time * 1000);
}

export async function Show_Window_Animation(Target: HTMLDivElement) {
	await Run_Animation(Target, "Show-Pop-Animation");
}

export async function Hide_Window_Animation(Target: HTMLDivElement) {
	await Run_Animation(Target, "Hide-Pop-Animation");
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

	Extension_Settings_UI.Recreate_UI();
	Editor_UI.Recreate_UI();
	if (!(await Load("Developer_Mode"))) {
		Remove_Config_UI();
	} else {
		Recreate_Config_UI();
	}
}
