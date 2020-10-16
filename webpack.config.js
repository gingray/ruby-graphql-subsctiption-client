const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
// CHANGE HERE FILE NAMES REGULAR ACTION CABLE OR GRAPHQL ACTION CABLE BUILD
module.exports = {
    entry: {index: path.resolve(__dirname, "src", "index_regular_action_cable.js")},
    output: {
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index_regular_action_cable.html")
        })
    ],
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    devServer: {
        host: "lvh.me",
        port: 8080,
        https: false
    }
};
