var merge = require('webpack-merge');
var common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin'); // supprime les fichiers js.map
// var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            defaultSizes: 'gzip',
            analyzerMode: 'static'
        }),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: '[name].[hash].css',
        //     chunkFilename: '[id].[hash].css',
        // })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin()
        ],
        usedExports: true,
        sideEffects: true
    },
    // module: {
    //     rules: [{
    //         test: /\.(sa|sc|c)ss$/,
    //         use: [
    //             // MiniCssExtractPlugin.loader,
    //             'css-loader',
    //             'postcss-loader',
    //             'sass-loader',
    //         ],
    //     }]
    // },
});