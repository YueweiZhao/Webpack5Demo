const path = require("path");

module.exports = {
  mode: 'development',
  entry: './custom/src/index.js',
  output: {
    path: path.resolve(__dirname, "../custom/dist"),
    filename: 'index.js'
  }
}