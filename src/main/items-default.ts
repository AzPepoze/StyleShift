import { Open_Setting_Page } from "../styleshift/build-in-functions/extension";
import { Category } from "../styleshift/types/store";

let Default_StyleShift_Items: Category[] = [
	{
		Category: "☕ Buy me a coffee!",
		Rainbow: true,
		Settings: [
			{
				click_function: 'window.open("https://ko-fi.com/azpepoze");',
				color: "#ff040bff",
				font_size: 15,
				icon: "https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion-p-500.png",
				name: "Ko-fi",
				text_align: "left",
				type: "Button",
			},
		],
		Selector: "",
	},
	{
		Category: "🎉 Join my Discord!",
		Rainbow: true,
		Settings: [
			{
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#1932ffff",
				font_size: 15,
				icon: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
				name: "NEWTUBE",
				text_align: "left",
				type: "Button",
			},
		],
	},
	{
		Category: "⚙️ Extention's settings",
		Settings: [
			{
				description: "Description of this Checkbox",
				disable_function: "Disable_Extension_Function()",
				enable_css: "",
				enable_function: "Enable_Extension_Function()",
				id: "Enable_Extension",
				name: "Enable",
				type: "Checkbox",
				value: true,
			},
			{
				id: "Realtime_Extension",
				name: "Realtime Changing",
				type: "Checkbox",
				value: false,
			},
			{
				id: "Setting_BG_Transparent",
				name: "Setting Background transparent",
				type: "Checkbox",
				value: false,
			},
			{
				click_function: Open_Setting_Page,
				color: "#646464ff",
				description: "Description of this Button",
				font_size: 15,
				icon: "",
				id: "Test_Button",
				name: "Open settings page!",
				text_align: "center",
				type: "Button",
			},
			{
				click_function: 'window.open("https://github.com/AzPepoze/Newtube");',
				color: "#2e16feff",
				description: "Description of this Button",
				font_size: 15,
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				id: "Test_Button",
				name: "Github",
				text_align: "left",
				type: "Button",
			},
			{
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#e60005ff",
				description: "Description of this Button",
				font_size: 15,
				id: "Test_Button",
				name: "❗Report bugs / Issues❗\n",
				text_align: "center",
				type: "Button",
			},
		],
	},
	{
		Category: "↕️ Import / Export Theme",
		Settings: [
			{
				click_function:
					'await Copy_to_clipboard(await Export_StyleShift_JSON_Text());\n\nCreate_Notification({\nIcon : "✅",\nTitle : "StyleShift",\nContent : "Copied to clipboard!"\n})',
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Export "StyleShift Data" (Clipboard)',
				text_align: "center",
				type: "Button",
			},
			{
				click_function: `const Data = await Enter_Text_Prompt({ Title : 'Import_StyleShift Data', Placeholder : 'Paste StyleShift data text here.'});
                    await Import_StyleShift_JSON_Text(Data);
                    `,
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Import "StyleShift Data"',
				text_align: "center",
				type: "Button",
			},
		],
	},
];

export function Get_Default_Items() {
	return Default_StyleShift_Items;
}
