const { environment } = require('@rails/webpacker');
const typescript = require('./loaders/typescript');
const webpack = require('webpack');

// Babel loader is not necessary
environment.loaders.delete('babel');
environment.loaders.append('typescript', typescript);
environment.plugins.append(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),
);
module.exports = environment;
