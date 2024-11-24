import * as Monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as jszip from "jszip";
import * as Monaco_Themes from "monaco-themes";

window["Monaco"] = Monaco;
window["JSzip"] = jszip;
window["Monaco_Themes"] = "Monaco_All_Themes";

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === "json") {
			return "./monaco/language/json/json.worker.js";
		}
		if (label === "css" || label === "scss" || label === "less") {
			return "./monaco/language/css/css.worker.js";
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return "./monaco/language/html/html.worker.js";
		}
		if (label === "typescript" || label === "javascript") {
			return "./monaco/language/typescript/ts.worker.js";
		}
		return "./monaco/editor/editor.worker.js";
	},
};

chrome.runtime.getURL("");

console.log(chrome);
