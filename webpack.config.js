const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js',
      clean: true
    },
    // Externals: Exclude CDN libraries from webpack bundle
    // These libraries are loaded via <script> tags in index.html
    externals: {
      'docx': 'docx',
      'file-saver': 'saveAs',
      'html2pdf.js': 'html2pdf'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
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
            'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      }),
      ...(isProduction ? [
        new (class InlineEverythingPlugin {
          apply(compiler) {
            compiler.hooks.compilation.tap('InlineEverythingPlugin', (compilation) => {
              HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                'InlineEverythingPlugin',
                (data, callback) => {
                  const assets = compilation.assets;
                  let html = data.html;

                  // Inline JavaScript
                  Object.keys(assets).forEach(filename => {
                    if (filename.endsWith('.js')) {
                      const source = assets[filename].source();
                      const scriptRegex = new RegExp(`<script[^>]*src="[^"]*${filename}[^"]*"[^>]*></script>`, 'g');
                      html = html.replace(scriptRegex, `<script>${source}</script>`);
                      delete compilation.assets[filename];
                    }
                  });

                  // Inline CSS
                  Object.keys(assets).forEach(filename => {
                    if (filename.endsWith('.css')) {
                      const source = assets[filename].source();
                      const linkRegex = new RegExp(`<link[^>]*href="[^"]*${filename}[^"]*"[^>]*>`, 'g');
                      html = html.replace(linkRegex, `<style>${source}</style>`);
                      delete compilation.assets[filename];
                    }
                  });

                  data.html = html;
                  callback(null, data);
                }
              );
            });
          }
        })()
      ] : [])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json']
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true
    },
    optimization: {
      splitChunks: isProduction ? false : {
        chunks: 'async'
      }
    }
  };
};