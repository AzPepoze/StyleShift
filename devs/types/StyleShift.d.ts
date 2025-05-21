declare global {

export function Set_Value(id: string, value: any): void;
export function Get_Value(id: string): any;

/**
 * Pauses execution for a specified delay.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(1000); // Pauses execution for 1 second
 */
export  function sleep(delay: number): Promise<void>;
/**
 * Converts a hex color string to an RGBA object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number; a: number }}
 * @example
 * HEX_to_RBGA("#ff5733"); // { r: 255, g: 87, b: 51, a: 1 }
 */
export  function HEX_to_RBGA(hex: string): {
    r: number;
    g: number;
    b: number;
    a: number;
};
/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * HEX_to_RBG("#ff5733"); // { r: 255, g: 87, b: 51 }
 */
export  function HEX_to_RBG(hex: string): {
    r: number;
    g: number;
    b: number;
};
/**
 * Converts RGBA values to a hex color string.
 * @param {number} r - The red value.
 * @param {number} g - The green value.
 * @param {number} b - The blue value.
 * @param {number} [a=1] - The alpha value.
 * @returns {string}
 * @example
 * RGBA_to_HEX(255, 87, 51, 0.5); // "#ff573380"
 */
export  function RGBA_to_HEX(r: number, g: number, b: number, a?: number): string;
/**
 * Converts RGB values to an HSV object.
 * @param {{ r: number; g: number; b: number }} rgb - The RGB values.
 * @returns {{ h: number; s: number; v: number }}
 * @example
 * RGB_to_HSV({ r: 255, g: 87, b: 51 }); // { h: 14, s: 80, v: 100 }
 */
export  function RGB_to_HSV(rgb: {
    r: number;
    g: number;
    b: number;
}): {
    h: number;
    s: number;
    v: number;
};
/**
 * Converts HSV values to an RGB object.
 * @param {{ h: number; s: number; v: number }} hsv - The HSV values.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * HSV_to_RGB({ h: 14, s: 80, v: 100 }); // { r: 255, g: 87, b: 51 }
 */
export  function HSV_to_RGB(hsv: {
    h: number;
    s: number;
    v: number;
}): {
    r: number;
    g: number;
    b: number;
};
/**
 * Checks if an element is scrollable.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean}
 * @example
 * is_Scrollable(document.body); // true or false depending on the body scrollability
 */
export  function is_Scrollable(element: HTMLElement): boolean;
/**
 * Gets the nearest scrollable parent of an element.
 * @param {HTMLElement | null} element - The element to check.
 * @returns {HTMLElement | null}
 * @example
 * Get_Scroll_Parent(document.querySelector("#myElement")); // Returns the nearest scrollable parent
 */
export  function Get_Scroll_Parent(element: HTMLElement | null): HTMLElement | null;
/**
 * Converts a string to a number.
 * @param {string} str - The string to convert.
 * @returns {number}
 * @example
 * stringToNumber("example"); // Returns a numerical hash of the string
 */
export  function stringToNumber(str: string): number;
/**
 * Generates a random number between a minimum and maximum value using a seed.
 * @param {number} Minimum - The minimum value.
 * @param {number} Maximum - The maximum value.
 * @param {string | number} Seed - The seed value.
 * @returns {number}
 * @example
 * Random(1, 100, "seed"); // Returns a random number between 1 and 100 based on the seed
 */
export  function Random(Minimum: number, Maximum: number, Seed: string | number): number;
/**
 * Gets the document body element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await GetDocumentBody(); // Returns the document body element
 */
export  function GetDocumentBody(): Promise<HTMLElement>;
/**
 * Gets the document head element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await GetDocumentHead(); // Returns the document head element
 */
export  function GetDocumentHead(): Promise<HTMLElement>;
/**
 * Executes a callback when a target element is removed from the DOM.
 * @param {HTMLElement} targetElement - The target element.
 * @param {Function} callback - The callback function.
 * @example
 * Once_Element_Remove(document.querySelector("#myElement"),() => console.log("Element removed"));
 */
export  function Once_Element_Remove(targetElement: HTMLElement, callback: Function): void;
/**
 * Gets the center position of an element.
 * @param {HTMLElement} element - The element to check.
 * @returns {{ x: number; y: number }}
 * @example
 * Get_Element_Center_Position(document.querySelector("#myElement")); // { x: number, y: number }
 */
export  function Get_Element_Center_Position(element: HTMLElement): {
    x: number;
    y: number;
};
/**
 * Waits for the document to be fully loaded.
 * @returns {Promise<number>}
 * @example
 * await Wait_Document_Loaded(); // Waits until the document is fully loaded
 */
export  function Wait_Document_Loaded(): Promise<number>;
/**
 * Creates a unique ID of a specified length.
 * @param {number} length - The length of the ID.
 * @returns {string}
 * @example
 * Create_UniqueID(10); // Returns a unique ID of length 10
 */
export  function Create_UniqueID(length: number): string;
/**
 * Gets the current domain.
 * @returns {string}
 * @example
 * Get_Current_Domain(); // Returns the current domain
 */
export  function Get_Current_Domain(): string;
/**
 * Scrolls to a target element when a button is clicked.
 * @param {HTMLElement} Button - The button element.
 * @param {HTMLElement} Target - The target element.
 * @example
 * Scroll_On_Click(document.querySelector("#myButton"), document.querySelector("#myTarget"));
 */
export  function Scroll_On_Click(Button: HTMLElement, Target: HTMLElement): void;
/**
 * Applies drag functionality to an element.
 * @param {HTMLElement} Drag_Object - The draggable object.
 * @param {HTMLElement} Target - The target element.
 * @example
 * Apply_Drag(document.querySelector("#dragObject"), document.querySelector("#target"));
 */
export  function Apply_Drag(Drag_Object: HTMLElement, Target: HTMLElement): void;
/**
 * Updates the drag position of an element.
 * @param {HTMLElement} Element - The element to update.
 * @param {MouseEvent} event - The mouse event.
 * @param {number} offsetX - The X offset.
 * @param {number} offsetY - The Y offset.
 * @example
 * Update_Drag_Position(document.querySelector("#element"), event, 10, 10);
 */
export  function Update_Drag_Position(Element: HTMLElement, event: MouseEvent, offsetX: number, offsetY: number): void;
/**
 * Rearranges a selector string.
 * @param {string} value - The selector string.
 * @returns {string}
 * @example
 * ReArrange_Selector("div, span"); // "div,\nspan"
 */
export  function ReArrange_Selector(value: string): string;
/**
 * Checks if a value is an array of objects.
 * @param {any} value - The value to check.
 * @returns {boolean}
 * @example
 * isObjectArray([{ a: 1 }, { b: 2 }]); // true
 */
export  function isObjectArray(value: any): boolean;
/**
 * Deep clones an object.
 * @param {any} data - The data to clone.
 * @returns {any}
 * @example
 * deepClone({ a: 1 }); // { a: 1 }
 */
export  function deepClone(data: any): any;
/**
 * Checks if two objects are the same.
 * @param {object} obj1 - The first object.
 * @param {object} obj2 - The second object.
 * @returns {boolean}
 * @example
 * Is_Same_OBJ({ a: 1 }, { a: 1 }); // true
 */
export  function Is_Same_OBJ(obj1: object, obj2: object): boolean;
/**
 * Waits for an element to appear in the DOM.
 * @param {string} selector - The CSS selector.
 * @param {number} [timeout] - The timeout in milliseconds.
 * @returns {Promise<HTMLElement | null>}
 * @example
 * await WaitForElement("#myElement", 5000); // Waits for the element to appear within 5 seconds
 */
export  function WaitForElement(selector: string, timeout?: number): Promise<HTMLElement | null>;
/**
 * Downloads a file with the specified data and filename.
 * @param {BlobPart} data - The file data.
 * @param {string} filename - The filename.
 * @example
 * Download_File("Hello, world!", "hello.txt");
 */
export  function Download_File(data: BlobPart, filename: string): void;
/**
 * Handles file input change event.
 * @param {HTMLInputElement} Element - The input element.
 * @example
 * Input_File(document.querySelector("#fileInput"));
 */
export  function Input_File(Element: HTMLInputElement): void;
/**
 * Gets the current URL parameters.
 * @returns {{ [key: string]: string }}
 * @example
 * Get_Current_URL_Parameters(); // Returns an object with the current URL parameters
 */
export  function Get_Current_URL_Parameters(): {
    [key: string]: string;
};
/**
 * Fires a custom event with the specified function name and arguments.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<void>}
 * @example
 * await Fire_Function_Event("Custom", "MyFunction", 1, 2, 3);
 */
export  function Fire_Function_Event(Prefix: string, Function_Name: string, ...args: any[]): Promise<void>;
/**
 * Fires a custom event with the specified function name and arguments, and waits for a return value.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<any>}
 * @example
 * const result = await Fire_Function_Event_With_Return("Custom", "MyFunction", 1, 2, 3);
 */
export  function Fire_Function_Event_With_Return(Prefix: string, Function_Name: string, ...args: any[]): Promise<any>;
/**
 * Listens for a custom event with the specified function name and executes a callback.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {Function} callback - The callback function.
 * @returns {Promise<{ Cancel: Function }>}
 * @example
 * const listener = await On_Function_Event("Custom", "MyFunction", (data) => console.log(data));
 * listener.Cancel(); // Cancels the event listener
 */
export  function On_Function_Event(Prefix: string, Function_Name: string, callback: Function): Promise<{
    Cancel: Function;
}>;
/**
 * Waits for one animation frame.
 * @returns {Promise<boolean>}
 * @example
 * await Wait_One_Frame(); // Waits for one animation frame
 */
export  function Wait_One_Frame(): Promise<boolean>;
/**
 * Inserts a new node after an existing node.
 * @param {Node} newNode - The new node.
 * @param {Node} existingNode - The existing node.
 * @example
 * insertAfter(document.createElement("div"), document.querySelector("#existingNode"));
 */
export  function insertAfter(newNode: Node, existingNode: Node, parentNode?: Node): void;
/**
 * Formats a number with commas as thousands separators.
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 * @example
 * numberWithCommas(1000); // "1,000"
 */
export  function numberWithCommas(x: any): any;

import { Category, Setting } from "../types/Store_Data";
/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {boolean}
 * @example
 * Copy_to_clipboard("Hello, world!"); // Copies "Hello, world!" to the clipboard
 */
export  function Copy_to_clipboard(text: string): void;
/**
 * Creates a notification.
 * @param {Object} options - The notification options.
 * @param {string} [options.Icon=null] - The icon.
 * @param {string} [options.Title="StyleShift"] - The title.
 * @param {string} [options.Content=""] - The content.
 * @param {number} [options.Timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await Create_Notification({ Title: "Hello", Content: "This is a notification" });
 */
export  function Create_Notification({ Icon, Title, Content, Timeout }: {
    Icon?: any;
    Title?: string;
    Content?: string;
    Timeout?: number;
}): Promise<{
    Set_Icon: (New_Icon: any) => void;
    Set_Content: (New_Content: any) => void;
    Set_Title: (New_Title: any) => void;
    Close: () => Promise<void>;
}>;
/**
 * Creates an error notification.
 * @param {string} Content - The error content.
 * @returns {Promise<Object>}
 * @example
 * await Create_Error("An error occurred");
 */
export  function Create_Error(Content: any, Timeout?: number): Promise<{
    Set_Icon: (New_Icon: any) => void;
    Set_Content: (New_Content: any) => void;
    Set_Title: (New_Title: any) => void;
    Close: () => Promise<void>;
}>;
/**
 * Shows a text input prompt window.
 * @param {{ Title : string, Placeholder : string, Content : string }} Options
 * @returns {Promise<string>}
 * @example
 * await Enter_Text_Prompt({ Title : "Enter your name", Placeholder : "John Doe", Content : "Please enter your name." });
 */
export  function Enter_Text_Prompt({ Title, Placeholder, Content }: {
    Title?: string;
    Placeholder?: string;
    Content?: string;
}): Promise<unknown>;
/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<File>}
 * @example
 * const file = await Get_File(".txt");
 */
