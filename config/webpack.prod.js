const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const isProduction = true;

// console.log("加载生产时的配置文件");

module.exports = {
  // mode: "production",
  // devtool: 'source-map',
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({  
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            arguments: false, //将函数的参数转为对应形参名
            dead_code: true
          },
          mangle: true,
          toplevel: true,
          keep_classnames: true,//保存原本函数名
          keep_fnames: true //保存原本函数名
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin({}), // 自动删除生成的dist文件夹
    new CssMinimizerPlugin(), // css压缩
  ]
}