const webpack           = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin     = require('offline-plugin')
const path              = require('path')
const resolve           = _path => path.resolve(__dirname, _path)
const WebpackCopyPlugin = require('copy-webpack-plugin')

const isDevMode  = process.env.NODE_ENV === 'development'
const outputPath = resolve((isDevMode ? './.tmp' : './dest') + '/client')

const config = {
  output: {
    path:          outputPath,
    filename:      '[name].js',
    chunkFilename: '[name].js'
  },
  entry: {
    vendor: [
      'jquery',
      'underscore',
      'backbone',
      'backbone.radio',
      'backbone.babysitter',
      'backbone.marionette',
      'ractive',
      'page'
    ],
    index: [
      resolve('src/client/index.js')
    ]
  },
  logLevel: 'warn',
  verbose:  true,
  module:   {
    // require
    unknownContextRegExp:   /$^/,
    unknownContextCritical: false,

    // require(expr)
    exprContextRegExp:   /$^/,
    exprContextCritical: false,

    // require('prefix' + expr + 'surfix')
    wrappedContextRegExp:   /$^/,
    wrappedContextCritical: false,
    loaders:                [
      {
        test:   /\.json$/,
        loader: 'json'
      },
      {
        test:    /\.js$/,
        exclude: /node_modules/,
        loader:  'babel',
        query:   {
          compact: false,
          plugins: [
            'transform-object-rest-spread',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-function-bind'
          ]
        }
      },
      {
        test:   /\.worker\.js$/,
        loader: 'share-worker'
      },
      {
        test:    /\.html$/,
        loader:  'ractive',
        include: [
          resolve('src/client/components'),
          resolve('src/client/modules')
        ]
      },
      {
        test:   /\.scss$/,
        loader: 'css!sass?outputStyle=compact'
      },
      {
        test:   /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?mimetype=application/font-woff'
      },
      {
        test:   /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'window.WEBPACK_ENV':     true,
      'window.WEBPACK_DEV_ENV': isDevMode
    }),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 100}),
    new HtmlWebpackPlugin({template: resolve('src/client/index.html')}),
    new webpack.optimize.CommonsChunkPlugin({
      name:      'vendor',
      minChunks: Infinity
    }),
    new WebpackCopyPlugin([{context: 'src/client',from:    '**/*.{jpg,png}',to:      outputPath}])
  // new WebpackBrowserPlugin({browser: 'Chrome', port: 3000}),
  ]
}

if (isDevMode) {
  config.plugins.push(new OfflinePlugin())
  config.devtool = '#inline-source-map'
}

module.exports = config
