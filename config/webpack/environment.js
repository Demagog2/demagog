const { environment } = require('@rails/webpacker');
const typescript = require('./loaders/typescript');
const webpack = require('webpack');
const fs = require('fs');

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
