export function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

//---------------------------------------------

export function HEX_to_RBGA(hex) {
	hex = hex.replace(/^#/, "");

	if (hex.length === 6) {
		hex += "ff";
	} else if (hex.length !== 8) {
		throw new Error("Invalid hex color format");
	}

	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);
	let a = parseInt(hex.substring(6, 8), 16) / 255;

	return { r, g, b, a };
}

export function HEX_to_RBG(hex) {
	hex = hex.replace(/^#/, "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map(function (char) {
				return char + char;
			})
			.join("");
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return { r, g, b };
}

export function RGBA_to_HEX(r, g, b, a = 1) {
	r = Math.round(Math.min(255, Math.max(0, r)));
	g = Math.round(Math.min(255, Math.max(0, g)));
	b = Math.round(Math.min(255, Math.max(0, b)));
	a = Math.min(1, Math.max(0, a));

	let hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
		.toString(16)
		.padStart(2, "0")}`;
	if (a < 1) {
		hex += Math.round(a * 255)
			.toString(16)
			.padStart(2, "0");
	}

	return hex;
}

export function RGB_to_HSV(rgb) {
	let r = rgb.r,
		g = rgb.g,
		b = rgb.b;
	r /= 255;
	g /= 255;
	b /= 255;
	let v = Math.max(r, g, b),
		c = v - Math.min(r, g, b);
	let h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return {
		h: Math.round(60 * (h < 0 ? h + 6 : h)),
		s: v && Math.round((c / v) * 100),
		v: Math.round(v * 100),
	};
}

export function HSV_to_RGB(hsv) {
	let h = hsv.h,
		s = hsv.s,
		v = hsv.v;
	s /= 100;
	v /= 100;
	let f = (n) =>
		(v - v * s * Math.max(Math.min((n + h / 60) % 6, 4 - ((n + h / 60) % 6), 1), 0)) * 255;
	return { r: Math.round(f(5)), g: Math.round(f(3)), b: Math.round(f(1)) };
}

//---------------------------------------------

export function is_Scrollable(element: HTMLElement) {
	// Check if the element has a vertical scroll bar
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;

	// Check if the element has a horizontal scroll bar
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;

	// Return true if either vertical or horizontal scroll bar exists
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

export function Get_Scroll_Parent(element: HTMLElement | null) {
	// If no element is provided, return null
	if (!element) {
		return null;
	}

	// Start with the parent node
	let parent = element.parentNode;

	// Traverse up the DOM tree to find a scrollable parent
	while (parent && parent !== document) {
		if (is_Scrollable(parent as HTMLElement)) {
			return parent;
		}
		parent = parent.parentNode;
	}

	// If no scrollable parent is found, return the document
	return document.body;
}

export function stringToNumber(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

export function Random(Minimum: number, Maximum: number, Seed: string | number): number {
	const numericalSeed = typeof Seed === "string" ? stringToNumber(Seed) : Seed;

	const a = 931;
	const c = 49297;
	const m = 233280;

	let currentSeed = numericalSeed;

	const random = (): number => {
		currentSeed = (currentSeed * a + c) % m;
		return currentSeed / m;
	};

	return Math.floor(Minimum + random() * (Maximum - Minimum + 1));
}

export async function GetDocumentBody() {
	let DocumentBody = document.body;

	if (DocumentBody) {
		return DocumentBody;
	} else {
		await sleep(100);
		return await GetDocumentBody();
	}
}

export async function GetDocumentHead() {
	let DocumentHead = document.head;

	if (DocumentHead) {
		return DocumentHead;
	} else {
		await sleep(100);
		return await GetDocumentBody();
	}
}

export function Once_Element_Remove(targetElement: HTMLElement, callback: Function) {
	let observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				for (const removedNode of mutation.removedNodes) {
					if (removedNode === targetElement) {
						callback();
						observer.disconnect();
						return;
					}
				}
			}
		}
	});
	observer.observe(document.body, { childList: true });
}

export function getElementCenterPosition(element: HTMLElement): { x: number; y: number } {
	// Get the bounding rectangle of the element
	const rect = element.getBoundingClientRect();

	// Calculate the center position
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	return {
		x: centerX,
		y: centerY,
	};
}

export async function WaitDocumentLoaded() {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}
/**
 * Generates a unique ID with the specified length.
 * @param length - The desired length of the unique ID.
 * @returns A unique ID string of the specified length.
 */
export function Create_UniqueID(length: number): string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let uniqueID = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		uniqueID += charset[randomIndex];
	}

	return uniqueID;
}

export function deepMerge(obj1, obj2) {
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		// Merge arrays, trying to merge objects within them if they have the same `id`
		const mergedArray = [...obj1];
		for (const item2 of obj2) {
			const matchingIndex = mergedArray.findIndex(
				(item1) => item1.id && item2.id && item1.id === item2.id
			);
			if (matchingIndex !== -1) {
				// Merge matching objects
				mergedArray[matchingIndex] = deepMerge(mergedArray[matchingIndex], item2);
			} else {
				// Add new items that don't match
				mergedArray.push(item2);
			}
		}
		return mergedArray;
	} else if (typeof obj1 === "object" && typeof obj2 === "object") {
		// Merge objects deeply
		const result = { ...obj1 };
		for (const key in obj2) {
			if (obj2.hasOwnProperty(key)) {
				if (
					obj1[key] &&
					typeof obj1[key] === "object" &&
					typeof obj2[key] === "object"
				) {
					result[key] = deepMerge(obj1[key], obj2[key]);
				} else {
					result[key] = obj2[key];
				}
			}
		}
		return result;
	} else {
		return obj2; // Primitive types or mismatched types are overridden
	}
}

export function deepMergeInPlace(target, source) {
	if (Array.isArray(target) && Array.isArray(source)) {
		for (const [index, item] of source.entries()) {
			if (index < target.length) {
				// Merge objects within arrays based on `id`
				if (typeof target[index] === "object" && typeof item === "object") {
					deepMergeInPlace(target[index], item);
				} else {
					// Add new items or overwrite existing ones
					target[index] = item;
				}
			} else {
				target.push(item);
			}
		}
	} else if (typeof target === "object" && typeof source === "object") {
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (Array.isArray(target[key]) && Array.isArray(source[key])) {
					// Merge arrays and remove duplicates
					target[key] = [...new Set([...target[key], ...source[key]])];
				} else if (typeof target[key] === "object" && typeof source[key] === "object") {
					deepMergeInPlace(target[key], source[key]);
				} else {
					target[key] = source[key];
				}
			}
		}
	} else {
		// Overwrite for non-objects
		target = source;
	}
}

export function Get_Current_Domain() {
	const hostname = window.location.origin;
	const domainParts = hostname.split(".");
	const domain = domainParts.slice(-2).join(".");

	return domain;
}

export function Scroll_On_Click(Button, Target) {
	Button.addEventListener("click", function () {
		Target.scrollIntoView({ behavior: "smooth" });
	});
}

export function Apply_Drag(Drag_Object, Target: HTMLElement) {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let initialTargetX = 0;
	let initialTargetY = 0;

	// Mouse down event to start dragging
	Drag_Object.addEventListener("mousedown", function (event) {
		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;

		// Get the current position of the target
		const rect = Target.getBoundingClientRect();
		initialTargetX = rect.left;
		initialTargetY = rect.top;

		// Prevent default to avoid text selection and other default behaviors
		event.preventDefault();
	});

	// Mouse move event to drag the target
	document.addEventListener("mousemove", function (event) {
		if (!isDragging) return;

		// Calculate the new position based on the difference from the start position
		const deltaX = event.clientX - startX;
		const deltaY = event.clientY - startY;

		// Apply the new position to the target, considering the original distance
		// Target.style.transform = `translate(${initialTargetX + deltaX}px, ${
		// 	initialTargetY + deltaY
		// 	}px)`;
		Target.style.left = `${initialTargetX + deltaX}px`;
		Target.style.top = `${initialTargetY + deltaY}px`;

		const Parent = Target.parentElement;
		Parent.style.justifyContent = "start";
		Parent.style.alignItems = "start";
	});

	// Mouse up event to stop dragging
	document.addEventListener("mouseup", function () {
		if (!isDragging) return;
		isDragging = false;
	});
}