export  function Get_File(type: any): Promise<unknown>;
/**
 * Imports StyleShift data and updates the saved data.
 * @param {Object} StyleShift_Data - The JSON data to import.
 * @returns {Promise<void>}
 * @example
 * await Import_StyleShift_Data(data);
 */
export  function Import_StyleShift_Data(StyleShift_Data: Object): Promise<void>;
/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = Export_StyleShift_Data();
 */
export  function Export_StyleShift_Data(): {};
/**
 * Imports StyleShift data from a JSON string.
 * @param {string} Text - The JSON string to import.
 * @returns {Promise<void>}
 * @example
 * const json = '{"Custom_StyleShift_Items":[{"Category":"Test","Settings":[{"type":"Text","id":"test_text","html":"<p>Test</p>"}]}]}';
 * await Import_StyleShift_JSON_Text(json);
 */
export  function Import_StyleShift_JSON_Text(Text: any): Promise<void>;
/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = Export_StyleShift_JSON_Text();
 */
export  function Export_StyleShift_JSON_Text(): string;
/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} StyleShift_Data - The JSON data.
 * @param {string} zipFileName - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await Export_StyleShift_Zip(data, "styleshift.zip");
 */
export  function Export_StyleShift_Zip(StyleShift_Data: any, zipFileName: any): Promise<void>;
/**
 * Imports StyleShift data from a ZIP file.
 * @param {File} zipFile - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await Import_StyleShift_Zip(file);
 */
