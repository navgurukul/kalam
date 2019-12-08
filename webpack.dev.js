const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true // this prevents the default browser full page refresh on form submission and link change
  },
  plugins:[
    new webpack.DefinePlugin({ "process.env.API_URL": JSON.stringify("http://localhost:3000/") })
  ]
});
