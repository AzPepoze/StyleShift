import { Apply_Drag, HSVtoRGB, ReArrange_Selector, RGBtoHSV } from "../Modules/NormalFunction";
import { Load, Load_Any, Load_Setting, Save, Save_All, Save_Any } from "../Modules/Save";
import { Update_Setting_Function } from "./Settings_Function";

let Main_Setting_UI = {
	["Button"]: async function (This_Setting) {
		let Frame = Settings_UI["Setting_Frame"](false, true);

		let [r, g, b] = This_Setting.color.split(",").map(Number);

		let BG_HSV = RGBtoHSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		let BG_Color = HSVtoRGB(BG_HSV);

		let BGT_HSV = RGBtoHSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		let BGT_Color = HSVtoRGB(BGT_HSV);

		let Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		let Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		let Border_Color = `${r + 150},${g + 150},${b + 150}`;

		let Button = document.createElement("div");
		Frame.appendChild(Button);
		if (This_Setting.id) Button.id = This_Setting.id;

		Button.className = "STYLESHIFT-Button";
		Button.textContent = This_Setting.name;

		Button.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		Button.style.color = `rgb(${Border_Color})`;

		if (This_Setting.click_Function) {
			Button.addEventListener("click", This_Setting.click_Function);
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

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			console.log(This_Setting);

			const Config_Frame = Settings_UI["Setting_Frame"](false, true);
			const Config_Button = await Settings_UI["Config_Button"](Config_Frame);
			Frame.append(Config_Button.Frame);
			Frame.append(Config_Frame);

			//-----------------------------------------------

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Id: "id",
			});

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Name: "name",
			}).then((value) => {
				value.Text_Editors["Name"].Additinal_OnChange(function (value) {
					Button.textContent = value;
				});
			});

			//-----------------------------------------------

			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "setup");
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "enable");
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "disable");
		}

		return { Frame, Button };
	},

	["Checkbox"]: async function (This_Setting) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false);
		Sub_Frame.setAttribute("settingtype", This_Setting.type);
		Frame.append(Sub_Frame);

		let Checkbox = document.createElement("input");
		Checkbox.type = "Checkbox";
		Checkbox.className = "STYLESHIFT-Checkbox";
		Sub_Frame.appendChild(Checkbox);

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name);
		Sub_Frame.appendChild(Setting_Name);

		async function Update_UI() {
			const value = await Load_Any(This_Setting.id);
			Checkbox.checked = value;
		}
		Update_UI();

		Checkbox.addEventListener("change", async function () {
			let value = Checkbox.checked;
			await Save_Any(This_Setting.id, value);
			Update_Setting_Function(This_Setting.id);
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			console.log(This_Setting);

			const Config_Frame = Settings_UI["Setting_Frame"](false, true);
			const Config_Button = await Settings_UI["Config_Button"](Config_Frame);
			Frame.append(Config_Button.Frame);
			Frame.append(Config_Frame);

			//-----------------------------------------------

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Id: "id",
			});

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Name: "name",
			}).then((value) => {
				value.Text_Editors["Name"].Additinal_OnChange(function (value) {
					Setting_Name.textContent = value;
				});
			});

			//-----------------------------------------------

			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "setup");
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "enable");
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "disable");
		}

		return Frame;
	},

	["Number_Slide"]: async function (This_Setting) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name, "center");
		Setting_Name.style.marginBottom = "20px";
		Frame.appendChild(Setting_Name);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false, { x: false, y: true });
		Sub_Frame.style.gap = "5px";
		Frame.append(Sub_Frame);

		let Number_Slide = Settings_UI["Number_Slide_UI"](Sub_Frame);

		let Number_Input = Settings_UI["Number_Input_UI"](Sub_Frame);

		//-------------------------------------

		async function Update_UI() {
			Number_Slide.Update_Number_Slide(
				This_Setting.min,
				This_Setting.max,
				This_Setting.step
			);
			const value = await Load_Any(This_Setting.id);
			Number_Slide.Number_Slide_UI.value = value;
			Number_Input.value = value;
		}
		await Update_UI();

		Number_Slide.Number_Slide_UI.addEventListener("change", async function () {
			let value = Number_Slide.Number_Slide_UI.value;
			Number_Input.value = value;

			await Save_Any(This_Setting.id, value);
			Update_Setting_Function(This_Setting.id);
		});

		Number_Input.addEventListener("change", async function () {
			let value: any = Number(Number_Input.value);
			Number_Input.value = value;
			Number_Slide.Number_Slide_UI.value = value;

			await Save_Any(This_Setting.id, value);
			Update_Setting_Function(This_Setting.id);
		});

		Number_Slide.Number_Slide_UI.addEventListener("input", async function () {
			if (!(await Load("Realtime"))) return;
			let value = Number_Slide.Number_Slide_UI.value;
			Number_Input.value = value;

			await Save_Any(This_Setting.id, value);
			Update_Setting_Function(This_Setting.id);
		});

		Number_Input.addEventListener("input", async function () {
			if (!(await Load("Realtime"))) return;
			let value: any = Number(Number_Input.value);
			Number_Input.value = value;
			Number_Slide.Number_Slide_UI.value = value;

			await Save_Any(This_Setting.id, value);
			Update_Setting_Function(This_Setting.id);
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			console.log(This_Setting);

			const Config_Frame = Settings_UI["Setting_Frame"](false, true);
			const Config_Button = await Settings_UI["Config_Button"](Config_Frame);
			Frame.append(Config_Button.Frame);
			Frame.append(Config_Frame);

			//-----------------------------------------------

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Id: "id",
			});

			await Settings_UI["Setting_Developer_Text_Editor"](Config_Frame, This_Setting, {
				Name: "name",
			}).then((value) => {
				value.Text_Editors["Name"].Additinal_OnChange(function (value) {
					Setting_Name.textContent = value;
				});
			});

			await Settings_UI["Setting_Developer_Text_Editor"](
				Config_Frame,
				This_Setting,
				{
					Min: "min",
					Max: "max",
					Step: "step",
				},
				Update_UI
			);

			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "var", ["css"]);
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "setup");
			Settings_UI["Setting_Developer_Frame"](Config_Frame, This_Setting, "update", [
				"function",
			]);
		}

		return Frame;
	},
};

