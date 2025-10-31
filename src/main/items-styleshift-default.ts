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
				                id: "Enable_Extension",
								name: "Enable StyleShift Theme",
								type: "Checkbox",
								value: true,
				                enable_css: `
				                    .sbfl_b,.sbsb_a,
				                    #container.style-scope.ytd-masthead,
				                    ytd-mini-guide-renderer,
				                    ytd-mini-guide-entry-renderer,
				                    ytd-page-manager>*.ytd-page-manager,
				                    #channel-container,
				                    #channel-header,
				                    #tabs-inner-container,
				                    .playlist-items,
				                    #video-preview-container,
				                    ytd-simple-menu-header-renderer,
				                    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
				                    #description,
				                    #player,
				                    ytd-thumbnail-overlay-resume-playback-renderer,
				                    .button-container.ytd-rich-shelf-renderer,
				                    ytd-video-preview,
				                    ytd-button-renderer.ytd-live-chat-frame,
				                    #player-container,
				                    .ytp-endscreen-content,
				                    ytd-thumbnail-overlay-time-status-renderer badge-shape,
				                    .ytSearchboxComponentInputBox
				                    {
				                        background: transparent !important;
				                    }
				
				                    .ytSearchboxComponentInputBox {
				                        border-color: transparent !important;
				                    }
				
				                    yt-interaction{
				                        overflow: visible !important;
				                    }
				
				                    #guide-inner-content{
				                       transform: translateZ(0px); 
				                    }
				
				                    html:not(.style-scope)[system-icons]:not(.style-scope)
				                    {
				                        background: black !important;
				                    }
				
				                    body {
				                        overflow: auto;
				                    }
				
				                    .ytp-contextmenu .ytp-menuitem {
				                        display: flex !important;
				                        align-items: center;
				                        flex-direction: row;
				                    }
				
				                    .ytSearchboxComponentInputBox::placeholder {
				                        color: var(--secondary-text-color) !important;
				                    }
				
				                    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline{
				                        background: var(--top-bar-and-search-background);
				                    }
				
				                    ytd-text-inline-expander yt-attributed-string a{
				                        color: var(--link-color) !important;
				                    }
				
				                    ytd-menu-renderer .ytd-menu-renderer[style-target=button] yt-icon{
				                        transition: background 0.2s, transform 0.1s;
				                        background: transparent;
				                        border-radius: var(--global-radius);
				                    }
				
				                    .ytp-chapters-container{
				                        flex-wrap: nowrap;
				                        display: flex;
				                    }
				
				                    .ytp-gradietop{
				                        border-radius: var(--player-edge-radius) var(--player-edge-radius) 0px 0px;
				                    }
				                      
				                    ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover yt-icon{
				                        background: var(--theme-transparent-color);
				                                            transform: scale(1.3);
				                                            }
				                        
				                                            :root {
				                                                --theme-color: #659aff;
				                                                --theme-transparent-color: #659aff33;
				                                                --theme-fort: #659aff33;
				                                                --playlist-bg: #659aff33;
				                                                --text-color: #ffffff;
				                                                --secondary-text-color: #c4c4c4;
				                                                --border-width: 8px;
				                                                --player-bg-border-width: 1px;
				                                                --border-color: #099DFF80;
				                                                --border-hover-color: #659aff;
				                                                --border-click-color: #ffffff;
				                                                --bg-color: #0f0f0f;
				                                                --in-player-bg-color: #00000080;
				                                                --top-bar-and-search-background: #00000080;
				                                                --search-background-hover: #ffffff1a;
				                                                --global-radius: 10px;
				                                                --player-edge-radius: 20px;
				                                                --border-minus: calc(var(--border-width) * -1);
				                                                --border-width-hover: 1px;
				                                                --border-minus-hover: calc(var(--border-width-hover) * -1);
				                                                --thumb-zoom-scale: 1.075;
				                                                --sub-sha-blur: 2px;
				                                                --sub-width: 700;
				                                                --sub-space: 2px;
				                                                --sub-color: #ffffff;
				                                                --sub-bg: #00000000;
				                                                --sub-sha-color: #000000;
				                                                --subscribe-bg-color: #ff0000;
				                                                                        --subscribe-text-color: #ffffff;
				                                                                    }
				                                                
				                                                                    /* General Component Styling */
				                                                                    ytd-playlist-panel-video-renderer, ytd-guide-entry-renderer, ytd-playlist-thumbnail, ytd-thumbnail, ytd-compact-video-renderer, #button.ytd-menu-renderer, ytd-video-renderer, #items > *, ytd-notification-renderer {
				                                                                        transition: all .2s;
				                                                                    }
				                                                
				                                                                    .ytp-swatch-background-color, #progress.yt-page-navigation-progress {
				                                                                        background: var(--theme-color) !important;
				                                                                    }
				                                                
				                                                                    #text-container.yt-notification-action-renderer, [role="search"]:hover, .yt-spec-button-shape-next--outline:hover, #reply-button-end button:hover {
				                                                                        border-color: var(--theme-color) !important;
				                                                                    }
				                                                
				                                                                    .watch-skeleton .skeleton-bg-color, ytd-author-comment-badge-renderer, .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled, #reply-button-end button {
				                                                                        background: var(--theme-transparent-color) !important;
				                                                                    }
				                                                
				                                                                    ytd-playlist-panel-video-renderer:hover {
				                                                                        background-color: var(--playlist-bg) !important;
				                                                                    }
				                                                
				                                                                    ytd-thumbnail-overlay-time-status-renderer, .ytd-thumbnail-overlay-bottom-panel-renderer {
				                                                                        background-color: var(--hover-time-background) !important;
				                                                                    }
				                                                
				                                                                    .gsfs, .ytp-ce-channel-metadata, .ytp-panel-menu, #time.ytd-macro-markers-list-item-renderer {
				                                                                        color: var(--text-color) !important;
				                                                                    }
				                                                
				                                                                    ytd-multi-page-menu-renderer, .ytp-offline-slate-background, .videowall-endscreen {
				                                                                        border-radius: var(--player-edge-radius) !important;
				                                                                    }
				                                                
				                                                                    a.thumbnail, ytd-playlist-thumbnail, ytd-thumbnail, #thumbnail, [role="listbox"], .ytp-ce-video, .ytp-ce-playlist, [aria-live="polite"], .ytp-tooltip-bg, .badge, .iv-card, #guide-content, .sbsb_d, #chips-wrapper, ytd-post-renderer, #tabs-container, ytd-miniplayer, .skeleton-bg-color, .captions-text, ytd-menu-popup-renderer, yt-live-chat-text-message-renderer {
				                                                                                            border-radius: var(--global-radius) !important;
				                                                                                        }
				                                                                        
				                                                                                        /* Player, Buttons, and Menus */
				                                                                                        .ytp-large-play-button.ytp-button:hover path.ytp-large-play-button-bg {
				                                                                                            filter: drop-shadow(0px 0px 6px black);
				                                                                                        }
				                                                                                        .ytp-menuitem-icon path:not([fill=\"none\"]), .ytd-thumbnail-overlay-hover-text-renderer path, .ytp-heat-map-graph, svg [fill=\"#FF0000\"] {
				                                                                                            fill: var(--theme-color) !important;
				                                                                                        }
				                                                                                        .badge-style-type-live-now.ytd-badge-supported-renderer, .badge-style-type-starting-soon.ytd-badge-supported-renderer {
				                                                                                            border-color: var(--theme-color) !important;
				                                                                                            color: var(--theme-color) !important;
				                                                                                        }
				                                                                                        tp-yt-paper-slider {
				                                                                                            --paper-progress-active-color: var(--theme-color) !important;
				                                                                                        }
				                                                                                        *::selection, .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
				                                                                                            background: var(--theme-color) !important;
				                                                                                            color: var(--text-color) !important;
				                                                                                        }
				                                                                                        #container.ytd-searchbox input.ytd-searchbox, .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text {
				                                                                                            color: var(--theme-color) !important;
				                                                                                        }
				                                                                                        .ytp-chrome-top, .ytp-chrome-bottom, .ytp-gradient-bottom, ytd-playlist-panel-video-renderer, ytd-menu-renderer {
				                                                                                            transition: all .2s !important;
				                                                                                        }
				                                                                                        .ytp-popup.ytp-settings-menu, .ytp-gradient-bottom, .iv-drawer, .ytp-cards-teaser-box, .ytp-popup {
				                                                                                                                background-color: var(--in-player-bg-color) !important;
				                                                                                                            }
				                                                                                            
				                                                                                                            /* Final Fixes & Pseudo-elements */
				                                                                                                            html {
				                                                                                                                --ytd-chip-cloud-background: rgba(0,0,0,.3) !important;
				                                                                                                                --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;
				                                                                                                                --yt-spec-brand-background-solid: var(--bg-color) !important;
				                                                                                                                --yt-spec-general-background-a: var(--bg-color) !important;
				                                                                                                                --yt-spec-call-to-action: var(--theme-color) !important;
				                                                                                                                --yt-spec-suggested-action: var(--theme-transparent-color) !important;
				                                                                                                                --yt-spec-badge-chip-background: var(--theme-transparent-color) !important;
				                                                                                                                --yt-spec-text-primary: var(--text-color) !important;
				                                                                                                                --yt-spec-text-secondary: var(--secondary-text-color) !important;
				                                                                                                                --yt-spec-brand-button-background: var(--theme-color) !important;
				                                                                                                                --yt-spec-static-brand-red: var(--theme-color) !important;
				                                                                                                                --yt-spec-brand-icon-inactive: var(--theme-color) !important;
				                                                                                                                --yt-spec-10-percent-layer: var(--theme-transparent-color) !important;
				                                                                                                                --yt-spec-wordmark-text: var(--text-color) !important;
				                                                                                                                --yt-spec-button-chip-background-hover: var(--search-background-hover) !important;
				                                                                                                                --yt-spec-text-primary-inverse: var(--text-color) !important;
				                                                                                                                --yt-spec-base-background: var(--top-bar-and-search-background) !important;
				                                                                                                                --yt-spec-raised-background: var(--top-bar-and-search-background) !important;
				                                                                                                                --yt-spec-menu-background: var(--top-bar-and-search-background) !important;
				                                                                                                                --yt-spec-additive-background: var(--theme-transparent-color) !important;
				                                                                                                            }
				                                                                                                        `			},
			{
				id: "Realtime_Extension",
				name: "Realtime Changing",
				type: "Checkbox",
				value: false,
			},
			{
				type: "Checkbox",
				id: "Setting_BG_Transparent",
				name: "Enable Blur Background",
				description: "Makes the settings menu background transparent and blurred.",
				value: true,
				enable_css: `
			      .STYLESHIFT-Window {
			        background-color: rgba(30, 30, 30, 0.5) !important;
			        backdrop-filter: blur(var(--setting-bg-blur-amount, 10px)) !important;
			        transition: background-color 0.3s, backdrop-filter 0.3s;
			      }
			    `,
				disable_css: `
			      .STYLESHIFT-Window {
			        background-color: rgb(30, 30, 30) !important;
			        backdrop-filter: none !important;
			      }
			    `,
			},
			{
				type: "Number_Slide",
				id: "Setting_BG_Blur_Amount",
				name: "Background Blur Amount",
				description: "Adjusts the blur amount for the settings menu background.",
				value: 10,
				min: 0,
				max: 50,
				step: 1,
				var_css: "--setting-bg-blur-amount",
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

export function Get_StyleShift_Default_Items() {
	return Default_StyleShift_Items;
}
