// webpack.config.js (for backend)

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // or 'production'
  target: 'webworker',  // <<< Important
  entry: './src/plugin.js',
  output: {
    filename: 'plugin.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false,
  resolve: {
    extensions: ['.js'],
    fallback: {
      fs: false,
      path: false,
      os: false,
      http: false,
      https: false,
      child_process: false,
    },
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
