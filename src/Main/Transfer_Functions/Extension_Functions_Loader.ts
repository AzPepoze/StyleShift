import { On_Function_Event } from "../Build-in_Functions/Normal_Functions";
import * as StyleShift_Functions from "../Build-in_Functions/Extension_Functions";
import { StyleShift_Property_List } from "../Settings/StyleShift_Items";

export let Type_Convert_Table = {
	function: "js",
	css: "css",
};

function Clear_Bloat(thisSetting: any): any | null {
	const settingType = thisSetting.type;

	const Setting_Properties = StyleShift_Property_List[settingType];

	if (!Setting_Properties) {
		return null;
	}

	const cleanedSetting: any = {};
	for (const key of Setting_Properties) {
		if (key in thisSetting) {
			cleanedSetting[key] = thisSetting[key];
		}
	}

	return cleanedSetting;
}

for (const This_Function_Name of Object.keys(StyleShift_Functions)) {
	On_Function_Event("StyleShift", This_Function_Name, StyleShift_Functions[This_Function_Name]);
}
