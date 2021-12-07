const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

module.exports = class Webpack {
  constructor(options) {
    const {entry, output} = options;
    this.entry = entry;
    this.output = output;
  };
  run() {
    // 模块解析
    this.depsGraph = this.parseModules(this.entry);
    // 打包
    this.bundle();
  };

  // 模块解析
  parseModules(file) {
    const entry = this.getModuleInfo(file);
    const moduleArray = [entry];
    this.getDeps(moduleArray, entry);

    const depsGraph = {};
    moduleArray.forEach(moduleInfo => {
      depsGraph[moduleInfo.file] = {
        deps: moduleInfo.deps,
        code: moduleInfo.code,
      }
    })
    return depsGraph;
  };

  // 根据依赖递归解析文件
  getDeps(moduleArray, {deps}) {
    Object.keys(deps).forEach(key => {
      if (!moduleArray.some(m => m.file === deps[key])) {
        const child = this.getModuleInfo(deps[key]);
        moduleArray.push(child);
        this.getDeps(moduleArray, child);
      }
    })
  }

  // 解析一个文件
  getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, 'utf-8');

    // 将文件转换为AST语法树
    const ast = parser.parse(body, {
      sourceType: 'module',
    })

    // 依赖收集：deps保存依赖的文件的绝对路径
    const deps = {};
    traverse(ast, {
      ImportDeclaration({node}) {
        const dirName = path.dirname(file);
        console.log(file + ': ' + dirName);
        deps[node.source.value] = `./${path.join(dirName, node.source.value)}`;
      }
    })
    console.log('deps: ', deps);

    // 将es6转换为es5
    const {code} = babel.transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    })

    return{
      file,
      deps,
      code
    }
  };

  // 打包
  bundle() {
    const content = `
      (function(__webpack__modules__){
        function __webpack_require__(moduleId) {
          function require(relPath) {
            return __webpack_require__(__webpack__modules__[moduleId].deps[relPath])
          }
          var exports = {};
          (function (require, exports, code) {
            eval(code)
          })(require, exports, __webpack__modules__[moduleId].code)
          return exports
        }
        __webpack_require__('${this.entry}')
      })(${JSON.stringify(this.depsGraph)})
    `;
    !fs.existsSync(this.output.path) && fs.mkdirSync(this.output.path);
    const filePath = path.join(this.output.path, this.output.filename);
    fs.writeFileSync(filePath, content);
  }
}