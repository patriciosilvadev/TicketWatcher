var path = require('path')
var webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './src/public/main.ts',
  output: {
    path: path.resolve(__dirname, './dist/public'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'], },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/, options: { appendTsSuffixTo: [/\.vue$/] } },
      { test: /\.(png|jpg|gif|svg|html)$/, loader: 'file-loader', options: { name: '[name].[ext]?[hash]' } }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/*.html", to: "[name].[ext]" }]),
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery', Popper: ['popper.js', 'default'] }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: { 'vue$': 'vue/dist/vue.esm.js' },
    extensions: ['*', '.js', '.vue', '.json']
  },
  externals: {
    // "vue": "Vue",
    // "bootstrap-vue": "Bootstrap-vue",
    "moment": "moment",
    "@fortawesome/": "@fortawesome/fontawesome",
    "@fortawesome/fontawesome-free-solid": "@fortawesome/fontawesome-free-solid"
  },
  performance: { hints: false },
}
