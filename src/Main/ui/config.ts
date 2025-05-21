import { Create_StyleShift_Window } from "./extension";

export let Config_Window: Awaited<ReturnType<typeof Create_StyleShift_Window>>;
let Scrollable: HTMLElement;
let Current_Content_Function;

export async function Create_Config_UI(Skip_Animation = false) {
	Config_Window = await Create_StyleShift_Window({ Skip_Animation });
	Scrollable = document.createElement("div");
	Scrollable.className = "STYLESHIFT-Scrollable";
	Config_Window.Window.append(Scrollable);
	Config_Window.Close.addEventListener(
		"click",
		function () {
			Remove_Config_UI();
		},
		{ once: true }
	);

	return Config_Window;
}

export async function Show_Config_UI(Inner_Content_Function: Function) {
	if (!Config_Window) {
		await Create_Config_UI();
	}
	Current_Content_Function = Inner_Content_Function;
	Recreate_Config_UI();
}

export async function Recreate_Config_UI() {
	if (!Config_Window) return;

	Scrollable.innerHTML = "";
	Current_Content_Function(Scrollable);
}

export function Remove_Config_UI(Skip_Animation = false) {
	if (Config_Window) {
		if (Skip_Animation) {
			Config_Window.BG_Frame.remove();
		} else {
			Config_Window.Close.click();
		}
		Config_Window = null;
		Current_Content_Function = null;
	}
}