export  function Import_StyleShift_Zip(zipFile: any): Promise<Category[]>;
/**
 * Appends a child element to a parent HTMLDivElement.
 *
 * This function dynamically appends a child element to the specified parent
 * based on the properties of the child. If the child has a `Frame` property,
 * it appends the frame. If the child has a `Button` property, it appends the
 * button. Otherwise, it appends the child element itself.
 *
 * @param {HTMLDivElement} Parent - The parent element to which the child will be appended.
 * @param {Object} Child - The child element or object with specific properties (`Frame` or `Button`).
 */
export  function Dynamic_Append(Parent: HTMLDivElement, Child: Object | any): void;
/**
 * Retrieves a specific element from a given object.
 *
 * This function checks the provided object for specific properties
 * (`Frame` or `Button`) and returns the corresponding element if found.
 * If neither property is present, it returns the object itself.
 *
 * @param {Object} Child - The object containing potential elements.
 * @returns {HTMLElement | Object} The element associated with the `Frame` or `Button`
 * property, or the object itself if neither property is found.
 */
export  function Dynamic_Get_Element(Child: Object | any): any;
/**
 * Opens the StyleShift settings page.
 *
 * This function opens the StyleShift settings page in a new tab by calling
 * window.open with the URL of the settings page.
 *
 * @example
 * Open_Setting_Page();
 */
