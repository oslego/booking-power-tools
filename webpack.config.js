const path = require('path');
const webpack = require('webpack');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] }
  }]
};

const config = {
  entry: {
    contentscript: './src/contentscript.js' // webpack starts dependecy tree from here
  },
  output: {
    path: path.resolve(__dirname, 'chrome-extension'),
    filename: '[name].js'
  },
  module: {
    rules: [ javascript ]
  },
  plugins: [
    // new UglifyJSWebpackPlugin({sourceMap: true}),
  ]
};

module.exports = config;
