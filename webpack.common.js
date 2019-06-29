const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/app.js',
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   title: 'Production'
    // })
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   },
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true
    //   }
    // }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js' // this is the compiled final javascript file which we will include in the index.html
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        
      ]
    },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }]
  }
};
