# loader
## loader 介绍
### loader 是什么
> loader 其实是一个函数，对匹配到的内容进行转换，将转换后的结果返回。

### loader 作用
> 在 `webpack` 中 `loader` 就像是一位翻译官。`webpack` 只认识 `JavaScript` 这们语言，对于其他的资源通过 `loader` 后可以转化做预处理
* loader 的执行是有顺序的，`支持链式的调用`。loader的执行顺序是从下到上，从右到左。比如处理样式类的文件，`use:['style-loader', 'css-loader']`。`css-loader`处理后的文件返回给`style-loader`。
* 一个 Loader 的职责是单一的，只需要完成一种转换。
* Webpack 会默认缓存所有 Loader 的处理结果，对没有修改的loader 不会重新加载，关闭webpack 的默认缓存结果需要添加`this.cacheable(false);`

### 常见的 loader
* 样式类的 loader：`css-loader, style-loader, less-loader, postcss-loader(添加-webkit)`等
* 文件类的 loader：`url-loader, file-loader, raw-loader`等。
* 编译类的 loader：`babel-loader, ts-loader`等
* 校验测试类 loader：`eslint-loader, jslint-loader`等

### loader 的三种使用方式
* 1. 在 `webpack.config.js` 中配置
``` js
module.exports = {
    module:{
        rules:[{
                test:/\.css$/,
                use:['css-loader'],
                // use:{loader:'css-loader',options:{}}
            }
        ]
    }
}
```
* 2. 通过命令行的参数方式
``` js
webpack --module-bind 'css=css-loader'
```
* 3. 通过内联使用
``` js
import txt from 'css-loader!./file.css';
```

