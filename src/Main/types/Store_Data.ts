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

export type Setting =
	| {
			type: "Text";
			id?: string;

			html: string;

			text_align?: "left" | "center" | "right";
			font_size?: number;

			Editable?: boolean;
	  }
	| {
			type: "Setting_Sub_Title";
			id?: string;

			text: string;

			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			Editable?: boolean;
	  }
	| {
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
	  }
	| {
			type: "Checkbox";
			id: string;
			name: string;
			description?: string;

			value: boolean;

			setup_css?: string;
			setup_function?: string | Function;

			enable_css?: string;
			enable_function?: string | Function;

			disable_css?: string;
			disable_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Number_Slide";
			id: string;
			name: string;
			description?: string;

			min?: number;
			max?: number;
			step?: number;
			value: number;

			//--------------

			var_css?: string;

			setup_function?: string | Function;

			update_css?: string | Function;
			update_function?: string | Function;

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Dropdown";
			id: string;
			name: string;
			description?: string;

			value: string;

			//--------------

			setup_css?: string;
			setup_function?: string | Function;

			options: { [key: string]: option };

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Color";
			id: string;
			name: string;
			description?: string;
			show_alpha_slider?: boolean;

			value: string;

			//--------------

			var_css?: string;

			setup_function?: string | Function;

			update_css?: string | Function;
			update_function?: string | Function;

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Custom";
			id: string;

			//--------------

			setup_css?: string;
			setup_function?: string | Function;

			ui_function?: string;

			//--------------

			Editable?: boolean;
	  };
