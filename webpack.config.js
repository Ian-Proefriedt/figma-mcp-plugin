// webpack.config.js (ESM version)

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
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
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};