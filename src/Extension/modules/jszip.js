import * as jszip from "jszip";

function Run() {
	if (window["StyleShift"] == null) {
		setTimeout(Run, 0);
		return;
	}
	window["StyleShift"]["Build-in"]["JSzip"] = jszip;
}

Run();
