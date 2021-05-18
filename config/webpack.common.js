const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require('webpack')
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const copyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
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
    md: {
      import: './src/md.js',
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
    filename: 'js/[name]-bundle.js', //入口文件打包生成后的文件的文件名
    /**
     * 入口文件中，符合条件的代码，被抽离出来后生成的文件的文件名
     * 如：动态(即异步)导入，默认不管大小，是一定会被单独抽离出来的。
     * 如果一个模块既被同步引了，又被异步引入了，不管顺序（即不管是先同步引入再异步引入，还是先异步引入在同步引入），
     * 这个模块会打包进bundle.js，而不会单独抽离出来。
     */
    chunkFilename: "js/[name]-[hash:6]-bundle-chunk.js",
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: "assets/[name]-[hash:6].[ext]", //静态资源生成目录（不管什么资源默认都统一生成到这里,除非单独设置了generator）
    // publicPath: "/abc" //output的publicPath建议与devServer的publicPath一致，还可设置cdn地址。
  },
  resolve: {  //解析路径
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".vue"], //解析扩展名
    alias: {
      "@": path.resolve(__dirname, '../src'),  //设置路径别名
    },
  },
  optimization: {
    // minimize: false,
    // minimizer: [
    //   new TerserPlugin({
    //     extractComments: false, //去除打包生成的bundle.js.LICENSE.txt
    //   }),
    // ],
    /**
     * splitChunks属性，如果设置了mode: 'production'，会有默认行为，具体看官网
     * 但即使没有设置mode: 'production'，也没有手动添加splitChunks属性，默认还是会添加splitChunks的部分行为，
     * 比如：splitChunks.chunks:'async'等等，即会将异步代码抽离！
     */
    splitChunks: {  //对入口文件进行代码分离
      // chunks: 'all',  //async,initial,all
      // minSize: 20 * 1024, //生成 chunk 的最小体积。默认：20000（19.5kb）
      /**
       * maxSize:尝试将大于maxSize的chunk分割成较小的部分chunks。
       * 官网写的默认值是0，但是，实际测试：如果在chunks:async的时候，确实这个属性会生效，会将异步代码配合minSize进行抽离；
       * 但是如果在chunks:initial或all的时候，如果不手动添加maxSize属性，就不会将同步代码配合minSize进行抽离！
       * 因此，如果希望maxSize可以对同步和异步代码都进行分离，就手动设置maxSize:0，或者手动设置maxSize为自己需要设置的值，
       * 但一定不能不写这个maxSize!最起码也得写一个maxSize:0，虽然这样写会报警告，或者直接写maxSize的值和minSize值一样！
       */
      // maxSize: 0,   //不写maxSize默认就是0，这里手动设置0
      // maxSize: 30 * 1024,
      // minRemainingSize: 0, //???
      // minChunks: 1, //模块被不同entry引用的次数大于等于才能分割。
      // maxAsyncRequests: 30, //按需加载时的最大并行请求数。默认：30
      // maxInitialRequests: 30, //按需加载时的最大并行请求数。默认：30
      /**
       * enforceSizeThreshold：强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
       * 即拆分的包大小范围允许在这个阈值范围，即设置minSize:20 * 1024，enforceSizeThreshold: 10 * 1024，
       * 允许拆分的包在10kb-30kb之间！
       */
      // enforceSizeThreshold: 1 * 1024,  //默认：50000byte
      /**
       * 不建议全局设置filename，因为如果缓存组没有手动设置filename，默认缓存组会继承全局
       * 的filename，这样在某些情况会显得很奇葩，比如：全局设置了chunks:'async'，filename:'[id]-asyncChunks.js',
       * 而缓存组设置了一个chunks:'initial',且没有设置它的filename，那么最终打包会先匹配缓存组，然后匹配
       * 到同步代码就抽离，然后设置filename，由于这个缓存组没有设置它的filename，因此会继承全局的filename，
       * 因此就会把同步代码抽离后叫[id]-asyncChunks.js，虽然还是一样把代码抽离出来了，但是
       * 抽离出来的文件和文件名"货不对板"，做不到见名知意，这样就很别扭了。因此如果设置设置了全局的filename，那
       * 么最好就是每一个缓存组都设置自己的filename，这样就可以和全局的进行区分了
       */
      // filename: "[id]-splitChunks.js", //默认[name]-bundle.js
      /**
       * 缓存组可以继承和/或覆盖来自 splitChunks.* 的任何选项
       * 即如果匹配到缓存缓存组里的某一个，如vendor，vendor里的设置会对splitChunks的设置进行继承或覆盖
       * 即vendor里没有设置chunks，vendor就会继承splitChunks的chunks，vendor设置了filename，会覆盖splitChunks的filename
       */
      cacheGroups: {  //cacheGroups里的优先级默认比外面的高
        // defaultVendors:false,  //禁用默认webpack默认设置的defaultVendors缓存组
        // defa ult:false, //禁用默认webpack默认设置的default缓存组
        defaultVendors: { //重写默认的defaultVendors
          chunks: 'initial',
          // minSize: 50 * 1024,
          // maxSize: 50 * 1024,
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/[name]-defaultVendors.js',
          priority: -10,
        },
        default: {  //重写默认的default
          chunks: 'all',
          filename: 'js/[name]-default.js',
          minChunks: 2, //至少被minChunks个入口文件引入了minChunks次。
          priority: -20,
        },
        // 这里动态代码会匹配到这里，会使用[id]-test.js作为文件名
        // 注释了test缓存组后，动态代码就会使用output.chunkFilename或output.filename
        // test: {
        //   chunks: 'all',
        //   filename: "[id]-test.js",
        //   priority: -30
        // },
      }
    }
  },
  resolveLoader: {  // 用于解析webpack的loader
    modules: ["node_modules", "webpack_loaders"]
  },
  module: {
    rules: [
      {
        test: /\.md?$/,
        exclude: /node_modules/,
        use: {
          loader: "hss-parse-md",
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
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
          { loader: 'css-loader' },
        ],
        sideEffects: true //告诉webpack是有副作用的，不对css进行删除
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
        // test: /\.(svg|eot|ttf|woff2?)\??.*$/,
        test: /\.(svg|eot|ttf|woff2?)$/,
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
    // new BundleAnalyzerPlugin({ //打包优化
    //   analyzerMode: 'server',
    //   generateStatsFile: true,
    //   statsOptions: { source: false }
    // }),
    new HtmlWebpackPlugin({ // 自动生成index.html文件(并引入打包的js)
      filename: 'index.html',
      title: 'hss-webpack5',
      template: './public/index.html',
      hash: true,
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({ // 自动生成index.html文件(并引入打包的js)
      filename: 'md.html',
      title: 'hss-md',
      hash: true,
      // template: './public/md.html',
      template: path.resolve(__dirname, '../public/md.html'),
      chunks: ['md']
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: 'public', //将public里面的文件
          // to: 'assets'    //复制到output.path下的assets，不写默认就是output.path根目录
          globOptions: {
            ignore: [
              // 复制到output.path时，如果output.paht已经存在重复的文件了，会报错：
              // ERROR in Conflict: Multiple assets emit different content to the same filename md.html
              "**/index.html",//忽略from目录下的index.html，它是入口文件
              "**/md.html",//忽略from目录下的md.html，它是入口文件
            ]
          }
        }
      ]
    }),
    new DefinePlugin({  //定义全局变量
      BASE_URL: "'./'"    //public下的index.html里面的icon的路径
    }),
    new VueLoaderPlugin(), //解析vue
    new MiniCssExtractPlugin({  //将 CSS 提取到单独的文件中
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
  // console.log(mergeConfig)

  return mergeConfig;
};
