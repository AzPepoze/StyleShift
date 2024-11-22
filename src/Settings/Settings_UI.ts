import { Add_Setting, color_obj, Remove_Setting, Setting } from "../Items_Editor/StyleShift_Items";
import {
	Color_OBJ_to_Usable_OBJ,
	RGB_to_Color_OBJ,
	Run_Text_Script,
} from "../Modules/Extension_Main";
import {
	Apply_Drag,
	deepClone,
	GetDocumentBody,
	HEX_to_RBG,
	HSV_to_RGB,
	ReArrange_Selector,
	RGB_to_HSV,
} from "../Modules/NormalFunction";
import { Load, Load_Any, Save_All, Save_Any } from "../Modules/Save";
import { Update_Setting_Function } from "./Settings_Function";
// import * as Monaco from "monaco-editor";

async function Set_And_Save(This_Setting, value) {
	// This_Setting.value = value;
	// await Save_All();
	await Save_Any(This_Setting.id, value);
}

let Main_Setting_UI = {
	["Text"]: async function (This_Setting: Partial<Extract<Setting, { type: "Text" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Text = document.createElement("div");
		Text.className = "STYLESHIFT-Text-Main-Description";
		Text.innerHTML = This_Setting.html;

		Frame.append(Frame);

		//-------------------------------------

		function Update_UI() {
			Text.style.fontSize = This_Setting.font_size + "px";
			switch (This_Setting.text_align) {
				case "left":
					Text.style.textAlign = "start";
					break;

				case "center":
					Text.style.textAlign = "center";
					break;

				case "right":
					Text.style.textAlign = "end";
					break;

				default:
					break;
			}
		}

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Text: "text",
				},
				Update_UI
			);
		}

		return Frame;
	},

	["Button"]: async function (This_Setting: Partial<Extract<Setting, { type: "Button" }>>) {
		This_Setting.font_size = Number(This_Setting.font_size);

		let Frame = Settings_UI["Setting_Frame"](false, true);

		//-------------------------------------

		let Button = document.createElement("div");
		Button.className = "STYLESHIFT-Button";
		Button.style.borderRadius = "20px";

		Frame.appendChild(Button);

		//---------------------------------------

		const Image = document.createElement("img");
		Image.className = "STYLESHIFT-Button-Logo";

		Button.append(Image);

		//---------------------------------------

		const Button_Text = document.createElement("div");
		Button_Text.className = "STYLESHIFT-Button-Text";

		Button.append(Button_Text);

		//-------------------------------------

		Button.addEventListener("click", function () {
			if (This_Setting.click_function == null) return;

			if (typeof This_Setting.click_function == "string") {
				console.log(This_Setting.click_function);
				Run_Text_Script(This_Setting.click_function);
			} else {
				This_Setting.click_function();
			}
		});

		//---------------------------------------

		function Update_UI() {
			Frame.id = This_Setting.id || "";

			//-----------------------------------
			let { r, g, b } = This_Setting.color.RGB;

			let BG_HSV = RGB_to_HSV({ r, g, b });
			BG_HSV.s /= 2;
			BG_HSV.v /= 3;
			let BG_Color = HSV_to_RGB(BG_HSV);

			let BGT_HSV = RGB_to_HSV({ r, g, b });
			BGT_HSV.s /= 1.5;
			BGT_HSV.v /= 2;
			let BGT_Color = HSV_to_RGB(BGT_HSV);

			let Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
			let Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
			let Border_Color = `${r + 150},${g + 150},${b + 150}`;

			Button.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;

			requestAnimationFrame(function () {
				Button.style.borderColor = `rgb(${Border_Color})`;
			});

			//------------------------------------

			if (This_Setting.text_align == null) This_Setting.text_align = "left";

			Button_Text.style.justifyContent = This_Setting.text_align;
			Button_Text.style.color = `rgb(${Border_Color})`;
			Button_Text.textContent = This_Setting.name || "";
			Button_Text.style.fontSize = String(This_Setting.font_size) + "px" || "10px";

			//------------------------------------

			if (This_Setting.icon) {
				Image.style.display = "";
				Image.src = This_Setting.icon;
			} else {
				Image.style.display = "none";
			}

			//------------------------------------

			if (This_Setting.id) Button.id = This_Setting.id;
		}

		Update_UI();

		//-------------------------------------

		Button.addEventListener("click", function () {
			Button.style.transform = "scale(0.95)";
			setTimeout(() => {
				Button.style.transform = "";
			}, 100);
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			Frame.style.padding = "10px";

			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Button_Text],
					Description: "description",

					Icon: "icon",
					["Text align"]: ["text_align", ["left", "center", "right"]],
					Color: "color",
					["Font size"]: "font_size",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
				click: 3,
			});
		} else {
			Frame.style.background = "transparent";
		}

		return { Frame, Button };
	},

	["Checkbox"]: async function (This_Setting: Partial<Extract<Setting, { type: "Checkbox" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false);
		Sub_Frame.setAttribute("settingtype", This_Setting.type);
		Frame.append(Sub_Frame);

		//-------------------------------------

		let Checkbox = document.createElement("input");
		Checkbox.type = "Checkbox";
		Checkbox.className = "STYLESHIFT-Checkbox";
		Sub_Frame.appendChild(Checkbox);

		let Setting_Name = Settings_UI["Setting_Name"]("");
		Sub_Frame.appendChild(Setting_Name);

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			Setting_Name.textContent = This_Setting.name;

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Checkbox.checked = value;
		}
		Update_UI();

		//-------------------------------------

		async function Update_Value(value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
			}
		}

		//-------------------------------------

		Checkbox.addEventListener("change", async function () {
			let value = Checkbox.checked;
			Update_Value(value);
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
				setup: 0,
				enable: 0,
				disable: 0,
			});
		}

		return Frame;
	},

	["Number_Slide"]: async function (
		This_Setting: Partial<Extract<Setting, { type: "Number_Slide" }>>
	) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Setting_Name;
		if (This_Setting.name) {
			Setting_Name = Settings_UI["Setting_Name"](This_Setting.name, "center");
			Setting_Name.style.marginBottom = "20px";
			Frame.appendChild(Setting_Name);
		}

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false, { x: false, y: true });
		Sub_Frame.style.gap = "5px";
		Frame.append(Sub_Frame);

		let Number_Slide = Settings_UI["Number_Slide_UI"](Sub_Frame);

		let Number_Input = Settings_UI["Number_Input_UI"](Sub_Frame);

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			Number_Slide.Update_Number_Slide(
				This_Setting.min,
				This_Setting.max,
				This_Setting.step
			);

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Number_Slide.Number_Slide_UI.value = String(value);
			Number_Input.value = String(value);
		}
		await Update_UI();

		//-------------------------------------

		async function Update_Value(value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
				if (typeof This_Setting.update_function === "function") {
					This_Setting.update_function(value);
				}
			}
		}

		//-------------------------------------

		Number_Slide.Number_Slide_UI.addEventListener("change", async function () {
			let value: any = Number(Number_Slide.Number_Slide_UI.value);
			Number_Input.value = value;

			Update_Value(value);
		});

		Number_Input.addEventListener("change", async function () {
			let value: any = Number(Number_Input.value);
			Number_Input.value = value;
			Number_Slide.Number_Slide_UI.value = value;

			Update_Value(value);
		});

		Number_Slide.Number_Slide_UI.addEventListener("input", async function () {
			if (!(await Load("Realtime_Extension"))) return;
			let value: any = Number(Number_Slide.Number_Slide_UI.value);
			Number_Input.value = value;

			Update_Value(value);
		});

		Number_Input.addEventListener("input", async function () {
			if (!(await Load("Realtime_Extension"))) return;
			let value: any = Number(Number_Input.value);
			Number_Input.value = value;
			Number_Slide.Number_Slide_UI.value = value;

			Update_Value(value);
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",

					Min: "min",
					Max: "max",
					Step: "step",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
				var: 2,
				setup: 0,
				update: 3,
			});
		}

		return Frame;
	},

	["Dropdown"]: async function (This_Setting: Partial<Extract<Setting, { type: "Dropdown" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//------------------------------

		let SubFrame = Settings_UI["Setting_Frame"](false, false);
		SubFrame.className += " STYLESHIFT-Dropdown-Frame";
		Frame.append(SubFrame);

		//------------------------------

		let Dropdown = await Settings_UI["Button"]({
			name: "",
			color: RGB_to_Color_OBJ(255, 255, 255),
			text_align: "center",
		});
		Dropdown.Button.className += " STYLESHIFT-Dropdown";
		SubFrame.appendChild(Dropdown.Frame);

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name);
		SubFrame.appendChild(Setting_Name);

		//------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Dropdown.Button.textContent = value;
		}
		Update_UI();

		//------------------------------

		async function Update_Value(old_value, value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
				This_Setting.value = value;

				if (typeof This_Setting.options[old_value].disable_function == "function") {
					This_Setting.options[old_value].disable_function();
				}

				if (typeof This_Setting.options[value].enable_function == "function") {
					This_Setting.options[value].enable_function();
				}
			}
		}

		//------------------------------

		let Current_Dropdown = null;

		Dropdown.Button.addEventListener("click", async function () {
			if (Current_Dropdown) {
				Current_Dropdown.Cancel();
				return;
			}

			//-----------------------

			console.log(This_Setting.options);
			Current_Dropdown = Settings_UI["Show_Dropdown"](
				Object.keys(This_Setting.options),
				Dropdown.Button
			);

			//-----------------------

			const old_value = This_Setting.id
				? await Load_Any(This_Setting.id)
				: This_Setting.value;
			const value = await Current_Dropdown.Selection;
			Current_Dropdown = null;

			//-----------------------

			if (!value) return;

			//-----------------------

			Update_Value(old_value, value);

			Update_UI();
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
				setup: 0,
				enable: 0,
				disable: 0,
			});
		}

		return Frame;
	},

	["Color"]: async function (This_Setting: Partial<Extract<Setting, { type: "Color" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true, { x: false, y: true });

		//-------------------------------------

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name, "center");
		Frame.appendChild(Setting_Name);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false);
		Sub_Frame.setAttribute("settingtype", This_Setting.type);
		Frame.append(Sub_Frame);

		//-------------------------------------

		let Color = document.createElement("input");
		Color.type = "color";
		Color.className = "STYLESHIFT-Color";
		Sub_Frame.appendChild(Color);

		//-------------------------------------

		let Opacity: HTMLDivElement;
		if (This_Setting.show_alpha_slider != false) {
			Opacity = await Settings_UI["Number_Slide"]({
				min: 0,
				max: 100,
				step: 1,
				value: This_Setting.value.Alpha,
				update_function: function (value) {
					Update_Value("Alpha", value / 100);
				},
			});
			Opacity.style.width = "-webkit-fill-available";
			Sub_Frame.appendChild(Opacity);
		}

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			let Color_Usable_OBJ = Color_OBJ_to_Usable_OBJ(value);

			Color.value = String(Color_Usable_OBJ.HEX);
		}
		Update_UI();

		//-------------------------------------

		async function Update_Value(type: "RGB" | "Alpha", value) {
			console.log(value);
			if (This_Setting.id) {
				let Color_OBJ = deepClone(await Load_Any(This_Setting.id));
				Color_OBJ[type] = value;
				await Set_And_Save(This_Setting, Color_OBJ);
				Update_Setting_Function(This_Setting.id);
			} else {
				This_Setting.value[type] = value;
				if (typeof This_Setting.update_function === "function") {
					This_Setting.update_function(This_Setting.value);
				}
			}
		}

		//-------------------------------------

		Color.addEventListener("change", async function () {
			Update_Value("RGB", HEX_to_RBG(Color.value));
		});

		Color.addEventListener("input", async function () {
			if (!(await Load_Any("Realtime_Extension"))) return;

			Update_Value("RGB", HEX_to_RBG(Color.value));
		});

		//-------------------------------------

		if (This_Setting.Editable && (await Load("Developer_Mode"))) {
			const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
				.Config_Frame;

			//-----------------------------------------------

			await Settings_UI["Config_Section_1"](
				Config_Frame,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
				setup: 0,
				enable: 0,
				disable: 0,
			});
		}

		return Frame;
	},

	// ["File"]: async function (This_Setting: Partial<Extract<Setting, { type: "File" }>>) {
	// 	let Frame = Settings_UI["Setting_Frame"](true, true);

	// 	//-------------------------------------

	// 	let Sub_Frame = Settings_UI["Setting_Frame"](false, false);
	// 	Sub_Frame.setAttribute("settingtype", This_Setting.type);
	// 	Frame.append(Sub_Frame);

	// 	//-------------------------------------

	// 	let Checkbox = document.createElement("input");
	// 	Checkbox.type = "Checkbox";
	// 	Checkbox.className = "STYLESHIFT-Checkbox";
	// 	Sub_Frame.appendChild(Checkbox);

	// 	let Setting_Name = Settings_UI["Setting_Name"]("");
	// 	Sub_Frame.appendChild(Setting_Name);

	// 	//-------------------------------------

	// 	async function Update_UI() {
	// 		Frame.id = This_Setting.id || "";

	// 		Setting_Name.textContent = This_Setting.name;

	// 		let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
	// 		Checkbox.checked = value;
	// 	}
	// 	Update_UI();

	// 	//-------------------------------------

	// 	async function Update_Value(value) {
	// 		if (This_Setting.id) {
	// 			await Set_And_Save(This_Setting, value);
	// 			Update_Setting_Function(This_Setting.id);
	// 		} else {
	// 		}
	// 	}

	// 	//-------------------------------------

	// 	Checkbox.addEventListener("change", async function () {
	// 		let value = Checkbox.checked;
	// 		Update_Value(value);
	// 	});

	// 	//-------------------------------------

	// 	if (This_Setting.Editable && (await Load("Developer_Mode"))) {
	// 		const Config_Frame = (await Settings_UI["Config_UI"](Frame, This_Setting))
	// 			.Config_Frame;

	// 		//-----------------------------------------------

	// 		await Settings_UI["Config_Section_1"](
	// 			Config_Frame,
	// 			This_Setting,
	// 			{
	// 				Id: "id",
	// 				Name: ["name", Setting_Name],
	// 				Description: "description",
	// 			},
	// 			Update_UI
	// 		);

	// 		//-----------------------------------------------

	// 		await Settings_UI["Config_Section_2"](Config_Frame, This_Setting, {
	// 			setup: 0,
	// 			enable: 0,
	// 			disable: 0,
	// 		});
	// 	}

	// 	return Frame;
	// },
};

