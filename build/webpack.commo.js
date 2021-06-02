const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

const commonConfig = {
    entry: {
        main: './src/a.js',
        sub: './src/index.js'
    },
    output: {
        // publicPath:'https://cdn.com/dist',
        filename: '[name].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist') // 打包后文件夹存放的位置。
    },
    plugins: [
        // 热更新模块
        new webpack.HotModuleReplacementPlugin(),
        // 包后的js文件，通过script导入 html 文件内
        new HtmlWebpackPlugin({
            template: './src/index.html', // template: 打包后放入的模板
            filename: 'index.html', // 这是模板打包后的文件名
            minify: {
                removeAttributeQuotes: true, // 将 html 文件中的双引号去除
                collapseWhitespace: true, // 将html文件的代码转换成一行。
            },
            hash: true, // 哈希戳，可以保证缓存的不同
        }),
        //  抽离出来的 css
        new MiniCssExtractPlugin({
            filename: 'main.css', // 抽离出来的 css 文件名是 main.js
        }),

        new CleanWebpackPlugin()
    ],
    module: {
        // 配置模块导入的规则
        rules: [{
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    //   options: {
                    //     presets: ['@babel/preset-env'],  // presets 可以标识需要转换的源码使用了哪些新特性，
                    //     "plugins": [
                    //         ["@babel/plugin-transform-runtime", {
                    //         "absoluteRuntime": false,
                    //         "corejs": false,
                    //         "helpers": true,
                    //         "regenerator": true,
                    //         "version": "7.0.0-beta.0"
                    //       }]
                    //       ]
                    //   }
                }
            }, { // 导入模块的规则
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: 'images/',
                        limit: 2048
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // 将 css 文件抽离到`main.css` 中, 
                    'css-loader',
                ]
            },

        ]
    }
}

module.exports = commonConfig