## 编写一个 loader
> 思路：前面我们说过 `1.loader 是一个函数；2.对匹配到的内容进行转换；3.再将转换内容返回`，按照这个思路我们可以编写一个最简单的`loader`
``` js
// 在 ./loader/replaceLoader.js 创建一个替换字符串的 loader
module.exports = function(source) {
    return source.replace('a', 'b')
}

// 在webpack.config.js 使用 自己写的loader
module.exports = {
    module:{
        rules:[{
            test:"/\.js$/",
            use:[{
                    loader: path.resolve(__dirname, './loader/replaceLoader.js')
                    options:{
                        name: '林一一'   
                    }
                }
            ]
        }]
    }
}

// 或者使用 replaceLoader
module.exports={
    resolveLoader:['node_modules', './loader']
    module:{
        rules:[{
            test:"/\.js$/",
            use:['resolveLoader']
        }]
    }
}
```
> 上面就是一个最简单的编写 loader 的案例，虽然而欧美没有做到什么。
* loader 还可以接收 `options` 传入的参数，详情查看 [loader API](https://webpack.docschina.org/api/loaders/)，也可以使用官方提供的 `loader-util` 接收参数
``` js
const loaderUtil = require('loader-utils')
module.exports = function(source) {
    console.log(this.query.name) // 林一一
    const options = loaderUtil.getOptions(this)
    return source.replace('a', 'b')
}
```
* 异步：loader 是一个函数自然有同步和异步的区分。使用异步的loader需要添加 `this.async()` 申明异步操作
``` js
const loaderUtils = require('loader-utils')
module.exports = function(source) {
    const options = loaderUtils.getOptions(this)
    const callback = this.async()
    setTimeout(()=>{
        console.log(options.name)
        let res = source.replace('a', options.name)
        callback(null, res, sourceMaps, ast)
    }, 4000)
}
```
> 上面的代码会在4秒后打包成功，如果没有 `this.async()` 异步操作就会失败，`callback()` 回调函数将结果放回。  
* 默认情况下 webpack 给 loader 传递的字符串编码是 `utf-8`，如果需要处理二进制的文件需要添加`exports.raw = true`。
* 上面提到过webpack 会默认将`loader`的加载结果缓存如果需要关闭`webpack`的缓存结果需要添加`this.cacheable(false);`。
* `Npm link` 专门用于开发和调试本地 Npm 模块，在没有发布到 npm 上面也可以在调式本地的`loader`。具体需要在`package.json` 中配置 `本地loader`，在根目录下执行`npm link loader-name` 就可以在`node_modules`中使用本地的`loader`了。同时也可以采用上面的`resolveLoader` 实现导入 `loader` 的方式


### 总结编写 loader 的思路
> 1. loader 是一个导出函数，有返回值，可以借助第三方模块和Node api 实现。
> 2. loader 可以使用 `loader-utils` 接收到`options` 中传递过来的参数
> 3. loader 的异步编写需要显示的申明 `const callback = this.async()` 表明异步。
> 4. loader 如果需要处理二进制文件也需要声明`exports.raw = true`
> 5. loader 的允许结果会被webpack缓存，如果需要关闭`webpack`的缓存结果需要声明`this.cacheable(false)`
> 6. 编写后的本地`loader` 可以借助 `Npm link` 或 `resolveLoader` 导入。

## 二、webpack 的构建流程
> 再将 plugins 之前需要先清楚 webpack 的构建流程是怎样的
* 1. `初始化参数`。从配置文件和 `shell` 语句中合并的参数
* 2. `开始编译`。将上一步得到的参数初始化成 `complier对象`，加载所有的导入插件，执行对象的 run 方法开始执行编译；
* 3. `确定入口`。从配置的 `entry` 入口找出所有的入口文件。
* 4. `编译模块`。根据入口文件的依赖，调用所有配置的`loader`进行转换。
* 5. `完成模块编译并输出`。根据入口文件之间的依赖关系，形成一个个代码块 `chunk`。
* 6. `输出完成`。将形成的代码块 `chunk` 输出到文件系统。
> 上面初始化形成 `complier`对象 会被注入到插件的 `apply(complier)`内。`complier`对象对象包含了 Webpack 环境所有的的配置信息比如 `options, loaders, plugins`等等属性，可以简单的认为`complier`是webpack的实例。

# 三、plugin
## 3.1 plugin 介绍
### plugin 是什么
>  plugin 是一个插件，这个插件也就是一个类，基于事件流框架 `Tapable` 实现。在 webpack 的构建流程中在初始化参数后，就会加载所有的 `plugin` 插件，创建插件的实例。

### plugin 作用
> `plugin` 通过钩子可以涉及到 `webpack` 的整一个事件流程。也就是说 `plugin` 可以通过监听这些生命周期的钩子在合适的时机使用 `webpack` 提供的API 做一些事情。

### 常见的 plugin 
* `html-webpack-plugin` 会在打包后自动生成一个 `html` 文件，并且会将打包后的 js 文件引入到`html` 文件内。
* `optimize-css-assets-webpack-plugin` 对 CSS 代码进行压缩。
* `mini-css-extract-plugin`。将写入 `style` 标签内的 css 抽离成一个 用 `link` 导入 生成的 CSS 文件
* `webpack-parallel-uglify-plugin`。开启多进程执行代码压缩，提高打包的速度。
* `clean-webpack-plugin`。每次打包前都将旧生成的文件删除。
* `serviceworker-webpack-plugin`。为网页应用增加离线缓存功能。

### plugin 的使用方式
> 在`plugins`中使用
``` js
const ServiceworkerWebpackPlugin = require('serviceworker-webpack-plugin')
module.exports = {
    plugins:[
        new ServiceworkerWebpackPlugin(),
    ]
}
```

## 3.2 编写一个 plugin
> 思路：`plugins` 是一个类，`webpack` 为 plugin 提供了很多内置的 [api](https://webpack.docschina.org/api/compiler-hooks/)，需要在原型上定义 `apply(compliers)` 函数。同时指定要挂载的 `webpack` 钩子。
``` js
class MyPlugin {
    constructor(params){
        console.log(params)
    }
    // webpack 初始化参数后会调用这个引用函数，闯入初始化的 complier对象。
    apply(complier){
         // 绑定钩子事件
        // complier.hooks.emit.tapAsync()
        compiler.plugin('emit', compilation => {
            console.log('MyPlugin')
        ))
    }
}
module.export = MyPlugin
```

> 调式`plugin` 可以使用 node 的调式工具在 `package.json` 中添加 `"debug":"node --inspect --inspect brk node_modules/webpack/bin/webpack.js"`

> 1. 编写一个 `JavaScript` 命名函数。
> 2. 在它的原型上定义一个 `apply` 方法。
> 3. 在应用方法 `apply()` 中指定挂载的 `webpack` 事件钩子`complier.hooks.`。
> 4. 处理 `webpack` 内部实例的特定数据。
> 5. 功能完成后调用 `webpack` 提供的回调。


## 四、思考
### loader 和 plugin 的区别
> 1. loader 是一个函数，用来匹配处理某一个特定的模块，将接收到的内容进行转换后返回。在`webpack` 中操作文件，充当文件转换器的角色。在 `modules.rules` 中配置。
> 2. plugin 是一个插件，不直接操作文件，基于事件流框架 `Tapable` 实现，`plugin` 通过钩子可以涉及到 `webpack` 的整一个事件流程。也就是说 `plugin` 可以通过监听这些生命周期的钩子在合适的时机使用`webpack` 提供的API 做一些事情。在`plugins`中配置插件

### loader 的编写思路
> 参上

### plugin 的编写思路
> 参上

### complier 和 compilation 区别
> 1. complier 对象暴露了 webpack 整一个生命周期相关的钩子，是 `webpack` 初始化的参数的产物，包含`options, entry, plugins`等属性可以简单的理解为`webpack`的一个实例。
> 2. `compilation` 对象是 `complier` 的实例，是每一次 `webpack` 构建过程中的生命周期对象。
> 总结：两个对象都有自己的生命周期钩子，`compilation 对象` 负责的是粒度更小的生命周期钩子。`compiler对象`是webpack整一个整个生命周期钩子的对象。


## 参考
[webpack之loader和plugin简介](https://zhuanlan.zhihu.com/p/28245984)
[webpack 构建流程](https://www.cnblogs.com/chengxs/p/11022842.html)
[webpack loader和plugin编写](https://juejin.cn/post/6844903689442820110)
[深入Webpack-编写Loader](https://juejin.cn/post/6844903545242648589#heading-0)

