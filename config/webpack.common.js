const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require('webpack')
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const copyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const { merge } = require("webpack-merge");

const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");

const commonConfig = {
  // watch: true,    //模拟devserve
  // entry: './src/main.js',
  entry: {
    main: {
      import: './src/main.js',
      // filename: 'output-[name]-bundle.js'
    },
    // main: [
    //   './src/main.js'
    // ]
    // index: {
    //   import: './src/index.js',
    //   // filename: 'output-[name]-bundle.js'
    // },
  },
  output: {
    filename: '[name]-bundle.js', //入口文件打包生成后的文件的文件名
    // chunkFilename: "[name]-[hash:6]-bundle-chunk.js", //入口文件中，符合条件的代码，被抽离出来后生成的文件的文件名
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: "assets/[name]-[hash:6].[ext]", //静态资源生成目录（不管什么资源默认都统一生成到这里,除非单独设置了generator）
    // publicPath: "/abc" //output的publicPath建议与devServer的publicPath一致
  },
  resolve: {  //解析路径
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".vue"], //解析扩展名
    alias: {
      "@": path.resolve(__dirname, '../src'),  //设置路径别名
    },
  },
  optimization: {
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        extractComments: false, //去除打包生成的bundle.js.LICENSE.txt
      }),
    ],
    /**
     * splitChunks属性，如果设置了mode: 'production'，会有默认行为，具体看官网
     * 但即使没有设置mode: 'production'，也没有手动添加splitChunks属性，默认还是会添加splitChunks的部分行为，
     * 比如：splitChunks.chunks:'async'等等，即会将异步代码抽离！
     */
    splitChunks: {  //对入口文件进行代码分离
      chunks: 'all',  //async,initial,all
      minSize: 10 * 1024, //生成 chunk 的最小体积。默认：20000。
      // maxSize: 10 * 1024,
      // minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30, //按需加载时的最大并行请求数。默认：30
      maxInitialRequests: 30, //按需加载时的最大并行请求数。默认：30
      /**
       * enforceSizeThreshold：强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
       * 即拆分的包大小范围允许在这个阈值范围，即设置minSize:20 * 1024，enforceSizeThreshold: 10 * 1024，
       * 允许拆分的包在10kb-30kb之间！
       */
      enforceSizeThreshold: 1 * 1024,  //默认：50000byte
      filename: "[id]-splitChunks.js",
      // chunks: "all",  //同步和异步代码都进行代码分离
      // minChunks: 1, //模块被不同entry引用的次数大于等于才能分割。
      // // 如果minSize和maxSize冲突（即非法，如minSize:200,maxSize:100），优先级：maxSize < minSize
      // minSize: 3 * 1024,  //如果设置了mode: 'production'，miniSize默认就是30000！生成 chunk 的最小体积
      // // maxSize: 40000,  //尝试将大于maxSize的chunk分割成较小的部分chunks。如果设置了initial或者all，建议必须设置maxSize，否则同步代码不会抽离！
      // filename: "[id]-splitChunks.js",
      // 缓存组可以继承和/或覆盖来自 splitChunks.* 的任何选项
      // 即如果匹配到缓存缓存组里的某一个，如vendor，vendor里的设置会对splitChunks的设置进行继承或覆盖
      // 即vendor里没有设置chunks，vendor就会继承splitChunks的chunks，vendor设置了filename，会覆盖splitChunks的filename
      cacheGroups: {  //cacheGroups里的优先级默认比外面的高
        // defaultVendors:false,  //禁用默认webpack默认设置的defaultVendors缓存组
        // default:false, //禁用默认webpack默认设置的default缓存组
        defaultVendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          filename: '[name]-defaultVendors.js',
          priority: -10,  //优先级，优先使用优先级高的缓存组
          reuseExistingChunk: true,
        },
        default: {
          chunks: 'all',
          filename: '[name]-default.js',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        test: {
          chunks: 'all',
          // test: /[\\/]src[\\/]lib[\\/]/,
          filename: "[id]-test.js",
          /**
           * 自定义组的优先级默认值为 0,即如果不设置自定义组的优先级，默认就是0，
           * 即上面设置的defaultVendors，default，因为都设置了优先级是负数，
           * 所以上面设置的defaultVendors，default都不会生效！
           */
          priority: -30
        },
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              /**
               * 即默认打包的css文件是webpackOptions.output的publicPath，
               * 但在new MiniCssExtractPlugin()时候，设置了打包生成的文件在dist下面的css目录里，
               */
              publicPath: '../',
            },
          },
          // 顺序：从下往上，从右往左
          // { loader: 'style-loader' },  // Do not use style-loader and mini-css-extract-plugin together.
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      },
      // {
      //     test: /\.(jpg|jpeg|png|gif)$/,
      //     use: [
      //         {
      //             loader: 'url-loader',
      //             options: {
      //                 name: "[name]-[hash:6].[ext]",
      //                 outputPath: "img",
      //                 limit: 100 * 1024
      //             }
      //         },
      //     ]
      // },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        // type: 'asset/resource', // 约等于实现file-loader
        // generator:{
        //     filename:'img/[name]-[hash:6].[ext]'
        // }
        // type: 'asset/inline', // 全部都使用url-loader
        type: 'asset',
        generator: {
          filename: 'img/[name]-[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]-[hash:6][ext]'
        },
      },
      {
        test: /\.vue$/,
        use: [
          { loader: 'vue-loader' },
        ]
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   generateStatsFile: true,
    //   statsOptions: { source: false }
    // }),
    new HtmlWebpackPlugin({ // 自动生成index.html文件(并引入打包的js)
      title: 'hss-webpack5',
      template: './public/index.html',
      // chunks: ['main']
    }),
    // new HtmlWebpackPlugin({ // 自动生成index.html文件(并引入打包的js)
    //   title: 'hss-webpack51',
    //   template: './index1.html',
    //   chunks: ['index']
    // }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: 'public', //将public里面的文件
          // to: 'assets'    //复制到output.path下的assets，不写默认就是output.path根目录
          globOptions: {
            ignore: [
              "**/index.html",//忽略from目录下的index.html
            ]
          }
        }
      ]
    }),
    new DefinePlugin({  //定义全局变量
      BASE_URL: "'./'"    //public下的index.html里面的icon的路径
    }),
    new VueLoaderPlugin(), //解析vue
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'css/[name]-[hash:6].css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),  //打包css目录
  ]
};

module.exports = function (env) {
  const isProduction = env.production;
  process.env.NODE_ENV = isProduction ? "production" : "development";

  const config = isProduction ? prodConfig : devConfig;
  const mergeConfig = merge(commonConfig, config);  //根据当前环境，合并配置文件

  return mergeConfig;
};