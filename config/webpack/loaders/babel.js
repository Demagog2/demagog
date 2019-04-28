const path = require('path');

module.exports = {
  test: /\.js$/,
  include: path.resolve(__dirname, '../../../app/javascript'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              // Means that we replace @babel/polyfill with specific polyfills
              // based on our browserslist config in .browserslistrc
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
};
