const webpack = require('webpack');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

const config = {
  plugins: [
    new UglifyJSWebpackPlugin({sourceMap: false}),
    new webpack.DefinePlugin({
      DEV_MODE: false
    })
  ]
};

module.exports = config;
