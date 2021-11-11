const less = require('less');

module.exports = function (source) {
  const callback = this.async();
  less.render(source, (err, result) => {
    if (err) return callback(err);
    callback(null, result.css);
  })
}