import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './ui/index.js',
  output: {
    filename: 'ui.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '', // ✅ ensures relative path like "ui.css" works
  },
  devtool: 'source-map',
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
          options: { presets: ['@babel/preset-env'] },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './ui/index.html',
      filename: 'ui.html',
      inject: 'body',
    }),
    new HtmlInlineScriptPlugin({ scriptMatchPattern: [/ui\.js$/] }),
    new MiniCssExtractPlugin({
      filename: 'ui.css',        // ✅ exact name Figma will look for
      linkType: 'text/css',      // ✅ ensures correct MIME
    }),
  ],
};
