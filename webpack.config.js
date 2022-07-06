const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		host: "0.0.0.0",
		port: 9000,
	},
	devtool: "inline-source-map",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
};
