const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  plugins: [
    new CleanWebpackPlugin(['dist/*']),
    new HtmlWebpackPlugin({
      title: 'Cero Vueltas',
      template: path.resolve(__dirname, 'client', 'index.html')
    })
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-2']
          }
        }
      },
      {
        test: /node_modules\/.*\.(jpe?g|gif|png|svg)$/,
        loader: 'file-loader?emitFile=false&name=[path][name].[ext]'
      },
      {
        test: /node_modules\/leaflet-draw\/dist\/images\/spritesheet\.svg$/,
        loader: 'file-loader?emitFile=true&name=[path][name].[ext]'
      },
      {
        test: /client\/.*\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '/',
              limit: 1
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader", options: {
            sourceMap: true
          }
        }, {
          loader: "sass-loader", options: {
            sourceMap: true
          }
        }]
      }],
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      { test: /\.scss$/, include: [path.resolve(__dirname, 'client', 'style.scss')], loader: 'sass' },
      { test: /\.css$/, loader: 'style!css' },
    ],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  resolveLoader: {
    alias: {
      'api-description': require.resolve('./loaders/api-description')
    }
  }
};
