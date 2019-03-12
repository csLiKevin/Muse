const {resolve} = require("path");


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
                                ["@babel/plugin-proposal-decorators", { legacy: true }],
                                ["@babel/plugin-proposal-class-properties", { loose: true }]
                                
                            ],
                            presets: [
                                [
                                    "@babel/preset-env",
                                    { targets: { browsers: [">0.25%", "not ie 11", "not op_mini all"] } }
                                ],
                                "@babel/preset-react"
                            ]
                        }
                    }
                ]
            }
        ]
    },
    node: {
        fs: "empty"
    },
    output: {
        path: resolve(__dirname, "../static/client/js"),
        filename: "bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    }
};
