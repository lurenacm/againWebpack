const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development', // 打包的模式 开发环境和生产环境production
    entry: './src/index.js', // 打包的出口文件
    output: {
        filename: 'bundle[hash:8].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist') // 打包后文件夹存放的位置。
    },
    // webpack-dev-server 开发服务的配置
    devServer: {
        port: 3000, // 打开后的端口号
        progress: true, // 打包过程中的进度条
        contentBase: './dist' // 打包后运行的文件夹
    },
    // plugin: 存放webpack的第三方插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // template: 打包后放入的模板
            filename: 'index.html', // 这是模板打包后的文件名
            minify: {
                removeAttributeQuotes: true, // 将 html 文件中的双引号去除
                collapseWhitespace: true, // 将html文件的代码转换成一行。
            },
            hash: true, // 哈希戳，可以保证缓存的不同
        })
    ],
    module: {
        // 配置模块导入的规则
        rules: [ // 导入模块的规则
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}