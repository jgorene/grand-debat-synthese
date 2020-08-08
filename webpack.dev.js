const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const concat = require('concat');

const result = concat(
        ['./src/js/lib.import.js',
            './src/js/index.js',
            './src/js/bubbles-chart.js',
            './src/js/keys.js',
            './src/js/tooltip.js',
            './src/js/words-resp.js',
            './src/js/map.js',
            './src/js/plot.js',
            './src/js/sequences.js'
        ],
        './src/concatened.js')
    .then(result => merge(common, {
        mode: 'development',
        watch: true,
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
            hot: true
        },
        plugins: [
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                defaultSizes: 'gzip'
            })
        ]
    }));

module.exports = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(result);
            reject((err) => console.log(err));
        }, 10);
    });
};
