const {DefinePlugin} = require("webpack");


module.exports = {
    entry: "./electron/index.js",
    output: {
        path: __dirname,
        filename: "main.bundle.js",
        publicPath: "/"
    },
    plugins: [
        new DefinePlugin({
            "process.env.ELECTRON_DIRECTORY": JSON.stringify(__dirname),
            "process.env.API_URL": JSON.stringify(process.env.API_URL || "http://localhost:8000/"),
            "process.env.STATIC_URL": JSON.stringify(process.env.STATIC_URL || "../../static/client/")
        })
    ],
    target: "electron-main"
};
