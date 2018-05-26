var path = require('path')
var webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  //  mode: 'production',
  entry: './src/public/main.js',
  output: {
    path: path.resolve(__dirname, './dist/public'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'], },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/, options: { appendTsSuffixTo: [/\.vue$/] } },
      { test: /\.(png|jpg|gif|svg|html)$/, loader: 'file-loader', options: { name: '[name].[ext]?[hash]' } }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{ from: { glob: './src/public/index.html', dot: true }, to: '[name].[ext]' },
    { from: { glob: './src/public/error.html', dot: true }, to: '[name].[ext]' }]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
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

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { warnings: false }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true })
  ])
}