export  function Open_Setting_Page(): void;
/**
 * Enables the extension.
 * @example
 * Enable_Extension_Function();
 */
export  function Enable_Extension_Function(): Promise<void>;
/**
 * Disables the extension.
 * @example
 * Disable_Extension_Function();
 */
export  function Disable_Extension_Function(): Promise<void>;
/**
 * Retrieves the StyleShift value associated with a given ID.
 *
 * This function takes an ID, uses the Load function to retrieve the associated
 * data, and returns the data as a JSON string.
 *
 * @param {string} id - The unique identifier for the data to be retrieved.
 * @returns {Promise<string>} The JSON string representation of the retrieved data.
 */
export  function Load_StyleShift_Value(id: any): Promise<string>;
/**
 * Saves the StyleShift value associated with a given ID.
 *
 * This function takes an ID and a JSON string value, parses the JSON string,
 * and saves the resulting data under the specified ID using the Save function.
 *
 * @param {string} id - The unique identifier for the data to be saved.
 * @param {string} value - The JSON string representing the data to be saved.
 * @returns {Promise<any>} The result of the save operation.
 */
export  function Save_StyleShift_Value(id: any, value: string): Promise<boolean>;
/**
 * Creates a setting UI element from the given type and setting.
 *
 * This function will create a UI element using the provided type and setting.
 * The UI element will be appended to the `StyleShift_Station` element and
 * assigned a unique "styleshift-ui-id" attribute.
 *
 * @param {string} type - The type of the setting UI element.
 * @param {Setting | any} This_Setting - The setting associated with the UI element.
 * @param {...any} args - Additional arguments to pass to the UI element function.
 * @returns {Promise<string>} The value of the "styleshift-ui-id" attribute assigned to the UI element.
 */