const Advance_Setting_UI = {
	["Fill_Screen"]: function (fill_bg: boolean = true) {
		const Fill_Screen = document.createElement("div");
		Fill_Screen.className = "STYLESHIFT-FillScreen";

		if (fill_bg == false) {
			Fill_Screen.style.background = "transparent";
			Fill_Screen.style.pointerEvents = "none";
		}

		return Fill_Screen;
	},

	["Setting_Frame"]: function (
		padding: boolean = true,
		vertical: boolean = true,
		center: { x: boolean; y: boolean } = { x: false, y: false }
	) {
		const Frame = document.createElement("div");
		Frame.className = "STYLESHIFT-Setting-Frame";

		if (!padding) {
			Frame.style.padding = "0px";
		}

		if (vertical) {
			Frame.style.flexDirection = "column";
		} else {
			Frame.style.flexDirection = "row";
		}

		if (center.x) {
			Frame.style.justifyContent = "center";
		}

		if (center.y) {
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
			if (Additinal_OnChange) {
				console.log(Additinal_OnChange);
				Additinal_OnChange(Value);
			}
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

	// ["Code_Editor"]: async function (OBJ, key, language) {
	// 	const Frame = document.createElement("div");
	// 	Frame.style.width = "100%";
	// 	Frame.style.height = "200px";
	// 	Frame.style.position = "relative";
	// 	Frame.style.background = "black";

	// 	// await new Promise((resolve, reject) => {
	// 	// 	requestAnimationFrame(function () {
	// 	// 		resolve(true);
	// 	// 	});
	// 	// });

	// 	let Code_Editor = Monaco.editor.create(Frame, {
	// 		value: OBJ[key] || "",
	// 		language: language || "javascript",
	// 		theme: "vs-dark",
	// 		automaticLayout: true,
	// 	});

	// 	let Additinal_OnChange: Function = null;
	// 	let ReArrange_Value: Function = null;

	// 	let OnChange = async function (Value) {
	// 		OBJ[key] = Value;
	// 		Save_All();
	// 		if (Additinal_OnChange) {
	// 			console.log(Additinal_OnChange);
	// 			Additinal_OnChange(Value);
	// 		}
	// 	};

	// 	Code_Editor.onKeyDown(async function () {
	// 		OnChange(Code_Editor.getValue());
	// 	});

	// 	Code_Editor.onDidBlurEditorWidget(async function () {
	// 		let Value = Code_Editor.getValue();
	// 		if (ReArrange_Value) {
	// 			console.log("Before", Value);
	// 			Value = await ReArrange_Value(Value);
	// 			console.log("After", Value);
	// 			Code_Editor.setValue(Value);
	// 		}
	// 		OnChange(Value);
	// 	});

	// 	return {
	// 		Code_Editor: Code_Editor,
	// 		OnChange: function (callback) {
	// 			OnChange = callback;
	// 		},
	// 		Additinal_OnChange: function (callback) {
	// 			Additinal_OnChange = callback;
	// 		},
	// 		ReArrange_Value: function (callback) {
	// 			ReArrange_Value = callback;
	// 		},
	// 		Frame,
	// 	};
	// },

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

	["Title"]: function (Category, Rainbow = false) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Category-Title";
		if (Rainbow) {
			Title.className += " STYLESHIFT-Category-Title-Rainbow";
		}
		Title.innerHTML = Category;

		return Title;
	},
	["Left-Title"]: function (Category, Skip_Animation) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Left-Category-Title";

		let Text = document.createElement("div");
		Text.className = "STYLESHIFT-Left-Category-Text";
		Text.textContent = Category;

		if (!Skip_Animation) {
			Title.style.transform = "translateY(40px)";
			Title.style.opacity = "0";
		}

		Title.append(Text);

		return Title;
	},

	["Sub_Title"]: function (Text) {
		let Title = document.createElement("div");
		Title.className = "STYLESHIFT-Sub-Title";
		Title.innerHTML = Text;

		return Title;
	},

	["Collapsed_Button"]: async function (ButtonName, RBG: color_obj, TargetElement: HTMLElement) {
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
			click_function: function () {
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

				for (const option of options) {
					const listItem = document.createElement("div");
					listItem.className = "STYLESHIFT-DropDown-Items STYLESHIFT-Glow-Hover";
					listItem.textContent = option;
					listItem.addEventListener("click", () => {
						resolve(option); // Return the selected option
						dropdownContainer.remove();
					});
					dropdownContainer.appendChild(listItem);
				}
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

	["Add_Setting_Button"]: async function (Category_Settings: Setting[]) {
		let Current_Dropdown;

		let Add_Button = await Settings_UI["Button"]({
			name: "+",
			color: RGB_to_Color_OBJ(255, 255, 255),
			text_align: "center",
			click_function: async function () {
				if (Current_Dropdown) {
					Current_Dropdown.Cancel();
					return;
				}
				Current_Dropdown = Settings_UI["Show_Dropdown"](
					Object.keys(Main_Setting_UI),
					Add_Button.Button
				);
				const Selected = await Current_Dropdown.Selection;
				if (Selected) {
					let Get_Preset: any = UI_Preset.filter(
						(This_Preset) => This_Preset.type == Selected
					)[0];

					console.log("Selected", Selected, Get_Preset);

					if (Get_Preset) {
						await Add_Setting(Category_Settings, Get_Preset);
					}
				}
				Current_Dropdown = null;
			},
		});

		Add_Button.Button.style.borderRadius = "1000px";
		return Add_Button;
	},

	["Space"]: async function (Parent: HTMLElement, Size = 20) {
		const Space = document.createElement("div");
		Space.className = "STYLESHIFT-Space";
		Space.style.minHeight = `${Size}px`;

		Parent.append(Space);
	},
};

let Developer_Setting_UI = {
	["Setting_Developer_Text_Editor"]: async function (
		Parent: HTMLElement,
		This_Setting,
		this_property,
		Update_UI = function (value) {}
	) {
		const Main_UI = Settings_UI["Setting_Frame"](true, true);
		Main_UI.className += " STYLESHIFT-Config-Sub-Frame";

		let Text_Editors = {};

		for (const [Title, Property] of Object.entries(this_property)) {
			Main_UI.append(Settings_UI["Sub_Title"](Title));
			const Setting_Developer_Text_Editor = Settings_UI["Text_Editor"](
				This_Setting,
				Property
			);
			Setting_Developer_Text_Editor.Additinal_OnChange(Update_UI);
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
		let Color = RGB_to_Color_OBJ(200, 200, 200);

		switch (RunType) {
			case "var":
				This_RunType_Name = "Variable";
				Color = RGB_to_Color_OBJ(255, 167, 0);
				break;

			case "click":
				This_RunType_Name = "On Click";
				Color = RGB_to_Color_OBJ(0, 220, 255);
				break;

			case "setup":
				This_RunType_Name = "Setup / Auto run";
				Color = RGB_to_Color_OBJ(50, 50, 255);
				break;

			case "enable":
				This_RunType_Name = "Enable";
				Color = RGB_to_Color_OBJ(50, 255, 50);
				break;

			case "disable":
				This_RunType_Name = "Disable";
				Color = RGB_to_Color_OBJ(255, 50, 50);
				break;

			case "update":
				This_RunType_Name = "On Change";
				Color = RGB_to_Color_OBJ(255, 0, 245);
				break;

			default:
				break;
		}

		let { r, g, b } = Color.RGB;

		let BG_HSV = RGB_to_HSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		let BG_Color = HSV_to_RGB(BG_HSV);

		let BGT_HSV = RGB_to_HSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		let BGT_Color = HSV_to_RGB(BGT_HSV);

		let Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		let Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		let Border_Color = `${r + 150},${g + 150},${b + 150}`;

		let This_Frame = Settings_UI["Setting_Frame"](true, true);
		This_Frame.style.paddingBottom = "10px";
		This_Frame.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		This_Frame.style.border = `rgb(${Border_Color}) 1px solid`;

		let Collapsed_Button = await Settings_UI["Collapsed_Button"](
			This_RunType_Name,
			Color,
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

			// if (This_Type_Name == "JS" || This_Type_Name == "CSS") {
			// 	if (This_Type_Name == "JS") {
			// 		This_Type_Name = "javascript";
			// 	}

			// 	if (This_Type_Name == "CSS") {
			// 		This_Type_Name = "css";
			// 	}

			// 	let Editor = await Settings_UI["Code_Editor"](
			// 		This_Setting,
			// 		RunType + "_" + ext,
			// 		This_Type_Name
			// 	);

			// 	(await GetDocumentBody()).append(Editor.Frame);

			// 	continue;
			// }

			let Editor = Settings_UI["Text_Editor"](This_Setting, RunType + "_" + ext);
			This_Frame.append(Editor.Text_Editor);
			Editor.Text_Editor.style.height = "100px";
		}

		Parent.append(Collapsed_Button.Frame);
		Parent.append(This_Frame);

		return This_Frame;
	},

	["Config_Section_1"]: async function (Parent, This_Setting, Props, Update_UI) {
		console.log(Props);
		for (let [Title, Property] of Object.entries(Props) as [string, any]) {
			let Update;

			console.log(Title, Property);

			if (typeof Property != "string") {
				Update = Property[1];
				Property = Property[0];
			} else {
				Update = Update_UI;
			}

			//-----------------------------------

			if (Array.isArray(Update)) {
				let DropDown_Setting = {};

				for (const value of Update) {
					DropDown_Setting[value] = {
						enable_function: function () {
							This_Setting[Property] = value;
							Update_UI();
							Save_All();
						},
					};
				}

				const Dropdown_UI = await Settings_UI["Dropdown"]({
					name: Title,
					value: This_Setting[Property],
					options: DropDown_Setting,
				});

				Dropdown_UI.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Dropdown_UI);
				continue;
			}

			//-----------------------------------

			if (Property == "color") {
				let Color_UI = await Settings_UI["Color"]({
					name: Title,
					value: This_Setting.color,
					show_alpha_slider: false,
					update_function: function (value) {
						This_Setting.color = value;
						Update_UI();
					},
				});

				Color_UI.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Color_UI);
				continue;
			}

			//-----------------------------------

			if (Property == "font_size") {
				let Number_Slide_UI = await Settings_UI["Number_Slide"]({
					name: Title,
					value: This_Setting.font_size,
					update_function: function (value) {
						This_Setting.font_size = value;
						Update_UI();
					},
				});

				Number_Slide_UI.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Number_Slide_UI);
				continue;
			}

			//-----------------------------------

			const Text_Editor = await Settings_UI["Setting_Developer_Text_Editor"](
				Parent,
				This_Setting,
				{
					[Title]: Property,
				}
			);

			let Update_function;

			if (typeof Update === "function") {
				Update_function = Update;
			} else if (typeof Update === "object") {
				Update_function = function (value) {
					This_Setting[Property] = value;
					Update_UI();
				};
			} else {
				return;
			}

			Text_Editor.Text_Editors[Title].Additinal_OnChange(Update_function);
		}
	},

	["Config_Section_2"]: async function (Parent, This_Setting, Props) {
		for (let [Title, Property] of Object.entries(Props)) {
			switch (Property) {
				case 1:
					Property = ["var"];
					break;
				case 2:
					Property = ["css"];
					break;
				case 3:
					Property = ["function"];
					break;

				default:
					Property = ["css", "function"];
					break;
			}
			Settings_UI["Setting_Developer_Frame"](Parent, This_Setting, Title, Property as any);
		}
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

	["Config_UI"]: async function (Parent, This_Setting) {
		const Config_Frame = Settings_UI["Setting_Frame"](false, true);
		Config_Frame.style.paddingTop = "10px";
		Config_Frame.style.gap = "10px";

		const Config_Button = await Settings_UI["Config_Button"](Config_Frame);
		Config_Button.Frame.style.flexDirection = "row";
		Config_Button.Frame.style.gap = "10px";
		Config_Button.Frame.className += " STYLESHIFT-Config-Frame-Button";

		Parent.append(Config_Button.Frame);
		Parent.append(Config_Frame);

		if (This_Setting) {
			const Delete_Button = await Settings_UI["Setting_Delete_Button"](
				Config_Frame,
				function () {
					Remove_Setting(This_Setting);
				},
				"mini"
			);
			Config_Button.Frame.append(Delete_Button.Frame);
		}

		return { Config_Frame, Config_Button };
	},

	["Config_Button"]: async function (Config_Frame) {
		const Config_Button = await Settings_UI["Collapsed_Button"](
			"Edit config",
			RGB_to_Color_OBJ(200, 200, 200),
			Config_Frame
		);
		Config_Button.Frame.style.marginTop = "10px";
		return Config_Button;
	},

	["Setting_Delete_Button"]: async function (Parent, WhenClick, type: "full" | "mini" = "full") {
		const Setting_Delete_Button = await Settings_UI["Button"]({
			name: "🗑️",
			color: RGB_to_Color_OBJ(255, 0, 0),
			text_align: "center",
		});
		Setting_Delete_Button.Button.addEventListener("click", WhenClick);
		Parent.append(Setting_Delete_Button.Frame);

		switch (type) {
			case "full":
				Setting_Delete_Button.Button.style.width = "100%";
				break;
			case "mini":
				Setting_Delete_Button.Button.style.width = "30px";
				break;
		}

		return Setting_Delete_Button;
	},
};

const UI_Preset: Setting[] = [
	{
		type: "Button",
		id: "Test_Button",
		name: "Button",
		description: "Description of this Button",

		color: RGB_to_Color_OBJ(0, 255, 220),
		font_size: 15,

		click_function: "",
	},
	{
		type: "Checkbox",
		id: "Test_Checkbox",
		name: "Some Checkbox",
		description: "Description of this Checkbox",

		value: false,
	},
	{
		type: "Number_Slide",
		id: "Test_Checkbox",
		name: "Just Number Slide",
		description: "Description of this Number Slider",

		min: 0,
		max: 100,
		step: 1,
		value: 50,
	},
	{
		type: "Dropdown",
		id: "Test_Dropdown",
		name: "Just Dropdown",
		description: "Description of this Dropdown",

		value: "Item_1",

		options: { Item_1: {}, Item_2: {}, Item_3: {} },
	},
	{
		type: "Color",
		id: "Test_Color",
		name: "Just Color Selector",
		description: "Description of this Dropdown",
		show_alpha_slider: true,

		value: { RGB: { r: 255, g: 0, b: 0 }, Alpha: 100 },
	},
];

let Settings_UI = {
	...Main_Setting_UI,
	...Advance_Setting_UI,
	...Developer_Setting_UI,
};

type UI_Type = keyof typeof Settings_UI;
type SettingsUIParams<T extends keyof typeof Settings_UI> = Parameters<(typeof Settings_UI)[T]>;

type SettingsUIReturnType<T extends UI_Type> = ReturnType<(typeof Settings_UI)[T]>;

export async function Create_Setting_UI_Element<T extends UI_Type>(
	type: T,
	...RestArgs: SettingsUIParams<T>
): Promise<SettingsUIReturnType<T>> {
	console.log(type);
	//@ts-ignore
	return (await Settings_UI[type](...RestArgs)) as SettingsUIReturnType<T>;
}

export function Dynamic_Append(Parent: HTMLDivElement, Child) {
	console.log("Try Apeend", Child);
	if (Child.Frame) {
		Parent.appendChild(Child.Frame);
	} else {
		Parent.appendChild(Child);
	}
}
