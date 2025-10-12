import { Create_Error } from "../build-in-functions/extension";
import { StyleShift_Property_List, Type_Convert_Table } from "../settings/default-items";
import { Setting } from "../types/store";

export async function Convert_To_Export_Setting(
	This_Setting: Setting,
	Create_File_Function: (File_Name: string, File_Data: string) => Promise<void>
) {
	try {
		for (const this_property of StyleShift_Property_List[This_Setting.type]) {
			if (
				(this_property.includes("_css") || this_property.includes("_function")) &&
				!(this_property in This_Setting)
			) {
				This_Setting[this_property] = "";
			}
		}

		//-----------------------------------

		for (const This_Key of Object.keys(This_Setting)) {
			for (const [StyleShift_Type, Converted_Type] of Object.entries(Type_Convert_Table)) {
				if (This_Key.endsWith(StyleShift_Type)) {
					await Create_File_Function(`${This_Key}.${Converted_Type}`, This_Setting[This_Key]);
					delete This_Setting[This_Key];
				}
			}
		}
	} catch (error) {
		Create_Error(`${error}\n\n${JSON.stringify(This_Setting)}`);
	}
}
