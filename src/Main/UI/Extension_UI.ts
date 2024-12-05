import { Load_Developer_Modules, Loaded_Developer_Modules } from "../Modules/Main_Function";
import { GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Recreate_Config_UI, Remove_Config_UI } from "./Config_UI";
import { Editor_UI } from "./Editor_UI";
import { Extension_Settings_UI } from "./Extension_Setting_UI";
import { Create_Setting_UI_Element } from "./Settings_UI";

export async function Create_StyleShift_Window({
	Width = "30%",
	Height = "80%",
	Skip_Animation = false,
}) {
	if (await Load("Developer_Mode")) {
		await Load_Developer_Modules();
	}

	const BG_Frame = await Create_Setting_UI_Element("Fill_Screen", false);

	(await GetDocumentBody()).appendChild(BG_Frame);

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

	let Drag_Top = await Create_Setting_UI_Element("Drag", Window);
	Drag_Top.style.width = "calc(100% - 5px - 27px)";
	TopBar.append(Drag_Top);

	let Close = await Create_Setting_UI_Element("Close");
	TopBar.append(Close);

	let Run_Close = async function () {
		await Hide_Window_Animation(Window);
		BG_Frame.remove();
	};

	Close.addEventListener("click", Run_Close, { once: true });

	return {
		BG_Frame,
		Window,
		TopBar,
		Drag_Top,
		Close,
		Run_Close,
	};
}

export async function Create_Notification({ Icon = null, Title = "StyleShift", Content = "" }) {
	console.log(Title, Content);
	const BG = await Create_Setting_UI_Element("Fill_Screen", false);
	(await GetDocumentBody()).append(BG);

	const Notification_Frame = await Create_Setting_UI_Element("Setting_Frame", true, false, {
		x: false,
		y: true,
	});
	Notification_Frame.className = "STYLESHIFT-Notification";
	BG.append(Notification_Frame);

	if (Icon) {
		const Icon_UI = await Create_Setting_UI_Element("Setting_Frame", true, false, {
			x: true,
			y: true,
		});
		Icon_UI.className += " STYLESHIFT-Notification-Icon";
		Icon_UI.textContent = Icon;
		Notification_Frame.append(Icon_UI);
	}

	const Notification_Content_Frame = await Create_Setting_UI_Element(
		"Setting_Frame",
		false,
		true
	);
	Notification_Content_Frame.className += " STYLESHIFT-Notification-Content-Frame";
	Notification_Frame.append(Notification_Content_Frame);

	const Title_UI = await Create_Setting_UI_Element("Setting_Frame", true, false, {
		x: false,
		y: true,
	});
	Title_UI.className += " STYLESHIFT-Notification-Title";
	Title_UI.textContent = Title;
	Notification_Content_Frame.append(Title_UI);

	const Content_UI = await Create_Setting_UI_Element("Setting_Frame", true, false, {
		x: false,
		y: true,
	});
	Content_UI.className += " STYLESHIFT-Notification-Content";
	Content_UI.textContent = Content;
	Notification_Content_Frame.append(Content_UI);

	await Show_Window_Animation(Notification_Frame);

	await sleep(2000);

	await Hide_Window_Animation(Notification_Frame);

	BG.remove();
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

	Extension_Settings_UI.Recreate_UI();
	Editor_UI.Recreate_UI();
	if (!(await Load("Developer_Mode"))) {
		Remove_Config_UI();
	} else {
		Recreate_Config_UI();
	}
}
