import commonConfig from './webpack.common.js'
import merge from 'webpack-merge'


const devConfig = {
    devtool:'cheap-module-eval-source-map',
    mode: 'development', // 打包的模式 开发环境和生产环境production
    // webpack-dev-server 开发服务的配置
    devServer: {
        port: 3000, // 打开后的端口号
        progress: true, // 打包过程中的进度条
        contentBase: './dist', // 打包后运行的文件夹
        // open: true
    },
    // Tree Shaking 的配置项
    optimization: {
        useExports: true, // 被使用时才导入。
    },
}

module.exports = merge(commonConfig, devConfig)