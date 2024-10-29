import { Apply_Drag, HSVtoRGB, RGBtoHSV } from "../Modules/NormalFunction";
import { Load, Save, Save_All } from "../Modules/Save";
import { Update_Setting_Function } from "./Settings_Function";

var Add_Setting_UI = {
	["Button"]: function (ButtonName, RBG, WhenCLick) {
		var [r, g, b] = RBG.split(",").map(Number);

		var BG_HSV = RGBtoHSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		var BG_Color = HSVtoRGB(BG_HSV);

		var BGT_HSV = RGBtoHSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		var BGT_Color = HSVtoRGB(BGT_HSV);

		var Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		var Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		var Border_Color = `${r + 150},${g + 150},${b + 150}`;

		var Button = document.createElement("div");

		Button.className = "STYLESHIFT-Button";
		Button.innerHTML = ButtonName;

		Button.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		Button.style.color = `rgb(${Border_Color})`;

		if (WhenCLick) {
			Button.addEventListener("click", WhenCLick);
			Button.addEventListener("click", function () {
				Button.style.transform = "scale(0.95)";
				setTimeout(() => {
					Button.style.transform = "";
				}, 100);
			});
		}

		requestAnimationFrame(function () {
			Button.style.borderColor = `rgb(${Border_Color})`;
		});

		return Button;
	},

	["Checkbox"]: async function (This_Setting) {
		var Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		var Sub_Frame = Settings_UI["Setting_Frame"](false, false);
		Sub_Frame.setAttribute("settingtype", This_Setting.type);
		Frame.append(Sub_Frame);

		var Checkbox = document.createElement("input");
		Checkbox.type = "Checkbox";
		Checkbox.className = "STYLESHIFT-Checkbox";
		Sub_Frame.appendChild(Checkbox);

		var Main_Description = Settings_UI["Setting_Main_Description"](This_Setting.main_des);
		Sub_Frame.appendChild(Main_Description);

		function Update_UI(value) {
			Checkbox.checked = value;
		}
		Update_UI(await Load(This_Setting.id));

		Checkbox.addEventListener("change", async function () {
			var Current_Value = Checkbox.checked;
			await Save(This_Setting.id, Current_Value);
			Update_Setting_Function(This_Setting.id);
		});

		//-------------------------------------

		if (await Load("Developer_Mode")) {
			console.log(This_Setting);

			var Config_Frame = Settings_UI["Setting_Frame"](false, true);
			var Config_Button = Settings_UI["Collapsed_Button"](
				"Edit config",
				"200,200,200",
				Config_Frame
			);
			Config_Button.className += " STYLESHIFT-Config-Button";
			Frame.append(Config_Button);
			Frame.append(Config_Frame);

			Settings_UI["Setting_Developer_Frame"](
				Config_Frame,
				This_Setting,
				"Setup / Auto run",
				"50,50,255",
				"setup"
			);
			Settings_UI["Setting_Developer_Frame"](
				Config_Frame,
				This_Setting,
				"Enable",
				"50,255,50",
				"enable"
			);
			Settings_UI["Setting_Developer_Frame"](
				Config_Frame,
				This_Setting,
				"Disable",
				"255,50,50",
				"disable"
			);
		}

		return Frame;
	},
};

