const path = require('path');
const webpack = require('webpack');

const javascript = {
  test: /\.(js)$/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] }
  }]
};

const config = {
  entry: {
    contentscript: './src/contentscript.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'chrome-extension'),
    filename: '[name].js'
  },
  module: {
    rules: [ javascript ]
  }
};

module.exports = config;
