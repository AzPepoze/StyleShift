import { Save_Any } from "../../Core/Save";
import { Advance_Setting_UI } from "./Components/Advance_Setting_UI";
import { Developer_Setting_UI } from "./Components/Developer_Setting_UI";
import { Main_Setting_UI } from "./Components/Main_Setting_UI";

export async function Set_And_Save(This_Setting, value) {
	// This_Setting.value = value;
	// await Save_All();
	await Save_Any(This_Setting.id, value);
}

export let Settings_UI = {
	...Main_Setting_UI,
	...Advance_Setting_UI,
	...Developer_Setting_UI,
};
