const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const BundleSizeCalculatorPlugin = require('./lib/plugins/BundleSizeCalculatorPlugin');

module.exports = {

  // 配置mode为开发环境
  mode: 'development',

  // 入口文件，使用object来配置多个入口文件
  entry: {
    index: './src/js/index.js',
    main: './src/js/main.js',
  },

  // 输出配置
  output: {
    // 打包时，在包中包含所属模块的信息的注释，在入口文件下层目录生成.map文件
    pathinfo: true,
    // 输出文件的路径
    path: path.resolve(__dirname, 'custom-dist/'),
    // 输出的文件名，[name]代表输入文件名
    filename: 'assets/[name]-[chunkhash:6].js',
    // 静态bundle文件名称
    assetModuleFilename: 'assets/[name]-[hash:6][ext]',
  },

  // 配置webpack会在多个目录中查找可用loader
  resolveLoader: {
    modules: ['node_modules', './lib/myLoaders']
  },

  // module，入口文件只能是js和json，其他类型文件需要loader解析
  module: {
    rules: [
      // less打包工具
      {
        test: /\.(less)$/,
        // use会按照从前向后的顺序执行loader
        use: [
          'ou-style-loader',
          'ou-css-loader',
          'ou-less-loader',
        ],
      },

      // css打包工具
      {
        test: /\.(css)$/,
        use: [
          'ou-style-loader',
          'ou-css-loader',
        ],
      },

      // js打包工具
      {
        test: /\.js$/,
        use: [{
          loader: "babel-loader",
          options: {},
        }]
      },

      // webPack5资源模块
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },

      // html-withimg-loader，打包html中的img文件
      {
        test: /\.html$/,
        use: [{
          loader: "html-withimg-loader",
          options: {},
        }],
      }
    ]
  },

  // plugins，webpack打包插件，没有顺序，在webpack打包过程中的各个钩子中执行
  plugins: [
    // html打包插件
    new htmlWebpackPlugin({
      // 要打包的html文件路径
      template: "./src/index.html",
      // 输出的文件名
      filename: "index.html",
      // html要引入的chunk名称（入口），对应entry中的key
      chunks: ["index"]
    }),

    // 清理打包路径插件
    new CleanWebpackPlugin({
      // dry为true则开启测试模式，不真正执行删除，只打印会删除的文件
      // dry: true,
      cleanOnceBeforeBuildPatterns: [
        // 删除dist路径下所有文件
        '**/*',
        // 不删除dist下的package.json文件
        '!package.json'
      ],
    }),

    // miniCssExtractPlugin插件
    new miniCssExtractPlugin({
      filename: "assets/[name]-[chunkhash:6].css"
    }),

    // 分析打包大小插件
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),

    // 自定义插件
    new BundleSizeCalculatorPlugin(),
  ],

  //webpack-dev-server配置
  devServer: {
    // 端口号
    port: 8866,
    // 是否自动打开浏览器
    open: true,
    // 本地跨域代理
    proxy: {
      // 本地请求"/api"的地址时会代理到"localhost:3000"进行请求
      '/api': {
        // 代理地址
        target: 'http://localhost:3000',
        // 重写路径（将/api替换为空）
        pathRewrite: { '^/api': '' },
        // 使用https
        secure: false,
        // 覆盖主机源
        changeOrigin: true,
      },
    }
  }
};