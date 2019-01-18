const entry = require('./entry');

module.exports = {
  entry,
  mode: 'development',
  devtool: 'inline-cheap-source-maps',
  output: {
    filename: '[name].js'
  }
};