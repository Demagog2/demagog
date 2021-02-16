const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

module.exports = {
  entry: './app/javascript/admin/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    // `index_bundle.js` name is required by html-webpack-plugin
    filename: 'index_bundle.js',
  },
  resolve: {
    // Add image files (`.png`, `.jpeg`), font files (`.woff`, `.eot`, `.ttf`), `.css`, `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.eof', '.ttf', '.woff', '.png', '.jpeg', '.svg', '.ts', '.tsx', '.js', '.css'],
  },
  module: {
    rules: [
      // ckeditor integration
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader'],
      },

      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
              },
              minify: true,
            }),
          },
        ],
      },

      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },

      // all files with a `.css` extension will be handled by `css-loader`
      { test: /\.css$/, loader: 'css-loader', exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/ },

      // all image files extension will be handled by `file-loader`
      { test: /\.(svg|png|jpe?g)$/, loader: 'file-loader' },

      // all font files extension will be handled by `file-loader`
      { test: /\.(woff|eot|ttf)$/, loader: 'file-loader' },
    ],
  },
  plugins: [
    // Creates virtual `index.html` that loads `index_bundle.js`
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),


      title: 'Demagog.cz - Administrace',
      appMountId: 'app-root'
    }),

    // Ckeditor integration
    new CKEditorWebpackPlugin({ language: 'cs' }),
  ],
  devServer: {
    proxy: {
      '/graphql': {
        target: 'https://demagog.cz/',
        secure: false,
      }
    }
  }
};
