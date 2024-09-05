import {
	Create_UniqueID,
	Get_Scroll_Parent,
	sleep,
	WaitDocumentLoaded,
	When_Element_Remove,
} from "../Modules/NormalFunction";
import { Show_Confirm } from "../Settings/Extension_Setting";
import { Get_Editable_Items } from "./Editable_Items";
import { Create_Editor_UI, Remove_Editor_UI } from "./Editor_UI";

var Highlight_Elements = {};

function Add_Highlight(targetElement: HTMLElement, Selector_Value) {
	console.log(Highlight_Elements);

	var Exist_UniqueID = targetElement.getAttribute("StyleShift-UniqueID");
	if (Exist_UniqueID) {
		var OBJ = Highlight_Elements[Exist_UniqueID];
		console.log(OBJ.targetElement, targetElement);
		OBJ.Stop();
	}

	var UniqueID = Create_UniqueID(10);

	targetElement.setAttribute("StyleShift-UniqueID", UniqueID);

	const Color = Selector_Value.Highlight_Color;

	var highlighter = document.createElement("div");
	highlighter.className = "STYLESHIFT-Highlight";
	highlighter.setAttribute("Selector", Selector_Value.Selector);

	highlighter.style.background = `${Color},0.3)`;
	highlighter.style.borderColor = `${Color},0.8)`;

	var ComputedStyle = window.getComputedStyle(targetElement, null);

	highlighter.style.width = `calc(100% - 
	${ComputedStyle.getPropertyValue("padding-left")} - 
	${ComputedStyle.getPropertyValue("padding-right")} - 2px
	)`;
	highlighter.style.height = `calc(100% - 
	${ComputedStyle.getPropertyValue("padding-top")} - 
	${ComputedStyle.getPropertyValue("padding-bottom")} - 2px
	)`;

	// Update position periodically
	// const Running_Attach = Attach_Element(highlighter, targetElement, function (rect) {

	//      const calzIndex = Math.floor(5000 + (window.innerWidth - rect.width) + (window.innerHeight - rect.height))

	//      if (highlighter.style.zIndex != calzIndex) {
	//           console.log(calzIndex)
	//           highlighter.style.zIndex = calzIndex
	//      }

	// });

	targetElement.append(highlighter);

	highlighter.onclick = function () {
		Create_Editor_UI(targetElement, Selector_Value);
		Stop_Highlighter();
	};

	function Stop() {
		highlighter.remove();
		//Running_Attach.Stop()
		targetElement.removeAttribute("StyleShift-UniqueID");
		delete Highlight_Elements[UniqueID];
	}

	// Stop updating position when the element is removed
	When_Element_Remove(targetElement, function () {
		Stop();
	});

	var return_OBJ = {
		highlighter: highlighter,
		targetElement: targetElement,
		Stop: Stop,
	};

	Highlight_Elements[UniqueID] = return_OBJ;

	return return_OBJ;
}

// function Hover_Highlight(e) {
//      var Hover_Element

//      for (const OBJ of Object.values(Highlight_Elements)) {
//           const highlighter = OBJ.highlighter
//           highlighter.removeAttribute("hover")

//           if (
//                isElementIn_Position(highlighter, e.clientX, e.clientY) &&
//                (
//                     Hover_Element == null
//                     ||
//                     highlighter.style.zIndex > Hover_Element.style.zIndex
//                )
//           ) {
//                Hover_Element = highlighter
//           }
//      }

//      if (Hover_Element) {
//           Hover_Element.setAttribute("hover", "")
//      }

//      // return Hover_Element
// }

// function Start_Hover_Highlight() {
//      document.addEventListener('mousemove', Hover_Highlight)
// }

// function Stop_Hover_Highlight() {
//      document.removeEventListener('mousemove', Hover_Highlight)
// }

var Watch_Body: MutationObserver;

export async function Start_Highlighter() {
	await WaitDocumentLoaded();

	const Editable_Items = await Get_Editable_Items();

	console.log("Editable_Items", Editable_Items);

	var Exept_Items = [];

	Watch_Body = new MutationObserver(async (mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes as any) {
					//console.log("Running Check New Node");
					if (node.nodeType === Node.ELEMENT_NODE) {
						for (const Selector_Value of [
							...Editable_Items.Default,
							...Editable_Items.Custom,
						]) {
							if (
								node.matches(Selector_Value.Selector) &&
								!Exept_Items.some(
									(item) => item === Selector_Value.Selector
								)
							) {
								console.log("Add New Node", Selector_Value.Selector);
								Add_Highlight(node, Selector_Value);
								break; // No need to check other selectors
							}
						}
					}
				}
			}
		}
	});

	// Start observing the document body for changes
	Watch_Body.observe(document.body, { childList: true, subtree: true });

	// Initialize highlights for existing editable elements
	for (const Selector_Value of [...Editable_Items.Default, ...Editable_Items.Custom]) {
		var Selector_Found = document.querySelectorAll(Selector_Value.Selector);
		console.log(Selector_Found.length);

		if (
			Selector_Found.length >= 1000 &&
			!(await Show_Confirm(
				`StyleShift : I found ${Selector_Found.length} elements on selector "${Selector_Value.Selector}"\n\nAre you wish to continue??`
			))
		) {
			Exept_Items.push(Selector_Value.Selector);
			continue;
		}

		for (const element of Selector_Found) {
			Add_Highlight(element, Selector_Value);
		}
	}

	//Start_Hover_Highlight()
	// document.addEventListener('click', function (e) {
	//      var Current_Hover = Hover_Highlight(e)
	//      if (Current_Hover) {
	//           console.log(Current_Hover)
	//           var selector = Current_Hover.getAttribute("selector")
	//           console.log(selector)
	//           console.log(Editable_Items[selector])
	//      }
	// })
}

function Stop_Highlighter() {
	// Stop_Hover_Highlight()

	if (Watch_Body) {
		Watch_Body.disconnect();
	}

	Object.values(Highlight_Elements).forEach((Highlight_Elements_OBJ: any) => {
		Highlight_Elements_OBJ.Stop();
	});

	Highlight_Elements = [];
}

var Running_Cusomize = false;

export async function Start_Customize() {
	if (Running_Cusomize) {
		return;
	}
	Running_Cusomize = true;
	Start_Highlighter();
}

export function Stop_Customize() {
	if (!Running_Cusomize) {
		return;
	}
	Running_Cusomize = false;
	Stop_Highlighter();
}

export async function Toggle_Customize() {
	if (Running_Cusomize) {
		Stop_Customize();
		Remove_Editor_UI();
	} else {
		Start_Customize();
	}
}