const entry = require('./entry');

module.exports = {
  entry,
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].js'
  }
};