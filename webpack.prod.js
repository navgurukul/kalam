const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
//   devtool: 'source-map'
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new CompressionPlugin(),
    new webpack.DefinePlugin({ "process.env.API_URL": JSON.stringify("http://join.navgurukul.org/api/")})
    // new CompressionPlugin({
    //     asset: '[path].gz[query]',
    //     algorithm: 'gzip',
    //     test: /\.js$|\.css$|\.html$/,
    //     threshold: 10240,
    //     minRatio: 0.8
    // }),
    // new BrotliPlugin({
    //     asset: '[path].br[query]',
    //     test: /\.(js|css|html|svg)$/,
    //     threshold: 10240,
    //     minRatio: 0.8
    // })
  ]
});