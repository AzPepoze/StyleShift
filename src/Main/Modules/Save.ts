import {
	Get_Custom_Items,
	Get_Settings_List,
	Update_StyleShift_Items,
} from "../Settings/StyleShift_Items";
import { Color_OBJ_to_HEX, In_Setting_Page } from "./Extension_Main";
import { Get_Current_Domain, Get_Current_URL_Parameters, sleep } from "./NormalFunction";

//Save
let Saved_Data = {};
let Loaded = false;
let Save_Name;

if (In_Setting_Page) {
	let URL_Parameters = Get_Current_URL_Parameters();
	if (URL_Parameters.Save_Domain) {
		Save_Name = URL_Parameters.Save_Domain;
	} else {
	}
} else {
	Save_Name = Get_Current_Domain();
}

export let Save_External = [
	"Current_Settings",
	"Custom_StyleShift_Items",
	"Themes",
	"Enable_Extension",
	"Realtime_Extension",
	"Developer_Mode",
];

export async function Load_ThisWeb_Save() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function (Saved) {
			console.log("ALL_SAVED", Saved);
		});

		chrome.storage.local.get(Save_Name, function (Saved: Object) {
			if (Saved[Save_Name]) {
				Saved_Data = Saved[Save_Name];
				console.log("Loaded", Save_Name, JSON.stringify(Saved_Data));
			} else {
				Saved_Data = {};
			}
			Loaded = true;
			resolve(true);
		});
	});
}

export async function Save(Name, Value, Pre_Save = false) {
	if (!Loaded) {
		await sleep(100);
		return Save(Name, Value);
	}
	Saved_Data[Name] = Value;
	console.log("Save", Name, Value);
	if (!Pre_Save) {
		return await Save_All();
	}
}

export async function Save_Setting(Name, Value, Pre_Save = false) {
	if (Saved_Data["Current_Settings"] == null) {
		Saved_Data["Current_Settings"] = {};
	}
	Saved_Data["Current_Settings"][Name] = Value;
	console.log("Save_Setting", Name, Value);
	if (!Pre_Save) {
		return await Save_All();
	}
}

export async function Save_Any(Name, Value, Pre_Save = false) {
	if (Save_External.includes(Name)) {
		return await Save(Name, Value, Pre_Save);
	} else {
		return await Save_Setting(Name, Value, Pre_Save);
	}
}

export async function Save_All() {
	console.log("Saving", Save_Name, Saved_Data);
	await chrome.storage.local.set({ [Save_Name]: Saved_Data });
	console.log("Saved", Save_Name, Saved_Data);
	return true;
}

// export async function Save_Custom_Items() {
// 	return Save("Custom_StyleShift_Items", Get_Custom_Items());
// }

export async function Load(LoadName: string) {
	if (!Loaded) {
		await sleep(100);
		return await Load(LoadName);
	}
	if (LoadName == null) {
		return Saved_Data;
	} else {
		return Saved_Data[LoadName];
	}
}

export async function Load_Setting(LoadName: string) {
	if (!Loaded) {
		await sleep(100);
		return await Load_Setting(LoadName);
	}
	if (Saved_Data["Current_Settings"] != null) {
		return Saved_Data["Current_Settings"][LoadName];
	} else {
		return null;
	}
}

export async function Load_Any(LoadName: string) {
	const Get_Data = await Load_Setting(LoadName);
	if (Get_Data == null) {
		return await Load(LoadName);
	} else {
		return Get_Data;
	}
}

export async function ClearSave() {
	await chrome.storage.local.clear();
}

export async function Clear_Unnessary_Save() {
	if (!Loaded) {
		await sleep(100);
		return await Clear_Unnessary_Save();
	}

	console.log("Clearing Unnessary Save");

	let Can_Setting_List = Object.keys(await Get_Settings_List(true));
	let Current_Settings = Saved_Data["Current_Settings"];

	for (const key of Object.keys(Current_Settings)) {
		if (!Can_Setting_List.includes(key)) {
			console.log("Removed", key);
			delete Current_Settings[key];
		}
	}

	for (const key of Object.keys(Saved_Data)) {
		if (!Save_External.includes(key)) {
			console.log("Removed", key);
			delete Saved_Data[key];
		}
	}

	console.log("Clearing Unnessary Save", "Saving");

	await Save_All();

	console.log("Cleared Unnessary Save");
}

