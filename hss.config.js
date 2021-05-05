var path = require('path')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')
var copyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var { DefinePlugin } = require('webpack')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    // watch: true,    //模拟devserve
    mode: 'development',
    devtool: 'source-map',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        // assetModuleFilename:"img/[name]-[hash:6].[ext]"
    },
    devServer: {
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 顺序：从下往上，从右往左
                    { loader: 'style-loader' },
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
                    filename: 'img/[name]-[hash:6].[ext]'
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
        new CleanWebpackPlugin(),    // 自动删除生成的dist文件夹
        new HtmlWebpackPlugin({
            title: 'hss-webpack5',
            template: './public/index.html'
        }),    // 自动生成index.html,引入打包的js
        new DefinePlugin({  //定义全局变量
            BASE_URL: "'./'"    //public下的index.html里面的icon的路径
        }),
        new copyWebpackPlugin({
            patterns: [
                {
                    from: 'public', //将public里面的文件
                    // to: 'assets'    //复制到output.path下的assets，不写默认就是output.path根目录
                    globOptions: {
                        ignore: [
                            "**/index.html",
                        ]
                    }
                }
            ]
        }),
        new VueLoaderPlugin()   //解析vue
    ]
}