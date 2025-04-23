// webpack.config.js

const path = require('path');

module.exports = {
  mode: 'development', // Use 'production' when you're ready to ship
  entry: './src/plugin.js',
  output: {
    filename: 'plugin.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false, // Prevents Webpack from using eval(), fixes __webpack_require__ error
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Optional if you're using Babel
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
