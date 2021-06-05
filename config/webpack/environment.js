const { environment } = require('@rails/webpacker');
const ckeditor5DevUtils = require('@ckeditor/ckeditor5-dev-utils');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

environment.config.output.filename = (chunkData) => {
  // We need to have widget.js without hash, because it is linked externally
  return chunkData.chunk.name === 'widget' ? '[name].js' : '[name]-[hash].js';
};

environment.loaders.append('ckeditor5-raw', {
  test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
  use: [
    {
      loader: 'raw-loader',
    },
  ],
});

environment.loaders.append('ckeditor5-styles', {
  test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        injectType: 'singletonStyleTag',
      },
    },
    {
      loader: 'postcss-loader',
      options: ckeditor5DevUtils.styles.getPostCssConfig({
        themeImporter: {
          themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
        },
        minify: true,
      }),
    },
  ],
});

['css', 'sass', 'moduleCss', 'moduleSass'].forEach((key) => {
  const config = environment.loaders.get(key);
  config.exclude = [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/];
});

const fileConfig = environment.loaders.get('file');
fileConfig.exclude = [
  /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
  /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
];

environment.loaders.delete('babel');
environment.loaders.append('babel', {
  test: /\.js$/,
  include: path.resolve(__dirname, '../../app/javascript'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              corejs: 3,
              // Means that we replace core-js & regenerator-runtime imports with
              // specific polyfills based on our browserslist config in .browserslistrc
              useBuiltIns: 'entry',
            },
          ],
        ],
        plugins: [
          // Class properties are needed by Stimulus
          '@babel/plugin-proposal-class-properties',
        ],
      },
    },
  ],
});

environment.loaders.append('typescript', {
  test: /\.(ts|tsx)$/,
  use: [
    {
      loader: 'ts-loader',
    },
  ],
});

const changelogContents = fs.readFileSync(__dirname + '/../../CHANGELOG-cs.md', 'utf8');
const matches = changelogContents.match(/\n## (\d{1,2}\. [^ ]+ \d{4})/u);
const lastUpdateDate = matches && matches.length >= 2 ? matches[1] : '';

environment.plugins.append(
  'Define',
  new webpack.DefinePlugin({
    CHANGELOG_LAST_UPDATE_DATE: JSON.stringify(lastUpdateDate),
  }),
);

module.exports = environment;
