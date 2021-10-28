module.exports = class BundleSizeCalculatorPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("BundleSizeCalculatorPlugin", (compilation) => {
      let str = '';
      for (let filename in compilation.assets) {
        str += `${filename} -> ${compilation.assets[filename]['size']()/1000}KB\n`;
      }
      compilation.assets['fileSize.txt'] = {
        source: function () {
          return str;
        }
      }
    })
  }
}