export function Update_Drag_Position(Element, event, offsetX, offsetY) {
	Element.style.left = `${event.clientX - offsetX}px`;
	Element.style.top = `${event.clientY - offsetY}px`;
}

export function ReArrange_Selector(value) {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

export function isObjectArray(value) {
	return (
		Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null)
	);
}

export function deepClone(data) {
	return JSON.parse(JSON.stringify(data));
}

export function Is_Same_OBJ(obj1, obj2) {
	if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
	for (let key in obj1) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
}
export async function WaitForElement(selector: string, timeout?: number): Promise<Element | null> {
	const startTime = Date.now();
	while (true) {
		const element = document.querySelector(selector);
		if (element) {
			return element;
		}
		if (timeout && Date.now() - startTime >= timeout) {
			console.warn(`Timeout: Element "${selector}" not found within ${timeout}ms`);
			return null;
		}
		await sleep(100);
	}
}

export function Download_File(data, filename) {
	var file = new Blob([data]);
	var a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

export function Input_File(Element: HTMLInputElement) {
	Element.addEventListener("change", async (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		if (!file) return;

		try {
			return file;
		} catch (error) {
			console.error("Error reading file:", error);
		}
	});
}

export function Get_Current_URL_Parameters() {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}

//---------------------------------------------
export async function Fire_Function_Event(Prefix = "Function", Function_Name, ...args) {
	const Sent_Event = new CustomEvent(`${Prefix}_${Function_Name}`, {
		detail: { data: args },
	});
	console.log("Sent", Sent_Event);
	window.dispatchEvent(Sent_Event);
}

export async function Fire_Function_Event_With_Return(Prefix = "Function", Function_Name, ...args) {
	const remote_id = Create_UniqueID(10);

	const Sent_Event = new CustomEvent(`${Prefix}_${Function_Name}`, {
		detail: JSON.stringify({ remote_id: remote_id, data: args }),
	});

	console.log("Sent", Sent_Event);

	window.dispatchEvent(Sent_Event);

	return new Promise((resolve, reject) => {
		window.addEventListener(
			`${Prefix}_${Function_Name}_${remote_id}`,
			function (event) {
				//@ts-ignore
				const Detail = JSON.parse(event.detail);
				console.log("Return Data", `${Prefix}_${Function_Name}_${remote_id}`, Detail);
				resolve(Detail);
			},
			{ once: true }
		);
	});
}

export async function On_Function_Event(
	Prefix = "Function",
	Function_Name: string,
	callback: Function
) {
	const On_Event_Run_Function = async function (event) {
		const Detail = JSON.parse(event.detail);
		console.log("Recived", event);

		//@ts-ignore
		let remote_id = Detail.remote_id;
		//@ts-ignore
		// delete event.detail.remote_id;
		//@ts-ignore
		let Get_Return;

		if (
			//@ts-ignore
			Detail.data &&
			//@ts-ignore
			Object.keys(Detail.data).length > 0
		) {
			//@ts-ignore
			Get_Return = await callback(...Detail.data);
		} else {
			Get_Return = await callback();
		}
		window.dispatchEvent(
			new CustomEvent(`${Prefix}_${Function_Name}_${remote_id}`, {
				detail: JSON.stringify(Get_Return),
			})
		);
	};

	window.addEventListener(`${Prefix}_${Function_Name}`, On_Event_Run_Function);

	return {
		Cancel: function () {
			window.removeEventListener(`${Prefix}_${Function_Name}`, On_Event_Run_Function);
		},
	};
}

export function Wait_One_Frame() {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve(true);
		});
	});
}

export function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
