const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {

  // 配置mode为开发环境
  mode: 'development',

  // 展示source-map
  // devtool: 'source-map',

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
    path: path.resolve(__dirname, 'dist/'),
    // 输出的文件名，[name]代表输入文件名
    filename: 'assets/[name]-[chunkhash:6].js',
    // 静态bundle文件名称
    assetModuleFilename: 'assets/[name]-[hash:6][ext]',
  },

  // module，入口文件只能是js和json，其他类型文件需要loader解析
  module: {
    rules: [
      // css打包工具
      {
        test: /\.(sass|scss|less|css)$/,
        // use会按照从前向后的顺序执行loader
        use: [
          // 使用css-loader，css会被放进js中
          // 'style-loader',

          // 使用miniCssExtractPlugin的loader，css是独立文件并被html引入,多个css文件会被合并
          miniCssExtractPlugin.loader,

          // 打包css文件
          {
            loader: "css-loader",
            options: {},
          },

          // 使用postcss-loader，实现添加浏览器前缀，压缩代码等功能(postcss配置文件)
          'postcss-loader',

          // 打包scss文件
          'sass-loader',
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

      // url-loader和file-loader来打包文件
      // {
      //   test: /\.(png|jpe?g|gif|webp)$/,
      //
      //   // 使用url-loader打包
      //   use: [{
      //     loader: 'url-loader',
      //     options: {
      //       // 设置导出名称
      //       name: '[name].[ext]',
      //       // 设置转为base64的阈值，超过则打包成文件
      //       limit: 1024 * 10,
      //     }
      //   }],
      //
      //   // 使用file-loader打包，默认打包为文件
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       // 设置导出名称
      //       name: '[name].[ext]',
      //       // 设置转为base64的阈值，超过则打包成文件
      //       limit: 1024 * 10,
      //       esModule: false,
      //     }
      //   }]
      // },

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
      chunks: ["index", "main"]
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
    // 生成的css文件中[name]为chunk的模块名，一整个模块引入的css会被打包为一个css文件
    new miniCssExtractPlugin({
      filename: "assets/[name]-[chunkhash:6].css"
    }),

    // 分析打包大小插件
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),
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