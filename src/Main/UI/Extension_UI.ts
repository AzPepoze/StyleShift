import { Load_Developer_Modules, Loaded_Developer_Modules } from "../Modules/Main_Function";
import { GetDocumentBody, sleep } from "../Modules/NormalFunction";
import { Load } from "../Modules/Save";
import { Recreate_Config_UI, Remove_Config_UI } from "./Config_UI";
import { Editor_UI } from "./Editor_UI";
import { Extension_Settings_UI } from "./Extension_Setting_UI";
import { Settings_UI } from "./Settings/Settings_UI_Components";

export async function Create_StyleShift_Window({
	Width = "30%",
	Height = "80%",
	Skip_Animation = false,
}) {
	if (await Load("Developer_Mode")) {
		await Load_Developer_Modules();
	}

	const BG_Frame = await Settings_UI["Fill_Screen"](false);

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

	return {
		BG_Frame,
		Window,
		TopBar,
		Drag_Top,
		Close,
		Run_Close,
	};
}

let Notification_Container;

(async () => {
	const Notification_BG = await Settings_UI["Fill_Screen"](false);
	(await GetDocumentBody()).append(Notification_BG);

	Notification_Container = document.createElement("div");
	Notification_Container.className = "STYLESHIFT-Notification-Container";
	Notification_BG.append(Notification_Container);
})();

export async function Create_Notification({
	Icon = null,
	Title = "StyleShift",
	Content = "",
	Timeout = 3000,
}) {
	console.log(Title, Content);

	const Notification_Frame = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Notification_Frame.className = "STYLESHIFT-Notification";
	Notification_Container.append(Notification_Frame);

	let Icon_UI;

	if (Icon) {
		Icon_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Icon_UI.className += " STYLESHIFT-Notification-Icon";
		Icon_UI.textContent = Icon;
		Notification_Frame.append(Icon_UI);
	}

	//---------------------------------

	const Notification_Content_Frame = await Settings_UI["Setting_Frame"](false, true);
	Notification_Content_Frame.className += " STYLESHIFT-Notification-Content-Frame";
	Notification_Frame.append(Notification_Content_Frame);

	const Title_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Title_UI.className += " STYLESHIFT-Notification-Title";
	Title_UI.textContent = Title;
	Notification_Content_Frame.append(Title_UI);

	const Content_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Content_UI.className += " STYLESHIFT-Notification-Content";
	Notification_Content_Frame.append(Content_UI);

	let Set_Content = (New_Content) => {
		New_Content = String(New_Content);
		Content_UI.innerHTML = New_Content.replaceAll("<script", "").replaceAll("/script>", "");
	};

	Set_Content(Content);

	//---------------------------------

	async function Close() {
		await Run_Animation(Notification_Frame, "Notification-Hide");
		Notification_Frame.remove();
	}

	if (Timeout == 0) {
		const Close_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Close_UI.className += " STYLESHIFT-Notification-Close";
		Close_UI.textContent = "X";
		Notification_Frame.append(Close_UI);

		Close_UI.addEventListener("click", function (e) {
			e.preventDefault();
			Close();
		});
	}

	//---------------------------------

	await Run_Animation(Notification_Frame, "Notification-Show");
	setTimeout(async () => {
		if (Timeout > 0) {
			await sleep(Timeout);
			Close();
		}
	}, 0);

	return {
		Set_Icon: (New_Icon) => {
			if (Icon_UI) {
				Icon_UI.textContent = New_Icon;
			}
		},
		Set_Content,
		Set_Title: (New_Title) => {
			Title_UI.textContent = New_Title;
		},
		Close,
	};
}

export async function Create_Error(Content) {
	return await Create_Notification({
		Icon: "❌",
		Title: "StyleShift - Error",
		Content: Content,
		Timeout: 0,
	});
}

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
