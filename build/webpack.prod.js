import commonConfig from './webpack.common.js'
import merge from 'webpack-merge'
const webpack = require('webpack')


const prodConfig = {
    devtool:'cheap-module-source-map',
    mode: 'production', // 打包的模式 开发环境和生产环境production
}

module.exports = merge(commonConfig, prodConfig)