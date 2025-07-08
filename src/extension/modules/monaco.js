import * as Monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as Monaco_Themes from "monaco-themes";

import * as editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js";

function Run() {
	Monaco_Themes;

	if (window["StyleShift"] == null) {
		setTimeout(Run, 1);
		return;
	}

	window["StyleShift"]["Build-in"]["Monaco"] = Monaco;
	window["StyleShift"]["Build-in"]["Monaco_Themes"] = "Monaco_All_Themes";

	self.MonacoEnvironment = {
		getWorkerUrl: function (moduleId, label) {
			switch (label) {
				case "css":
					return "./monaco/language/css/css.worker.js";
				case "javascript":
					return "./monaco/language/typescript/ts.worker.js";
				default:
					return editorWorker.initialize();
			}
		},
	};
}

Run();

export { Monaco, Monaco_Themes };