export async function LoadRgba(Text) {
	let HEX = await Load(Text + "C");
	HEX = HEX.replace("#", "");
	let aRgbHex = HEX.match(/.{1,2}/g);
	let aRgb = [
		parseInt(aRgbHex[0], 16) +
			"," +
			parseInt(aRgbHex[1], 16) +
			"," +
			parseInt(aRgbHex[2], 16),
	];

	return `rgba(` + aRgb + `,` + (await Load(Text + "O")) / 100 + `)`;
}

// function CheckCanSave(KeyName) {
// 	let CanAdd = true;
// 	if (StyleShift_Save_Prevent.includes(KeyName) || !StyleShiftAllSaveKey.includes(KeyName)) {
// 		CanAdd = false;
// 	}
// 	return CanAdd;
// }

// function CheckCanSaveForThemeSelector(KeyName) {
// 	let CanAdd = true;
// 	if (StyleShift_Save_Prevent.includes(KeyName) || Save_OBJ[KeyName] == null) {
// 		CanAdd = false;
// 	}
// 	return CanAdd;
// }

export async function LoadNTubeCode(Preset) {
	let array = Preset;

	if (Object.prototype.toString.call(array) == "[object Object]") {
		for (let key of Object.keys(array)) {
			let value = array[key];
			let TryToParse;
			try {
				TryToParse = JSON.parse(value);
			} catch (error) {}
			if (TryToParse != null) {
				value = TryToParse;
			}

			//await SetSetting(key, value);

			if (key == "ADDScript" && value.replaceAll("\n", "").replaceAll(" ", "") != "") {
				if (
					confirm(
						`⚠️*WARINING*⚠️\nThis Preset/Theme contain JS code.\nYou can be hacked if you continue.\n(Please make sure this code is from who you trust!)\n\nAre you want to load JS code?`
					)
				) {
					await Save_Setting(key, value);
				} else {
					await Save_Setting(key, "");
				}
			}
		}
	} else {
		for (let i = 0; i < array.length; i += 2) {
			let value = array[i + 1];
			let TryToParse;
			try {
				TryToParse = JSON.parse(value);
			} catch (error) {}
			if (TryToParse != null) {
				value = TryToParse;
			}
			await Save_Setting(array[i], value);
		}
	}

	//update();
}

export async function LoadNTubeCodeString(string) {
	console.log(await ConvertStringToPreset(string));
	return await LoadNTubeCode(await ConvertStringToPreset(string));
}

export async function GenNTubeCode() {
	await Update_StyleShift_Items();
	await Clear_Unnessary_Save();

	return await Load("Current_Settings");
}

export async function GenNTubeCodeString() {
	let arr = await GenNTubeCode();
	let gentext = JSON.stringify(arr).replace(/,"/g, ',\n"');
	gentext = gentext.substring(0, 1) + "\n" + gentext.substring(1);
	let gentextL = gentext.length;
	gentext = gentext.substring(0, gentextL - 1) + "\n" + gentext.substring(gentextL - 1);
	return gentext;
}

export async function ConvertStringToPreset(string) {
	return JSON.parse(string);
}

export async function ConvertToNewSave(Save) {
	let NewSave = { ...Save };

	await Promise.all(
		Object.keys(NewSave).map(async (id) => {
			if (NewSave[id] == "true") {
				NewSave[id] = true;
			}

			if (NewSave[id] == "false") {
				NewSave[id] = false;
			}

			if (id.slice(-1) == "T" && (NewSave[id] === true || NewSave[id] === false)) {
				NewSave[id.slice(0, -1)] = NewSave[id];
				delete NewSave[id];
			}
		})
	);

	return NewSave;
}

export async function Set_Null_Save() {
	if ((await Load("Current_Settings")) == null) {
		await Save("Current_Settings", {});
	}

	if ((await Load("Themes")) == null) {
		await Save("Themes", {});
	}

	let Current_Settings = await Load("Current_Settings");

	for (const [id, args] of Object.entries(await Get_Settings_List()) as [string, any]) {
		if (Save_External.includes(id)) continue;
		console.log("Check", id, Current_Settings[id]);
		if (Current_Settings[id] == null) {
			console.log("Added New", id, args.value);
			await Save_Any(id, args.value, true);
		}
	}

	await Save_All();
}
