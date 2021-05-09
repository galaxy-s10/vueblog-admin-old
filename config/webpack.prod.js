const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isProduction = true;

// console.log("加载生产时的配置文件");

module.exports = {
  // mode: "production",
  plugins: [
    new CleanWebpackPlugin({}), // 自动删除生成的dist文件夹
  ]
}