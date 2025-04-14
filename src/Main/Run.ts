import { Create_Error } from "./Build-in_Functions/Extension_Functions";
import {
	Get_Current_Domain,
	Get_Current_URL_Parameters,
	GetDocumentBody,
	ReArrange_Selector,
} from "./Build-in_Functions/Normal_Functions";
import { Run_Text_Script, Update_StyleShift_Functions_List } from "./Core/Core_Functions";
import { Clear_Unused_Save, Load, Load_ThisWeb_Save, Save, Save_All } from "./Core/Save";
import { SetUp_Setting_Function } from "./Settings/Settings_Function";
import { Create_StyleSheet_Holder } from "./Settings/Settings_StyleSheet";
import {
	Get_ALL_StyleShift_Items,
	Get_ALL_StyleShift_Settings,
	Update_StyleShift_Items,
} from "./Settings/StyleShift_Items";
import * as Global from "./Transfer_Functions/Extension_Functions_Loader";
import { Extension_Settings_UI } from "./UI/Extension_Setting_UI";
import { Update_All_UI } from "./UI/Extension_UI";
import { Toggle_Customize } from "./UI/Highlight_UI";

//-------------------------------------------------------
// Global Variables & Constants
//-------------------------------------------------------

export let Ver = chrome.runtime.getManifest().version;

export let isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
console.log("isFirefox", navigator.userAgent.toLowerCase(), isFirefox);

let inIframe;
try {
	inIframe = window.self !== window.top;
} catch (e) {
	inIframe = true;
}

let DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`;
let DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`;

export let Extension_Location = chrome.runtime.getURL("").slice(0, -1);
export let Extension_ID = Extension_Location.slice(19, 0);

export let In_Setting_Page;
if (window.location.origin == Extension_Location) {
	In_Setting_Page = true;
} else {
	In_Setting_Page = false;
}
console.log("In_Setting_Page", In_Setting_Page);

export let Save_Name;
if (In_Setting_Page) {
	let URL_Parameters = Get_Current_URL_Parameters();
	if (URL_Parameters.Save_Domain) {
		Save_Name = URL_Parameters.Save_Domain;
	} else {
		Save_Name = "youtube.com";
	}
} else {
	Save_Name = Get_Current_Domain();
}

/*
-------------------------------------------------------
 Console Logs (Development)
-------------------------------------------------------
*/
console.log(Global);

/*
-------------------------------------------------------
 Global Variables & Constants
-------------------------------------------------------
*/
export let StyleShift_Station: HTMLElement = document.createElement("div");
StyleShift_Station.className = "StyleShift-Station";
StyleShift_Station.style.display = "none";

/*
-------------------------------------------------------
 Core Functions
-------------------------------------------------------
*/
export function Update_All() {
	Update_StyleShift_Functions_List();
	Update_StyleShift_Items();
	Update_All_UI();
}

async function Main_Run() {
	// Append StyleShift Station to the body
	setTimeout(async () => {
		(await GetDocumentBody()).append(StyleShift_Station);
	}, 1);

	// Inject build-in functions if not in the settings page
	if (!In_Setting_Page) {
		let Build_in_Functions = await (await fetch(chrome.runtime.getURL("Build_in_Functions.js"))).text();
		Run_Text_Script({
			Text: Build_in_Functions,
			Replace: false,
		});
	}

	//------------------------------------------
	// Initialization Steps
	//------------------------------------------
	await Load_ThisWeb_Save();

	// Test
	// Saved_Data["Custom_StyleShift_Items"] = Test_Editable_Items;
	// console.log("Test", Saved_Data);
	// await Save_All();

	await Update_StyleShift_Functions_List();
	await Create_StyleSheet_Holder();
	await Update_StyleShift_Items();
	console.log("Test", Get_ALL_StyleShift_Items());

	//------------------------------------------
	// Apply Settings & Save
	//------------------------------------------
	for (const This_Setting of await Get_ALL_StyleShift_Settings()) {
		if (This_Setting.id == "Themes") {
			continue;
		}
		SetUp_Setting_Function(This_Setting);
	}
	await Clear_Unused_Save();

	// ReArrange Selectors
	for (const This_Category of Get_ALL_StyleShift_Items()) {
		if (This_Category.Selector == null) continue;
		This_Category.Selector = ReArrange_Selector(This_Category.Selector);
	}
	await Save_All();

	//------------------------------------------
	// Settings Page Specific UI
	//------------------------------------------
	if (In_Setting_Page) {
		Extension_Settings_UI.Create_UI();
	}
}

/*
-------------------------------------------------------
 Main Execution & Error Handling
-------------------------------------------------------
*/
try {
	Main_Run();
} catch (error) {
	Create_Error(error).then((Notification) => {
		Notification.Set_Title("StyleShift - Main run error");
	});
}

/*
-------------------------------------------------------
 Chrome Message Listener
-------------------------------------------------------
*/
chrome.runtime.onMessage.addListener(async function (message) {
	try {
		if (message == "Developer") {
			await Save("Developer_Mode", !(await Load("Developer_Mode")));
			Update_All_UI();
		}

		//----------------------------------------------
		// Actions only outside settings page
		//----------------------------------------------
		if (In_Setting_Page) return;

		if (message == "Customize") {
			Toggle_Customize();
		}

		if (message == "Setting") {
			Extension_Settings_UI.Toggle();
		}
	} catch (error) {
		Create_Error(error);
	}
});
