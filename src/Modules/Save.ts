import { Get_Custom_Items, Get_Settings_List } from "../Items_Editor/Editable_Items";
import { Get_Current_Domain, sleep } from "./NormalFunction";

//Save
var Saved_Data = {};
var Loaded = false;
var Save_Name = Get_Current_Domain();

async function Load_ThisWeb_Save() {
	chrome.storage.local.get(null, function (Saved) {
		console.log("ALL_SAVED", Saved);
	});

	chrome.storage.local.get(Save_Name, function (Saved: Object) {
		if (Saved[Save_Name]) {
			Saved_Data = Saved[Save_Name];
			console.log("Loaded", Saved_Data);
		} else {
			Saved_Data = {};
		}
		Loaded = true;
	});
}
Load_ThisWeb_Save();

export async function Save(Name, Value) {
	if (!Loaded) {
		await sleep(100);
		return Save(Name, Value);
	}
	Saved_Data[Name] = Value;
	console.log("Save", Name, Value);
	return await Save_All();
}

export async function Save_All() {
	console.log(Save_Name, { [Save_Name]: Saved_Data });
	return await chrome.storage.local.set({ [Save_Name]: Saved_Data });
}

export async function Save_Custom_Items() {
	return Save("Custom_Editable_Items", Get_Custom_Items());
}

export async function Load(LoadName: string): Promise<any> {
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

export async function ClearSave() {
	await chrome.storage.local.clear();
}

export async function LoadRgba(Text) {
	var HEX = await Load(Text + "C");
	HEX = HEX.replace("#", "");
	var aRgbHex = HEX.match(/.{1,2}/g);
	var aRgb = [
		parseInt(aRgbHex[0], 16) +
			"," +
			parseInt(aRgbHex[1], 16) +
			"," +
			parseInt(aRgbHex[2], 16),
	];

	return `rgba(` + aRgb + `,` + (await Load(Text + "O")) / 100 + `)`;
}

var StyleShiftSavePrevent = [
	"PRESET",
	"SHOWPRESET",
	"EnableButton",
	"Realtime",
	"ErrorCollect",
	"Saved_OBJ",
	"JSAuto",
	"OldVer",
	"API",
];

var StyleShiftAllSaveKey = [];

function CheckCanSave(KeyName) {
	var CanAdd = true;
	if (StyleShiftSavePrevent.includes(KeyName) || !StyleShiftAllSaveKey.includes(KeyName)) {
		CanAdd = false;
	}
	return CanAdd;
}

// function CheckCanSaveForThemeSelector(KeyName) {
// 	var CanAdd = true;
// 	if (StyleShiftSavePrevent.includes(KeyName) || Save_OBJ[KeyName] == null) {
// 		CanAdd = false;
// 	}
// 	return CanAdd;
// }

export async function LoadNTubeCode(Preset) {
	let array = Preset;

	if (Object.prototype.toString.call(array) == "[object Object]") {
		for (var key of Object.keys(array)) {
			//--------------------
			if (!CheckCanSave(key)) {
				continue;
			}
			//--------------------

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
					//await SetSetting(key, value);
				} else {
					//await SetSetting(key, "");
				}
			}
		}
	} else {
		for (let i = 0; i < array.length; i += 2) {
			//--------------------
			if (CheckCanSave(key)) {
				continue;
			}
			//--------------------

			let value = array[i + 1];
			let TryToParse;
			try {
				TryToParse = JSON.parse(value);
			} catch (error) {}
			if (TryToParse != null) {
				value = TryToParse;
			}
			//await SetSetting(array[i], array[i + 1]);
		}
	}

	//update();
}

export async function LoadNTubeCodeString(string) {
	console.log(await ConvertStringToPreset(string));
	return await LoadNTubeCode(await ConvertStringToPreset(string));
}

export async function GenNTubeCode() {
	var arrdata = {};

	let ThisSave = await Load(null);
	for (var z in ThisSave) {
		//--------------------
		var Skip = false;
		for (var i of StyleShiftSavePrevent) {
			if (i == z) {
				Skip = true;
				break;
			}
		}
		if (Skip) {
			continue;
		}
		//--------------------
		arrdata[z] = ThisSave[z];
	}

	return arrdata;
}

export async function GenNTubeCodeString() {
	let arr = await GenNTubeCode();
	var gentext = JSON.stringify(arr).replace(/,"/g, ',\n"');
	gentext = gentext.substring(0, 1) + "\n" + gentext.substring(1);
	var gentextL = gentext.length;
	gentext = gentext.substring(0, gentextL - 1) + "\n" + gentext.substring(gentextL - 1);
	return gentext;
}

export async function ConvertStringToPreset(string) {
	return JSON.parse(string);
}

export async function ConvertToNewSave(Save) {
	var NewSave = { ...Save };

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
	for (const [id, args] of Object.entries(await Get_Settings_List()) as [string, any]) {
		console.log(await Load(id));
		if ((await Load(id)) == null) {
			console.log("Added New", id, args.value);
			await Save(id, args.value);
		}
	}
}