var Un_Add_Setting_UI = {
	["Setting_Frame"]: function (Padding, Vertical) {
		var Frame = document.createElement("div");
		Frame.className = "STYLESHIFT-Setting-Frame";

		if (!Padding) {
			Frame.style.padding = "0px";
		}

		if (Vertical) {
			Frame.style.flexDirection = "column";
		} else {
			Frame.style.flexDirection = "row";
		}

		return Frame;
	},

	["Text_Editor"]: function (OBJ, key) {
		var Text_Editor = document.createElement("textarea");
		Text_Editor.className = "STYLESHIFT-Text-Editor";
		Text_Editor.value = OBJ[key] || "";

		var OnChange = function (Value) {
			OBJ[key] = Value;
			Save_All();
		};

		Text_Editor.addEventListener("input", function () {
			OnChange(Text_Editor.value);
		});

		Text_Editor.addEventListener("blur", function () {
			OnChange(Text_Editor.value);
		});

		return {
			Text_Editor: Text_Editor,
			OnChange: function (callback) {
				OnChange = callback;
			},
		};
	},

	["Setting_Main_Description"]: function (text) {
		var Main_Description = document.createElement("div");
		Main_Description.className = "STYLESHIFT-Text-Main-Description";
		Main_Description.textContent = text;
		return Main_Description;
	},

	["Setting_Developer_Frame"]: function (Parent, This_Setting, Title, RBG, RunType) {
		var [r, g, b] = RBG.split(",").map(Number);

		var BG_HSV = RGBtoHSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		var BG_Color = HSVtoRGB(BG_HSV);

		var BGT_HSV = RGBtoHSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		var BGT_Color = HSVtoRGB(BGT_HSV);

		var Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		var Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		var Border_Color = `${r + 150},${g + 150},${b + 150}`;

		var This_Frame = Settings_UI["Setting_Frame"](true, true);
		This_Frame.style.paddingBottom = "10px";
		This_Frame.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		This_Frame.style.border = `rgb(${Border_Color}) 1px solid`;

		var Collapsed_Button = Settings_UI["Collapsed_Button"](Title, RBG, This_Frame);
		Collapsed_Button.style.borderBottom = "solid 1px white";

		//JS

		This_Frame.append(Settings_UI["Sub_Title"]("JS"));
		var JS_Editor = Settings_UI["Text_Editor"](This_Setting, RunType + "_function");
		This_Frame.append(JS_Editor.Text_Editor);

		//CSS

		This_Frame.append(Settings_UI["Sub_Title"]("CSS"));
		var CSS_Editor = Settings_UI["Text_Editor"](This_Setting, RunType + "_css");
		This_Frame.append(CSS_Editor.Text_Editor);

		//

		Parent.append(Collapsed_Button);
		Parent.append(This_Frame);

		return This_Frame;
	},

	["Drag"]: function (Target) {
		var Drag = document.createElement("div");
		Drag.className = "STYLESHIFT-Drag-Top STYLESHIFT-Glow-Hover";
		Drag.innerHTML = "=";

		Apply_Drag(Drag, Target);

		return Drag;
	},
	["Close"]: function () {
		var Close = document.createElement("div");
		Close.className = "STYLESHIFT-Close STYLESHIFT-Glow-Hover";
		Close.innerHTML = "X";

		return Close;
	},

	["Title"]: function (Category) {
		var Title = document.createElement("div");
		Title.className = "STYLESHIFT-Category-Title";
		Title.innerHTML = Category;

		return Title;
	},
	["Sub_Title"]: function (Text) {
		var Title = document.createElement("div");
		Title.className = "STYLESHIFT-Sub-Title";
		Title.innerHTML = Text;

		return Title;
	},

	["Collapsed_Button"]: function (ButtonName, RBG, TargetElement: HTMLElement) {
		TargetElement.setAttribute("STYLESHIFT-All-Transition", "");
		TargetElement.className += " STYLESHIFT-Collapse";

		TargetElement.style.maxHeight = "100%";
		var Save_Style = TargetElement.getAttribute("style");

		function Hide_Function() {
			TargetElement.style.maxHeight = "0px";
			TargetElement.style.padding = "0px";
			TargetElement.style.opacity = "0";
		}
		function Show_Function() {
			console.log(Save_Style);
			TargetElement.setAttribute("style", Save_Style);
		}

		var Collapsed = true;
		Hide_Function();

		var Button = Settings_UI["Button"](ButtonName, RBG, function name() {
			if (Collapsed) {
				Show_Function();
			} else {
				Hide_Function();
			}
			Collapsed = !Collapsed;
		});

		return Button;
	},

	["Show_Dropdown"]: function (options, target) {
		const dropdownContainer = Settings_UI["Setting_Frame"](false, true);
		console.log(dropdownContainer);
		dropdownContainer.className += " STYLESHIFT-DropDown-Container STYLESHIFT-Main";

		// Populate dropdown with options

		// Add elements to the DOM
		document.body.appendChild(dropdownContainer);

		// Set dropdown width to match the target
		const targetRect = target.getBoundingClientRect();
		dropdownContainer.style.width = `${targetRect.width}px`;

		// Calculate space below and above the target
		const spaceBelow = window.innerHeight - targetRect.bottom;
		const spaceAbove = targetRect.top;

		// Position dropdown below or above the target
		if (spaceBelow >= dropdownContainer.offsetHeight) {
			dropdownContainer.style.top = `${targetRect.bottom}px`;
		} else if (spaceAbove >= dropdownContainer.offsetHeight) {
			dropdownContainer.style.top = `${targetRect.top - dropdownContainer.offsetHeight}px`;
		} else {
			// Default to positioning below if neither space is sufficient
			dropdownContainer.style.top = `${targetRect.bottom}px`;
		}
		dropdownContainer.style.left = `${targetRect.left}px`;

		function Remove_DropDown() {
			dropdownContainer.remove();
			dropdownContainer.dispatchEvent(new Event("Remove_DropDown"));
		}

		// Auto remove when mouse moves far away
		let timeout;

		dropdownContainer.addEventListener("mouseenter", () => {
			clearTimeout(timeout);
		});
		return {
			Selection: new Promise((resolve) => {
				dropdownContainer.addEventListener("mouseleave", () => {
					timeout = setTimeout(() => {
						Remove_DropDown();
					}, 1000);
				});

				dropdownContainer.addEventListener("Remove_DropDown", function () {
					resolve(null);
				});

				options.forEach((option) => {
					const listItem = document.createElement("div");
					listItem.className = "STYLESHIFT-DropDown-Items STYLESHIFT-Glow-Hover";
					listItem.textContent = option;
					listItem.addEventListener("click", () => {
						resolve(option); // Return the selected option
						dropdownContainer.remove();
					});
					dropdownContainer.appendChild(listItem);
				});
			}),
			Cancel: Remove_DropDown,
		};
	},

	["Add_Setting_Button"]: function () {
		var Adding;

		var Add_Button = Settings_UI["Button"]("+", "255,255,255", async function () {
			if (Adding) {
				Adding.Cancel();
				return;
			}
			Adding = Settings_UI["Show_Dropdown"](Object.keys(Add_Setting_UI), Add_Button);
			if (await Adding.Selection) {
				console.log(Adding.Selection);
			}
			Adding = null;
		});
		Add_Button.style.justifyContent = "center";
		return Add_Button;
	},
};

var Settings_UI = {
	...Add_Setting_UI,
	...Un_Add_Setting_UI,
};

type UI_Type = keyof typeof Settings_UI;
type SettingsUIParams<T extends keyof typeof Settings_UI> = Parameters<(typeof Settings_UI)[T]>;

type SettingsUIReturnType<T extends UI_Type> = ReturnType<(typeof Settings_UI)[T]>;

export async function Create_Setting_UI_Element<T extends UI_Type>(
	type: T,
	...RestArgs: SettingsUIParams<T>
): Promise<SettingsUIReturnType<T>> {
	//@ts-ignore
	return (await Settings_UI[type](...RestArgs)) as SettingsUIReturnType<T>;
}
