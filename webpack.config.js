// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "production", // or 'production' for production builds
	entry: "./src/Run.ts", // entry point of your content script
	output: {
		filename: "StyleShift.js", // name of the bundled script
		path: path.resolve(__dirname, "dist"), // output directory
	},
	resolve: {
		extensions: [".ts"], // Ensure .ts files are resolved
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						// Custom compress options to remove "use strict"
						directives: false,
					},
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
};
