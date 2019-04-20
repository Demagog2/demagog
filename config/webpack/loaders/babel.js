const path = require('path');

module.exports = {
  test: /\.js$/,
  include: path.resolve(__dirname, '../../../app/javascript'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [['@babel/preset-env', { targets: { ie: '11' } }]],
      },
    },
  ],
};
