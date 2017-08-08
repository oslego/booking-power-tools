const webpack = require('webpack');

const config = {
  plugins: [
    new webpack.DefinePlugin({
      DEV_MODE: true
    })
  ]
};

module.exports = config;
