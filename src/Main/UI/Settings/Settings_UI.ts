import { Create_Error, Dynamic_Append } from "../../Build-in_Functions/Extension_Functions";
import { insertAfter, Scroll_On_Click, sleep } from "../../Build-in_Functions/Normal_Functions";
import { In_Setting_Page, isFirefox, Loaded_Developer_Modules } from "../../Core/Core_Functions";
import { Load, Save_All } from "../../Core/Save";
import { Get_Setting_Page_Only_Items } from "../../Developer_Only_Items";
import { Update_All } from "../../Run";
import {
	Add_Category,
	Get_Setting_Category,
	Get_StyleShift_Data_Type,
	Remove_Category,
	Remove_Setting,
} from "../../Settings/StyleShift_Items";
import { Category } from "../../types/Store_Data";
import { Show_Config_UI } from "../Config_UI";
import { Animation_Time, Create_StyleShift_Window } from "../Extension_UI";
import { Settings_UI } from "./Settings_UI_Components";

export function Setup_Left_Title_Animation(Title) {
	Title.style.transform = "translateY(40px)";
	Title.style.opacity = "0";
}

export async function Create_Main_Settings_UI({
	Show_Category_List = true,
	On_Create = null as (StyleShift_Window: Awaited<ReturnType<typeof Create_StyleShift_Window>>) => void,
	On_Remove = null as () => void,
	Get_Category = null as () => Category[] | Promise<Category[]>,
}) {
	let Settings_Window, Update_Setting_Interval, Scroll_Category, Scroll_Settings;

	const Return_OBJ = {
		Create_UI: async function (Skip_Animation = false) {
			console.log(Settings_Window);
			if (Settings_Window) {
				Return_OBJ.Recreate_UI();
				return;
			}

			Settings_Window = await Create_StyleShift_Window({
				Skip_Animation,
			});

			console.log("Created_StyleShift_Window");
			const Window = Settings_Window.Window;

			Window.style.width = "47%";
			Window.style.height = "80%";
			Window.style.minWidth = "600px";
			Window.style.minHeight = "250px";

			if (In_Setting_Page) {
				Window.style.width = "100%";
				Window.style.height = "100%";
				Window.style.resize = "none";
			}

			//------------------------------------------------

			const Main_Frame = await Settings_UI["Setting_Frame"](false, false, { x: false, y: false }, true);

			Main_Frame.style.width = "calc(100% - 5px)";
			Main_Frame.style.height = "-webkit-fill-available";
			Main_Frame.style.gap = "10px";
			Main_Frame.style.overflow = "hidden";
			Window.append(Main_Frame);

			//------------------------------------------------

			if (Show_Category_List) {
				Scroll_Category = document.createElement("div");
				Scroll_Category.className = "STYLESHIFT-Scrollable";
				Scroll_Category.style.minWidth = "100px";
				Scroll_Category.style.width = "250px";
				Scroll_Category.setAttribute("Left", "true");
				Main_Frame.append(Scroll_Category);
			}

			//------------------------------------------------

			const Settings_Frame = await Settings_UI["Setting_Frame"](false, true, { x: false, y: false }, true);
			Settings_Frame.style.width = "-webkit-fill-available";
			Settings_Frame.style.height = "100%";
			Settings_Frame.style.gap = "10px";
			Main_Frame.append(Settings_Frame);

			const Search_Input = document.createElement("input");
			Search_Input.className = "STYLESHIFT-Search";
			Search_Input.placeholder = "🔍 Search";
			Settings_Frame.append(Search_Input);

			Scroll_Settings = document.createElement("div");
			Scroll_Settings.className = "STYLESHIFT-Scrollable";
			Settings_Frame.append(Scroll_Settings);

			//---------------------------------------------------

			Settings_Window.Close.addEventListener(
				"click",
				() => {
					Return_OBJ.Remove_UI();
				},
				{ once: true }
			);

			//---------------------------------------------------

			let Left_UI = [];
			let Right_UI = [];

			console.log("Test2", Get_Category());

			for (const This_Category of await Get_Category()) {
				const Category_Frame = await Settings_UI["Setting_Frame"](true, true);
				Category_Frame.className += " STYLESHIFT-Category-Frame";
				Scroll_Settings.append(Category_Frame);

				let Category_Title = (
					await Create_Setting_UI_Element_With_Able_Developer_Mode(Category_Frame, This_Category)
				).Frame;

				let Left_Category_Title = await Settings_UI["Left-Title"](This_Category.Category, Skip_Animation);

				Scroll_On_Click(Left_Category_Title, Category_Title);

				if (Show_Category_List) {
					Left_UI.push(Left_Category_Title);
					Scroll_Category.append(Left_Category_Title);
				}

				Right_UI.push(Category_Title);

				//------------------------------

				await Create_Inner_UI(Category_Frame, This_Category);

				//------------------------------

				if (Loaded_Developer_Modules && (!isFirefox || In_Setting_Page)) {
					const Get_Setting_Page_Only = Get_Setting_Page_Only_Items().filter(
						(x) => x.Category === This_Category.Category
					)[0];

					if (Get_Setting_Page_Only) {
						for (const This_Setting_Only of Get_Setting_Page_Only.Settings) {
							await Create_Setting_UI_Element_With_Able_Developer_Mode(
								Category_Frame,
								This_Setting_Only
							);
						}
					}
				}

				//------------------------------

				if (await Load("Developer_Mode")) {
					Dynamic_Append(
						Category_Frame,
						await Settings_UI["Add_Setting_Button"](This_Category.Settings)
					);
				}

				await Settings_UI["Space"](Scroll_Settings);

				//------------------------------------------------------
			}

			if (Show_Category_List && (await Load("Developer_Mode"))) {
				let Add_Button = (
					await Settings_UI["Button"]({
						name: "+",
						color: "#FFFFFF",
						text_align: "center",
						click_function: function () {
							Add_Category("🥳 New_Category");
						},
					})
				).Button;
				Add_Button.className += " STYLESHIFT-Add-Category-Button";

				Add_Button.style.padding = "5px";
				Add_Button.style.marginInline = "10px";
				Add_Button.style.marginTop = "3px";

				Left_UI.push(Add_Button);
				Scroll_Category.append(Add_Button);

				if (!Skip_Animation) {
					Setup_Left_Title_Animation(Add_Button);
				}
			}

			//------------------------------------------------------

			if (Show_Category_List && !Skip_Animation) {
				requestAnimationFrame(function () {
					for (let Left_Order = 0; Left_Order < Left_UI.length; Left_Order++) {
						const Left_Category_Title = Left_UI[Left_Order];
						setTimeout(() => {
							Left_Category_Title.style.transform = "";
							Left_Category_Title.style.opacity = "";
						}, 50 * Left_Order);
					}
				});
			}

			//------------------------------------------------------

			let Current_Selected: HTMLElement;

			if (Show_Category_List) {
				Update_Setting_Interval = setInterval(async function () {
					const Last_Index = Right_UI.length - 1;

					for (let index = 0; index <= Last_Index; index++) {
						const Scroll_Settings_Box = Scroll_Settings.getBoundingClientRect();
						if (
							index == Last_Index ||
							(Right_UI[index].getBoundingClientRect().top - 10 <= Scroll_Settings_Box.top &&
								Right_UI[index + 1].getBoundingClientRect().top - 10 >=
									Scroll_Settings_Box.top) ||
							(index == 0 &&
								Right_UI[index].getBoundingClientRect().top >= Scroll_Settings_Box.top)
						) {
							if (Current_Selected == Left_UI[index]) {
								break;
							}
							if (Current_Selected) {
								Current_Selected.removeAttribute("Selected");
							}
							Current_Selected = Left_UI[index];
							Current_Selected.setAttribute("Selected", "");
							break;
						}
					}
				}, 100);
			}

			if (On_Create) {
				On_Create(Settings_Window);
			}
		},
		Remove_UI: function (Skip_Animation = false) {
			if (Settings_Window) {
				clearInterval(Update_Setting_Interval);
				if (Skip_Animation) {
					Settings_Window.BG_Frame.remove();
				} else {
					Settings_Window.Run_Close();
				}
				Settings_Window = null;
			}
		},
		Recreate_UI: async function () {
			if (Settings_Window) {
				let Last_Scroll = [0, 0];

				if (Show_Category_List) {
					Last_Scroll[0] = Scroll_Category.scrollTop;
				}
				Last_Scroll[1] = Scroll_Settings.scrollTop;

				Settings_Window.Window.style.animation = "";
				let Last_Style = Settings_Window.Window.style.cssText;
				console.log(Last_Style);
				Return_OBJ.Remove_UI(true);

				//----------------------------------------

				await Return_OBJ.Create_UI(true);
				Settings_Window.Window.style.cssText = Last_Style;

				if (Show_Category_List) {
					Scroll_Category.scrollTo(0, Last_Scroll[0]);
				}

				Scroll_Settings.scrollTo(0, Last_Scroll[1]);
			}
		},
		Toggle: function () {
			if (Settings_Window) {
				Return_OBJ.Remove_UI();
			} else {
				Return_OBJ.Create_UI();
			}
		},

		Set_Get_Category: function (New_Function: () => Category[] | Promise<Category[]> | null) {
			Get_Category = New_Function;
			if (Settings_Window) {
				Return_OBJ.Recreate_UI();
			}
		},
	};

	return Return_OBJ;
}

