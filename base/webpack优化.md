# webpack 提高打包速度篇
## webpack
* 1. 可以升级 webpack 的版本，新的 `node, npm, yarn`版本
* 2. 在尽可能少的模块上应用 `loader`，因为不是所有的文件都需要相应的`loader`处理，可以使用`rules数组` 中的`exclude/include`做文件的筛选。 
``` js
module: {
    rules: [{
            test: /\.m?js$/, // ? 表示 m 可有可无，也就是说文件可以是 mjs 和 js
            exclude: /node_modules/,
            //include: path.resolve(_dirname,'../src')
            use: {
                loader: "babel-loader",
            }
        }
    ]
}
```
* 3. 尽可能少的使用插件 `plugins`，开发环境下不需要代码压缩，就不需要使用压缩插件。
* 4. 合理的使用 `resolve` 配置项。
``` js 
module.exports = {
    entry:'./src',
    resolve:{
        extensions:['.js', '.json'],
    }
}
```
* 5. 使用插件 `webpack.DllPlugin`  进行分包。让一些基本不会改动的代码先打包成静态资源和第三方模块只打包一次生成 `dll`文件，重新使用第三方模块只需要打包后的 `dll` 文件。在`webpack.DllPlugin`中需要配置 `name` 来指定要分析的 `library`赋予的名字。同时还要插件 `webpack.DllReferencePlugin` 结合全局 `library` 赋予的变量和生成的`.manifest.json` 文件配置打包后的第三方模块
``` js
const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry:{
        vendors: ['react', 'lodash']
    },
    output:{
        filename:'[name].dll.js',
        path:path.resolve(_dirname, '../dll'),
        library: '[name]'   // library 暴露打包的模块名字，这里是 vendors
    },
    plugins:[
        new webpack.DllPlugin({
            name: '[name]', // 这里的 name 就是 library 中的 name，将分析的结果放在下面的path文件中
            path:path.resolve(_dirname, '../dll[name].manifest.json'),
        }),
        // 这个插件会找已经打包好的第三方模块文件。
        new webpack.DllPlugin({
            manifest: path.resolve(_dirname, '../dll[name].manifest.json'),
        })
    ]
}
```
* 6. 多进程/多实例构建， `thread-loader`,`HappyPack(不维护了)`,`parallel-webpack(多页面一起打包)`。
* 7. Tree Shaking 去除导入模块中没有使用到的函数，减少代码来提升速度。
* 8. code splitting，讲一个文件中的代码分割成一块一块(chunk)的，需要的使用时再加载。
* 9. 合理使用`source map`，使用的`source map` 映射到源代码越详细需要的时间就越长，不同环境就是用不同的`source map` 配置。
* 10. 开发时使用`webpack-dev-server`，打包的文件会存放到内存中不会生成`dist`目录，不是硬盘里面。内存的读取速度要比硬盘的读取速度要快。