let Advance_Setting_UI = {
	["Fill_Screen"]: function (Add_Background = true) {
		const Setting_BG = document.createElement("div");
		Setting_BG.className = "STYLESHIFT-FillScreen";

		if (!Add_Background) {
			Setting_BG.style.background = "transparent";
			Setting_BG.style.pointerEvents = "none";
		}

		return Setting_BG;
	},

	["Setting_Frame"]: function (Padding, Vertical, Center = { x: false, y: false }) {
		let Frame = document.createElement("div");
		Frame.className = "STYLESHIFT-Setting-Frame";

		if (!Padding) {
			Frame.style.padding = "0px";
		}

		if (Vertical) {
			Frame.style.flexDirection = "column";
		} else {
			Frame.style.flexDirection = "row";
		}

		if (Center.x) {
			Frame.style.justifyContent = "center";
		}
		if (Center.y) {
			Frame.style.alignItems = "center";
		}

		return Frame;
	},

	["Text_Editor"]: function (OBJ, key) {
		let Text_Editor = document.createElement("textarea");
		Text_Editor.className = "STYLESHIFT-Text-Editor";
		Text_Editor.value = OBJ[key] || "";

		let Additinal_OnChange: Function = null;
		let ReArrange_Value: Function = null;

		let OnChange = async function (Value) {
			OBJ[key] = Value;
			Save_All();
			if (Additinal_OnChange) Additinal_OnChange(Value);
		};

		Text_Editor.addEventListener("input", function () {
			OnChange(Text_Editor.value);
		});

		Text_Editor.addEventListener("blur", async function () {
			let Value = Text_Editor.value;
			if (ReArrange_Value) {
				console.log("Before", Value);
				Value = await ReArrange_Value(Value);
				console.log("After", Value);
				Text_Editor.value = Value;
			}
			OnChange(Text_Editor.value);
		});

		return {
			Text_Editor: Text_Editor,
			OnChange: function (callback) {
				OnChange = callback;
			},
			Additinal_OnChange: function (callback) {
				Additinal_OnChange = callback;
			},
			ReArrange_Value: function (callback) {
				ReArrange_Value = callback;
			},
		};
	},

	["Setting_Name"]: function (text, position: "left" | "center" | "right" = "left") {
		let Name = document.createElement("div");
		Name.className = "STYLESHIFT-Text-Main-Description";
		Name.textContent = text;

		switch (position) {
			case "left":
				Name.style.textAlign = "start";
				break;

			case "center":
				Name.style.textAlign = "center";
				break;

			case "right":
				Name.style.textAlign = "end";
				break;

			default:
				break;
		}

		return Name;
	},

	["Drag"]: function (Target) {
		let Drag = document.createElement("div");
		Drag.className = "STYLESHIFT-Drag-Top STYLESHIFT-Glow-Hover";
		Drag.innerHTML = "=";

		Apply_Drag(Drag, Target);

		return Drag;
	},
	["Close"]: function () {
		let Close = document.createElement("div");
		Close.className = "STYLESHIFT-Close STYLESHIFT-Glow-Hover";
		Close.innerHTML = "X";

		return Close;
	},

	["Title"]: function (Category) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Category-Title";
		Title.innerHTML = Category;

		return Title;
	},
	["Left-Title"]: function (Category) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Left-Category-Title";
		Title.innerHTML = Category;

		return Title;
	},

	["Sub_Title"]: function (Text) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Sub-Title";
		Title.innerHTML = Text;

		return Title;
	},

	["Collapsed_Button"]: async function (ButtonName, RBG, TargetElement: HTMLElement) {
		TargetElement.setAttribute("STYLESHIFT-All-Transition", "");
		TargetElement.className += " STYLESHIFT-Collapse";

		TargetElement.style.maxHeight = "100%";
		let Save_Style = TargetElement.getAttribute("style");

		function Hide_Function() {
			TargetElement.style.maxHeight = "0px";
			TargetElement.style.padding = "0px";
			TargetElement.style.opacity = "0";
		}
		function Show_Function() {
			console.log(Save_Style);
			TargetElement.setAttribute("style", Save_Style);
		}

		let Collapsed = true;
		Hide_Function();

		let Button = await Settings_UI["Button"]({
			name: ButtonName,
			color: RBG,
			click_Function: function () {
				if (Collapsed) {
					Show_Function();
				} else {
					Hide_Function();
				}
				Collapsed = !Collapsed;
			},
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

		let Updating_Position = true;
		let Update_Position_Function = function () {
			if (!Updating_Position) return;
			const targetRect = target.getBoundingClientRect();
			dropdownContainer.style.width = `${targetRect.width}px`;

			const spaceBelow = window.innerHeight - targetRect.bottom;
			const spaceAbove = targetRect.top;

			if (spaceBelow >= dropdownContainer.offsetHeight) {
				dropdownContainer.style.top = `${targetRect.bottom}px`;
			} else if (spaceAbove >= dropdownContainer.offsetHeight) {
				dropdownContainer.style.top = `${
					targetRect.top - dropdownContainer.offsetHeight
				}px`;
			} else {
				// Default to positioning below if neither space is sufficient
				dropdownContainer.style.top = `${targetRect.bottom}px`;
			}
			dropdownContainer.style.left = `${targetRect.left}px`;
			requestAnimationFrame(Update_Position_Function);
		};
		Update_Position_Function();

		function Remove_DropDown() {
			Updating_Position = false;
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
				timeout = setTimeout(() => {
					Remove_DropDown();
				}, 2000);

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

	["Number_Slide_UI"]: function (Parent) {
		let Number_Slide_UI = document.createElement("input");
		Number_Slide_UI.type = "range";
		Number_Slide_UI.className = "STYLESHIFT-Number_Slide";
		Parent.appendChild(Number_Slide_UI);

		function Update_Number_Slide(min: any = 0, max: any = 100, step: any = 1) {
			Number_Slide_UI.min = min;
			Number_Slide_UI.max = max;
			Number_Slide_UI.step = step;
		}

		return { Number_Slide_UI, Update_Number_Slide };
	},

	["Number_Input_UI"]: function (Parent) {
		let Number_Input_UI = document.createElement("input");
		Number_Input_UI.type = "number";
		Number_Input_UI.className = "STYLESHIFT-Number_Input";
		Parent.appendChild(Number_Input_UI);
		return Number_Input_UI;
	},

	["Setting_Developer_Text_Editor"]: async function (
		Parent: HTMLElement,
		This_Setting,
		this_property,
		Update_UI = function () {}
	) {
		const Main_UI = await Create_Setting_UI_Element("Setting_Frame", true, true);
		Main_UI.className += " STYLESHIFT-Config-Sub-Frame";

		let Text_Editors: any = {};

		for (const [Title, Property] of Object.entries(this_property)) {
			Main_UI.append(await Create_Setting_UI_Element("Sub_Title", Title));
			const Setting_Developer_Text_Editor = await Create_Setting_UI_Element(
				"Text_Editor",
				This_Setting,
				Property
			);
			Setting_Developer_Text_Editor.Additinal_OnChange(function () {
				Update_UI();
			});
			Main_UI.append(Setting_Developer_Text_Editor.Text_Editor);
			Text_Editors[Title] = Setting_Developer_Text_Editor;
		}

		Parent.appendChild(Main_UI);

		return { Main_UI, Text_Editors };
	},

	["Setting_Developer_Frame"]: async function (
		Parent,
		This_Setting,
		RunType,
		ext_array = ["function", "css"]
	) {
		let This_RunType_Name = RunType;
		let RBG = "200,200,200";

		switch (RunType) {
			case "var":
				This_RunType_Name = "Variable";
				RBG = "255,167,0";
				break;

			case "setup":
				This_RunType_Name = "Setup / Auto run";
				RBG = "50,50,255";
				break;

			case "enable":
				This_RunType_Name = "Enable";
				RBG = "50,255,50";
				break;

			case "disable":
				This_RunType_Name = "Disable";
				RBG = "255,50,50";
				break;

			case "update":
				This_RunType_Name = "On Change";
				RBG = "255,0,245";
				break;

			default:
				break;
		}

		let [r, g, b] = RBG.split(",").map(Number);

		let BG_HSV = RGBtoHSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		let BG_Color = HSVtoRGB(BG_HSV);

		let BGT_HSV = RGBtoHSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		let BGT_Color = HSVtoRGB(BGT_HSV);

		let Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		let Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		let Border_Color = `${r + 150},${g + 150},${b + 150}`;

		let This_Frame = Settings_UI["Setting_Frame"](true, true);
		This_Frame.style.paddingBottom = "10px";
		This_Frame.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		This_Frame.style.border = `rgb(${Border_Color}) 1px solid`;

		let Collapsed_Button = await Settings_UI["Collapsed_Button"](
			This_RunType_Name,
			RBG,
			This_Frame
		);
		Collapsed_Button.Button.style.borderBottom = "solid 1px white";

		for (const ext of ext_array) {
			let This_Type_Name;

			switch (ext) {
				case "function":
					This_Type_Name = "JS";
					break;

				case "css":
					This_Type_Name = "CSS";
					break;

				default:
					break;
			}

			This_Frame.append(Settings_UI["Sub_Title"](This_Type_Name));
			let Editor = Settings_UI["Text_Editor"](This_Setting, RunType + "_" + ext);
			This_Frame.append(Editor.Text_Editor);
			Editor.Text_Editor.style.height = "100px";
		}

		Parent.append(Collapsed_Button.Frame);
		Parent.append(This_Frame);

		return This_Frame;
	},

	["Selector_Text_Editor"]: async function (Parent, Selector_Value) {
		let Selector_Text_Editor = await Settings_UI["Text_Editor"](Selector_Value, "Selector");
		Selector_Text_Editor.Text_Editor.className += " STYLESHIFT-Selector-Text-Editor";
		Selector_Text_Editor.ReArrange_Value(function (value: string) {
			return ReArrange_Selector(value);
		});
		Parent.append(Selector_Text_Editor.Text_Editor);
		return Selector_Text_Editor;
	},

	["Config_Button"]: async function (Config_Frame) {
		const Config_Button = await Settings_UI["Collapsed_Button"](
			"Edit config",
			"200,200,200",
			Config_Frame
		);
		Config_Button.Button.className += " STYLESHIFT-Config-Button";
		return Config_Button;
	},

	["Add_Setting_Button"]: async function () {
		let Adding;

		let Add_Button = await Settings_UI["Button"]({
			name: "+",
			color: "255,255,255",
			click_Function: async function () {
				if (Adding) {
					Adding.Cancel();
					return;
				}
				Adding = Settings_UI["Show_Dropdown"](Object.keys(Main_Setting_UI), Add_Button);
				if (await Adding.Selection) {
					console.log(Adding.Selection);
				}
				Adding = null;
			},
		});

		Add_Button.Button.style.justifyContent = "center";
		return Add_Button;
	},
};

let Settings_UI = {
	...Main_Setting_UI,
	...Advance_Setting_UI,
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