export  function _Create_StyleShift_Setting_UI(type: any, This_Setting: Setting | any, ...args: any[]): Promise<string>;

export type Category = {
    Category: string;
    Rainbow?: boolean;
    Selector?: string;
    Editable?: boolean;
    Settings: Setting[];
    Highlight_Color?: string;
};
export type option = {
    enable_css?: string;
    enable_function?: string | Function;
    disable_function?: string | Function;
};
export type color_obj = {
    HEX: string;
    Alpha: number;
};
export type Setting = {
    type: "Text";
    id?: string;
    html: string;
    text_align?: "left" | "center" | "right";
    font_size?: number;
    Editable?: boolean;
} | {
    type: "Setting_Sub_Title";
    id?: string;
    text: string;
    text_align?: "left" | "center" | "right";
    color?: string;
    font_size?: number;
    Editable?: boolean;
} | {
    type: "Button";
    id?: string;
    name: string;
    description?: string;
    icon?: string;
    text_align?: "left" | "center" | "right";
    color?: string;
    font_size?: number;
    click_function?: string | Function;
    Editable?: boolean;
} | {
    type: "Checkbox";
    id: string;
    name: string;
    description?: string;
    value: boolean;
    constant_css?: string;
    setup_function?: string | Function;
    enable_css?: string;
    enable_function?: string | Function;
    disable_css?: string;
    disable_function?: string | Function;
    Editable?: boolean;
} | {
    type: "Number_Slide";
    id: string;
    name: string;
    description?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    var_css?: string;
    constant_css?: string | Function;
    setup_function?: string | Function;
    update_function?: string | Function;
    Editable?: boolean;
} | {
    type: "Dropdown";
    id: string;
    name: string;
    description?: string;
    value: string;
    constant_css?: string;
    setup_function?: string | Function;
    options: {
        [key: string]: option;
    };
    Editable?: boolean;
} | {
    type: "Color";
    id: string;
    name: string;
    description?: string;
    show_alpha_slider?: boolean;
    value: string;
    var_css?: string;
    constant_css?: string | Function;
    setup_function?: string | Function;
    update_function?: string | Function;
    Editable?: boolean;
} | {
    type: "Text_Input";
    id: string;
    name: string;
    description?: string;
    value: string;
    update_function?: string | ((value: string) => void);
    Editable?: boolean;
} | {
    type: "Image_Input";
    id: string;
    name: string;
    description?: string;
    value: string;
    MaxFileSize: number;
    Editable?: boolean;
} | {
    type: "Preview_Image";
    id: string;
    Editable?: boolean;
} | {
    type: "Custom";
    id: string;
    constant_css?: string;
    setup_function?: string | Function;
    setup_?: string | Function;
    ui_function?: string;
    Editable?: boolean;
} | {
    type: "Combine_Settings";
    id?: string;
    name?: string;
    description?: string;
    sync_id: string[];
    update_function?: string;
    Editable?: boolean;
};


}
export {};