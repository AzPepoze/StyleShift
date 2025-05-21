import { Get_ALL_StyleShift_Items } from "../Settings/StyleShift_Items";
import { Create_Main_Settings_UI } from "./Settings/Settings_UI";

export let Extension_Settings_UI: Awaited<ReturnType<typeof Create_Main_Settings_UI>>;

(async () => {
	Extension_Settings_UI = await Create_Main_Settings_UI({
		Get_Category: Get_ALL_StyleShift_Items,
	});
})();

// export async function Create_Extension_Setting(Skip_Animation = false) {
// 	Current_Settings_Window =
// }

// export async function Toggle_Extension_Setting() {
// 	Current_Settings_Window.Toggle();
// }

// export async function Recreate_Extension_Setting() {
// 	Current_Settings_Window.Recreate_UI();
// }
