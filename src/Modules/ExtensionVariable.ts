var Ver = chrome.runtime.getManifest().version

var isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

var inIframe
try {
     inIframe = window.self !== window.top;
} catch (e) {
     inIframe = true;
}

var DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`
var DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`

var Extension_Location = chrome.runtime.getURL('')
var Extension_ID = Extension_Location.slice(19, -1)

var in_Setting_Page

if (window.location.href.includes("Newtube_setting")) {
     document.title = "NewTube Setting";
     in_Setting_Page = true
} else {
     in_Setting_Page = false
}

export function Get_Extension_ID() {
     return Extension_ID
}

export function Get_Extension_Location() {
     return Extension_Location
}