import * as Monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as Monaco_Themes from "monaco-themes";

function Run() {
	if (window["StyleShift"] == null) {
		setTimeout(Run, 0);
		return;
	}
	window["StyleShift"]["Build-in"]["Monaco"] = Monaco;
	window["StyleShift"]["Build-in"]["Monaco_Themes"] = "Monaco_All_Themes";

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

	// On_Function_Event("StyleShift", "Monaco_Create_Code_Editor", (Ediot_OBJ) => {
	// 	const frame_id = Ediot_OBJ.frame_id;
	// 	delete Ediot_OBJ.frame_id;
	// 	const Frame = document.getElementById(frame_id);

	// 	console.log(Frame);

	// 	const Code_Editor = Monaco.editor.create(Frame, Ediot_OBJ);

	// 	Code_Editor.onKeyDown(function () {
	// 		Fire_Function_Event("onKeyDown", frame_id, Code_Editor.getValue());
	// 	});

	// 	Code_Editor.onDidBlurEditorWidget(function () {
	// 		Fire_Function_Event("onBlur", frame_id, Code_Editor.getValue());
	// 	});
	// });
}

Run();
