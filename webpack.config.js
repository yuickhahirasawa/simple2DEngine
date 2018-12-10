const path = require('path');

module.exports = {
    entry: "./example/index.ts",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'example')
    },
    mode: "development",
    target: "web",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.html/,
                use: 'html-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'html']
    },
    devServer: {
        contentBase: path.join(__dirname, "example"),
        port: 9000,
        filename: "bundle.js"
    }
};