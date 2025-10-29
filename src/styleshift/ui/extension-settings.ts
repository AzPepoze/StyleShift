import { Get_ALL_StyleShift_Items } from "../settings/items";
import { Create_Main_Settings_UI } from "./settings/settings";

export let Extension_Settings_UI: Awaited<ReturnType<typeof Create_Main_Settings_UI>>;

(async () => {
	Extension_Settings_UI = await Create_Main_Settings_UI({
		Get_Category: Get_ALL_StyleShift_Items,
	});
})();
