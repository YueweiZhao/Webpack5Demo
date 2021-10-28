const webpack = require('./webpack');
const options = require('./webpack.config');

new webpack(options).run();