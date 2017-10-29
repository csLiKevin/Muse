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
                    presets: ["env", "react"]
                },
                test: /\.jsx?$/
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "../static/client/js"),
        filename: "bundle.js",
        publicPath: "/"
    }
};
