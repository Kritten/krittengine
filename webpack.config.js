const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'krittengine.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './demo',
        publicPath: '/dist/'
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};