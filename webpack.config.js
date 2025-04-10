const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

// Custom plugin to inject UI HTML into plugin.js
class FigmaUIInjectPlugin {
  constructor(options) {
    this.pluginPath = options.pluginPath || 'dist/plugin.js';
    this.uiPath = options.uiPath || 'dist/ui.html';
    this.cssPath = options.cssPath || 'dist/ui.css';
    this.placeholder = options.placeholder || '"<webview>"';
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('FigmaUIInjectPlugin', (compilation) => {
      const pluginDistFile = path.resolve(compiler.context, this.pluginPath);
      const uiDistFile = path.resolve(compiler.context, this.uiPath);
      const cssDistFile = path.resolve(compiler.context, this.cssPath);
      
      if (fs.existsSync(pluginDistFile) && fs.existsSync(uiDistFile)) {
        let pluginContent = fs.readFileSync(pluginDistFile, 'utf8');
        let uiContent = fs.readFileSync(uiDistFile, 'utf8');
        
        // Check if we need to manually include CSS in the HTML
        // This ensures CSS is included even if HtmlWebpackPlugin didn't include it
        if (fs.existsSync(cssDistFile) && !uiContent.includes(this.cssPath)) {
          const cssContent = fs.readFileSync(cssDistFile, 'utf8');
          
          // Add the CSS directly into the HTML
          uiContent = uiContent.replace(
            '</head>', 
            `<style>${cssContent}</style></head>`
          );
          
          // Write the updated UI file
          fs.writeFileSync(uiDistFile, uiContent);
          console.log('Successfully injected CSS into UI HTML');
        }
        
        // Properly escape the HTML content
        // First clean any potential BOM or invalid unicode characters
        const cleanUiContent = uiContent
          .replace(/^\uFEFF/, '') // Remove BOM if present
          .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFF]/g, ''); // Remove invalid Unicode
        
        // Escape using JSON.stringify for proper escaping of quotes and newlines
        const escapedHtml = JSON.stringify(cleanUiContent);
        
        // Replace the placeholder with the properly escaped HTML string
        pluginContent = pluginContent.replace(this.placeholder, escapedHtml);
        
        // Write the updated plugin file
        fs.writeFileSync(pluginDistFile, pluginContent);
        console.log('Successfully injected UI HTML into plugin.js');
      }
    });
  }
}

module.exports = {
  mode: 'development',  // More readable output for development
  devtool: 'inline-source-map',  // Better debugging
  entry: {
    ui: './src/ui/index.js',
    plugin: './src/plugin/plugin.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // Extract CSS to separate files
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // Use HtmlWebpackPlugin to generate UI from our new template
    new HtmlWebpackPlugin({
      template: './src/ui/index.html',
      filename: 'ui.html',
      chunks: ['ui'],
      inject: true
    }),
    // Optional: Use HtmlInlineScriptPlugin to inline the script
    new HtmlInlineScriptPlugin(),
    // Inject the UI into plugin.js
    new FigmaUIInjectPlugin({
      pluginPath: 'dist/plugin.js',
      uiPath: 'dist/ui.html'
    })
  ]
};