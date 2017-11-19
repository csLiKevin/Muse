const path = require("path");


module.exports = {
    entry: "./index.jsx",
    externals: {
       "react": "React",
       "react-dom": "ReactDOM"
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                query: {
                    plugins: [
                        "transform-decorators-legacy",
                        "transform-es3-member-expression-literals",
                        "transform-es3-property-literals"
                    ],
                    presets: [
                        "es2015",
                        "stage-0",
                        "react"
                    ]
                },
                test: /\.jsx?$/
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
