const path = require("path");


module.exports = {
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
