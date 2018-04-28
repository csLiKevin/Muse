const cloneDeep = require("lodash.clonedeep");
const path = require("path");


const webConfig = {
    entry: "./index.jsx",
    externals: {
       "react": "React",
       "react-dom": "ReactDOM"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                "transform-decorators-legacy"
                            ],
                            presets: [
                                "stage-0",
                                "react"
                            ]
                        }
                    }
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "../static/client/js"),
        filename: "bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    }
};

const electronConfig = cloneDeep(webConfig);
electronConfig.output.filename = "electron.bundle.js";
electronConfig.target = "electron-main";

// Set the fs module in the webConfig to empty after the electronConfig copied the original value.
webConfig.node = {fs: "empty"};

module.exports = [electronConfig, webConfig];
