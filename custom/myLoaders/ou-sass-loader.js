const sass = require('sass');

module.exports = function (source) {
  const callback = this.async();
  sass.render({data: source}, (err, result) => {
    if (err) return callback(err);
    callback(null, result.css);
  })
}