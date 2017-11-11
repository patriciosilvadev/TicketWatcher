const webpack = require("webpack");
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const DEBUG = !process.env.NODE_ENV == 'production';

var plugins = [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];
if (!DEBUG) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        // new CompressionPlugin({
        //     asset: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: /\.js$/,
        //     threshold: 10240,
        //     minRatio: 0.8
        //   })
    );
}
var modules = {
    loaders: [
        { test: /\.css$/, loader: 'style-loader!css-loader?minimize' },
        { test: /\.png(\d+)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=image/png' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=image/svg+xml' },
        { test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' }
    ]
};

module.exports = {
    entry: { bundle: './src/main.js' },
    output: { path: path.join(__dirname, '/'), filename: 'main.js' },
    plugins: plugins,
    module: modules
};
