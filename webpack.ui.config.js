import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'; // Ensure this plugin is installed
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // Use 'production' when you're ready to ship
  entry: './ui/index.js', // Entry file for the UI
  output: {
    filename: 'plugin-ui.bundle.js', // Bundled JS file (for Webpack)
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  devtool: 'source-map', // For better debugging
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Handle JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel to transpile JS
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'], // Inject CSS into JS
      },
      {
        test: /\.html$/, // Handle HTML files (e.g., ui.html)
        use: 'html-loader', // This will process HTML files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './ui/index.html', // Your base HTML template
      filename: 'ui.html', // The output HTML file for the UI
      inject: true, // Inject bundled JS and CSS into ui.html
    }),
  ],
};