//------------------------------

export async function Create_Config_UI_Function(Editable = false, Config_Function: Function): Promise<Function> {
	if (Editable && (await Load("Developer_Mode"))) {
		return Config_Function;
	}
}

function Create_Setting_Space(Size = 20, Gap = 0) {
	const Space = document.createElement("div");
	Space.style.height = Size + "px";
	Space.style.transition = `all ${Animation_Time}s`;
	Space.style.marginTop = -Gap + "px";
	Space.style.marginBottom = -Gap + "px";

	async function Show() {
		Space.style.height = Size + Gap + "px";
		await sleep(Animation_Time * 1000);
	}

	async function Hide() {
		Space.style.height = Gap + "px";
		await sleep(Animation_Time * 1000);
	}

	function Set_Size(Value) {
		Size = Value;
	}

	return {
		Show,
		Hide,
		Set_Size,
		Element: Space,
	};
}

let Draging_Setting;

export async function Create_Setting_UI_Element_With_Able_Developer_Mode(Parent: HTMLDivElement, This_Data) {
	const Data_Type = Get_StyleShift_Data_Type(This_Data);
	const UI_Type = Data_Type == "Category" ? "Title" : This_Data.type;
	const Main_Element = await Settings_UI[UI_Type](This_Data);

	if ((await Load("Developer_Mode")) && This_Data.Editable) {
		const Frame = Settings_UI["Setting_Frame"](false, false, { x: true, y: true }, true);
		Frame.className += " STYLESHIFT-Config-Frame";

		//---------------------------

		if (Data_Type != "Category") {
			const Move_Button = (
				await Settings_UI["Button"]({
					name: "☰",
					text_align: "center",
				})
			).Button;
			Move_Button.className += " STYLESHIFT-Config-Button";

			Frame.append(Move_Button);

			//-------------------------------

			Move_Button.addEventListener("mousedown", async function (event) {
				event.preventDefault();

				let Frame_Bound = Frame.getBoundingClientRect();
				let Offset = event.clientY - Frame_Bound.top;

				Draging_Setting = {
					Size: Frame_Bound.height,
					Data: This_Data,
				};

				Frame.style.width = `${Frame_Bound.width}px`;
				Frame.style.height = `${Frame_Bound.height}px`;
				Frame.style.position = "absolute";
				Frame.style.pointerEvents = "none";
				Frame.style.zIndex = "1";

				const Space = Create_Setting_Space(
					Frame_Bound.height,
					Number(getComputedStyle(Parent).gap.replace("px", ""))
				);
				Space.Show();
				Parent.insertBefore(Space.Element, Frame);

				requestAnimationFrame(() => {
					Space.Hide();
				});

				let Scroller = Parent.parentElement;
				let Current_Mouse_Event = event;

				Scroller.setAttribute("Draging", "");

				//---------------------------------

				let Render_Drag = true;

				function Update_Drag_Function() {
					if (!Render_Drag) return;

					Frame.style.top = `${
						Current_Mouse_Event.clientY -
						Scroller.getBoundingClientRect().top +
						Scroller.scrollTop -
						Offset
					}px`;

					requestAnimationFrame(Update_Drag_Function);
				}
				Update_Drag_Function();

				//---------------------------------

				function On_Drag(event) {
					Current_Mouse_Event = event;
				}

				document.addEventListener("mousemove", On_Drag);

				document.addEventListener(
					"mouseup",
					function () {
						document.removeEventListener("mousemove", On_Drag);
						Render_Drag = false;

						Frame.style.width = "";
						Frame.style.height = "";
						Frame.style.position = "";
						Frame.style.pointerEvents = "";
						Frame.style.zIndex = "";

						Scroller.removeAttribute("Draging");

						Draging_Setting = null;
						Space.Element.remove();
					},
					{ once: true }
				);
			});
		}

		const Space = Create_Setting_Space(0, Number(getComputedStyle(Parent).gap.replace("px", "")));
		Space.Element.className = "STYLESHIFT-Drag-Hint";
		Space.Hide();

		insertAfter(Space.Element, Frame, Parent);

		let Current_Hover = 0;
		function Space_Update_Hover(Hover) {
			Current_Hover += Hover;

			if (Draging_Setting) {
				if (Current_Hover != 0) {
					Space.Set_Size(Draging_Setting.Size);
					Space.Show();
				}
			}

			if (Current_Hover == 0) {
				Space.Hide();
			}
		}

		Frame.addEventListener("mouseenter", () => {
			Space_Update_Hover(1);
		});
		Space.Element.addEventListener("mouseenter", () => {
			Space_Update_Hover(1);
		});

		Frame.addEventListener("mouseleave", () => {
			Space_Update_Hover(-1);
		});
		Space.Element.addEventListener("mouseleave", function () {
			Space_Update_Hover(-1);
		});

		Space.Element.addEventListener("mouseup", () => {
			if (Draging_Setting) {
				Remove_Setting(Draging_Setting.Data);

				let This_Category: Category | 0 =
					Data_Type == "Category" ? This_Data : Get_Setting_Category(This_Data);
				let This_Setting_Index = 0;

				if (This_Category == 0) {
					Create_Error(`Category of ${This_Data} not found`);
					return;
				}

				if (Data_Type != "Category") {
					This_Setting_Index = This_Category.Settings.findIndex((Setting) => Setting == This_Data) + 1;
				}

				try {
					This_Category.Settings.splice(This_Setting_Index, 0, Draging_Setting.Data);
				} catch (error) {
					Create_Error(error);
					return;
				}

				Save_All();
				Update_All();
			}
		});

		//---------------------------

		const Main_Frame = Settings_UI["Setting_Frame"](
			false,
			false,
			{ x: true, y: true },
			This_Data.type == "Button" || Data_Type == "Category"
		);
		Main_Frame.className += " STYLESHIFT-Main-Setting-Frame";
		Frame.append(Main_Frame);

		Dynamic_Append(Main_Frame, Main_Element);

		//---------------------------

		const Edit_Button = (
			await Settings_UI["Button"]({
				name: "✏️",
				text_align: "center",
				color: "#3399ff",
				click_function: function () {
					Show_Config_UI(Main_Element.Config_UI_Function);
				},
			})
		).Button;
		Edit_Button.className += " STYLESHIFT-Config-Button";

		Frame.append(Edit_Button);

		const Delete_Button = (
			await Settings_UI["Button"]({
				name: "🗑️",
				text_align: "center",
				color: "#FF0000",
				click_function:
					Data_Type == "Category"
						? async function () {
								Remove_Category(This_Data);
						  }
						: async function () {
								Remove_Setting(This_Data);
						  },
			})
		).Button;
		Delete_Button.className += " STYLESHIFT-Config-Button";

		Frame.append(Delete_Button);

		//---------------------------

		Parent.append(Frame);
	} else {
		Dynamic_Append(Parent, Main_Element);
	}

	return Main_Element;
}

export async function Create_Inner_UI(Parent, This_Category) {
	for (const This_Setting of This_Category.Settings) {
		try {
			await Create_Setting_UI_Element_With_Able_Developer_Mode(Parent, This_Setting);
		} catch (error) {
			Create_Error(`${This_Setting.type}\n${error}`).then((Notification) => {
				Notification.Set_Title("StyleShift - Create UI error");
			});
		}
	}
}
