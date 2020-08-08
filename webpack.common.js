const path = require('path');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        app: './src/concatened.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(de|en|fr|nl|it)$/),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
        new DashboardPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(process.cwd(), 'dist'), // path.resolve(__dirname, 'dist'),
        chunkFilename: 'chunks/[name]-[chunkhash].js'
    },
    resolve: {
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
            'img': path.resolve(__dirname, 'src/img')
        }
    },
    performance: {
        hints: false
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendor',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
    module: {
        // noParse: /node_modules\/localforage\/dist\/localforage.js/,
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                loader: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.csv$/,
                loader: 'csv-loader',
                options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true
                }
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                          name: "./plugin-config/[name].[ext]"
                      }
                    }
                ]
            }
        ]
    }
};