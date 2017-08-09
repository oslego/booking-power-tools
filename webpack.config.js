const path = require("path");
const webpack = require('webpack');
const ChromeDevPlugin = require("chrome-dev-webpack-plugin");
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
  console.log(env);

  const isDev = (env.env === "dev") ? true : false;

  const javascript = {
    test: /\.(js)$/,
    use: [{
      loader: 'babel-loader',
      options: { presets: ['es2015'] }
    }]
  };

  const chromeExtensionPlugin = new ChromeDevPlugin({
    //The source manifest file you want to use for your extension
    entry: './src/manifest.json',
    package: './package.json',
    buildId: false,
  })

  const globalVariablesPlugin = new webpack.DefinePlugin({
    DEV_MODE: isDev,
  })

  const uglifyJSPlugin = new UglifyJSWebpackPlugin({
    sourceMap: false
  });

  const plugins = isDev
    ? [ globalVariablesPlugin, chromeExtensionPlugin ]
    : [ globalVariablesPlugin, chromeExtensionPlugin, uglifyJSPlugin ];

  const config = {
    context: path.resolve(__dirname, './src'),
    entry: {
      contentscript: './contentscript.js',
      background: './background.js',
    },
    output: {
      path: path.resolve(__dirname, 'chrome-extension'),
      filename: '[name].js'
    },
    module: {
      rules: [ javascript ]
    },
    plugins: plugins
  };

  return config;
}
