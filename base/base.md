# webpack
[webpack](./img/base.png)
> webpack 是一个前端打包工具，能够分析我们的项目结构，找到 JavaScript 模块和浏览器不能直接运行的扩展语言，打包成浏览器可以直接使用的格式。webpack 由 node 编写
* 代码转换，比如将es6代码转成es5
* 文件优化，可以压缩代码的体积合并文件
* 代码分割，多页面的模块分离，路由懒加载等
* 模块合并
* 自动刷新，可以开一一个本地服务
* 代码校验
* 自动发布，项目完成后可以实现自动发布
> webpack 将我们的模块(js文件) 差分成一个对象。通过入口来运行代码


## 配置 package.json 文件
* `"watch:"webpack --watch"`， 这个命令在保存后会自动打包文件。
* `"build": "webpack --config webpack.config.js"` 这一行脚本代码是运行 `webpack` 配置下的`webpack.config.js` 文件。
* `npm i webpack-dev-server -D ` 安装 `webpack` 的一个可以开启本地服务的包，`-D` 表示在开发环境 `development` 下安装的依赖
* `npx webpack-dev-server` 运行 `webpack` 提供的本地服务器，在`webpack.config.js`中可以配置服务信息


## webpack.config.js 配置基本概念
> webpack 可以0配置，但是配置很弱，需要我们手动配置。webpack.config.js 就是 webpack的配置文件。
### 1. entry
* `entry`：要打包文件的入口(路径)。打包多个文件用对象形式表示，同时 `output` 的 `filename` 属性要使用占位符表示`entry` 打包输出的`key`。
``` js
entry: './src/index.js', // 打包的出口文件

// 或对象
entry:{
    main: './src/index.js',
    sub: './src/index.js'
}
// 对于
output:{
    filename:'[name].js', //对应上面的 hash 和 name。
}
```

### 2. output
* `output`：打包好后的文件出口，可以定义文件名 `filename`，`path` 打包后文件存放的位置路径，这个路径必须是一个绝对路径，可以使用 `path.resolve(__dirname, 'dist')` 在当前目录下产生一个`dist`目录。
* 打包后的文件名 `filename` 属性具备多个占位符，`hash, name`。
* `path: path.resolve(__dirname, 'dist')`，打包后文件的存放位置
* `publicPath`，配置打包后的公共路径。
* `library`： 可以将模块导出的值赋予给一个全局的变量。
* output 还有很多的配置项
``` js
output: {
    filename: 'bundle[hash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist') // 打包后文件夹存放的位置。
    library: 'res'
},
```

### 3.mode
* `mode`: 模式，打包后的环境可以是 `production`，`development`，`production` 环境下的代码会被压缩。
``` js
mode: 'development', // 打包的模式 开发环境和生产环境production
```

#### mode 下的 production 生产环境 和 development 开发环境的区别
* `development` 不压缩代码，具备准确的 `source map: cheap-module-eval-source-map`，
* `production` 压缩代码，简单点的 `source map: cheap-module-source-map`，本地服务的`devServer` 也不需要使用，`Tree Shaking` 配置的 `optimization` 也可以不需要使用，热更新模块也可以不需要再使用
> 可以同时创建两个不同环境下的`webpack`配置。再创建一个`webpack.common.js`文件，将两个环境下的共同的代码分离。最后使用`webpack-merge`合并`common.js`和另外两个文件。



### 4. devServer 本地服务 
> webpack 中的配置项 devServer 就是基于 webpack 提供的一个包`webpack-dev-server(WDS)`来实现的
* `devServer:` 配置 `webpack-dev-server` 提供的本地服务信息
* 属性 `contentBase`: 打开后运行的文件；`open`: 自动打开一个页面
* 提供本地端口号，无需刷新页面，保存即可。
* `proxy`: 可以提供代理连接`proxy:{'apiUrl: https://xxx.html'}`
* devServer 还提供热更新模块，`hot`
> 对比 `watch: webpack --watch`，`devServer` 不需要刷新页面同时提供本地端口号。
``` js
devServer: {
    port: 3000, // 打开后的端口号
    progress: true, // 打包过程中的进度条
    contentBase: './dist', // 打包后运行的文件夹
    hot: true,  // hot
    hotOnly: true
},
```

### 5. plugins
* `plugins`: 数组。用于存放安装的插件。
* 导入的插件都需要 `new` 实例化。
* 常见的插件 `HtmlWebpackPlugin`，会在打包后自动生成一个`html`文件，并且会将打包后的 js 文件引入到`html` 文件内
* `c`，打包之前把已经打包的文件删除。
``` js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// plugin: 存放webpack的第三方插件
plugins: [
    // 打包后的js文件，通过 script 导入 html 文件内
    new HtmlWebpackPlugin({
        template: './src/index.html', // template: 打包后放入的模板
        filename: 'index.html', // 这是模板打包后的文件名
        minify: {   // 最小化配置
            removeAttributeQuotes: true, // 将 html 文件中的双引号去除
            collapseWhitespace: true, // 将html文件的代码转换成一行。
        },
        hash: true, // 哈希戳，可以保证缓存的不同
    }),

    //  抽离出来的 css
    new MiniCssExtractPlugin({
        filename: 'main.css', // 抽离出来的 css 文件名是 main.js
    })
],
```

### 6.modules
* `modules`: 配置模块的 `loader` 用于将模块 `require()` 导入到打包的文件。属性 `rules 数组` 可以定义模块的 `loader`
* `test` 是正则表达式，用于匹配文件的后缀名
* `use` 可以是一个数组也可以是一个对象，对象的形式可以传入其他的配置如 `options`，数组形式用于存放多个 `loader`。

``` js
module: {
    // 配置模块导入的规则
    rules: [ // 导入模块的规则
        {
            test: '/\.(jpg|png|gif)$/',
            use: [
                loader: `file-loader`,
                options:{
                    name:'[name].[ext]'
                }
            ]
        },
        {
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader, // 将 less 文件抽离到`main.css` 中
                'css-loader',
                'less-loader',
            ]
        }
    ]
}
```

### 7. loader 
* `loader`: Loader 就是一个打包的方案， webpack 不能直接识别非js文件结尾的文件，需要借助外部的帮助 `loader` 实现，`loader` 的特点是具备单一性，可以多个 `loader` 组合使用.
* `loader`的执行顺序是从右向左，从下到上。`rules` 数组 `use` 中的 `loader` 可以是一个对象能传入额外的配置项 `options`，也可以是一个数组里面同样也可以是一个对象


### 8.sourceMap 映射
> sourceMap 可以将编译，打包，压缩后的文件映射回源代码中。
* `sourceMap` 的配置项都是在`devtool` 中配置
* `sourceMap` 对于打包后报错的文件提示和友好
``` js
// webpack.config.js 
devtool:'source-map', //报错信息准确精确到字符，会产生.map文件，速度慢

devtool:'inline-source-map', // 报错信息准确精确到行，不会产生.map文件，速度快一点

devtool:'cheap-module-eval-source-map',// 速度更快一些，开发环境下使用

devtool:'cheap-module-source-map',// 速度更快一些，生产环境下使用
```

## 9. webpack 之 resolve
> `webpack` 启动后会在 `entry` 入口模块处找到所有依赖的文件，而`resolve`就是来约定好，如何找模块的文件的。这个配置项能够很好的筛选入口文件中的某些文件。
* 属性 `extensions:['.js', '.json']`  就是在入口文件夹中找以`.js, .json`的文件
* 属性 alias 别名，也可以为导入的模块一别名
``` js
module.exports = {
    entry:'./src',
    resolve:{
        extensions:['.js', '.json'],
        alias: {
            componentA: './src/components/'
        }
    }
}
```
> 这个属性不能滥用，对于图片文件，可以不使用这个配置项，因为都有可能图片。


## (重点) webpack 中的热更新原理 Hot Module Replacement 
> HMR 允许在运行时添加，删除，替换各个模块，而不需要重新刷新整个页面。
* `HMR`核心： 就是客服端从服务端获取更新后的文件。实际上就是本地的 `WDS(webpack-dev-server)` 和浏览器之间维护了一个 `Websocket`，当本地的资源发生变化时 `WDS` 会带上 `hash` 向浏览器推送更新，让浏览器和上次的资源对比。浏览器(客服端)对比差异后，向 `WDS` 发送 `ajax` 请求获取新的资源。实现热更新。
* 配置 `hot 和 hotOnly` 同时引入插件`webpack`，还需要在导出的出口文件中配置额外代码，让不同模块的文件互不干扰。
``` js
// /src/index.js
if(module.hot){
    // 监控模块的变化，变化后执行回调函数
    module.hot.access('moduleA', () => {})
    module.hot.access('moduleB', () => {})
}

// webpack.config.js
const webpack  = require('webpack')
module.exports = {
    entry: '/src/index.js',
    devServer:{
        hot: true,  // 
        hotOnly: true // 页面有错误信息时不刷新
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
> 在 vue 中提供的 vue-loader 内部实现了`module.hot.access`，不需要我们自己添加



## (重点) babel原理 ES6 转化成 ES5 
> 使用 babel 兼容浏览器环境
* 安装 `npm install --save-dev babel-loader @babel/core`，添加 babel 的 loader。
* 除了添加babel 之外还需要添加 `polyfill` 给浏览器补充不支持的语法。`npm install --save @babel/polyfill`，但是 `polyfill` 可能会导致变量的全局污染
* 
``` js
module:{
    rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env',{
                    useBuiltIns: 'usage'
                }]  // presets 可以标识需要转换的源码使用了哪些新特性，
              }
            }
          }]
}
```

## webpack 常用插件
### 静态资源图片插件
* `file-loader`: 提供很多的占位符，直接看官网文档
* `url-loader`: 和 `file-loader` 相似，可以打包不同的图片



### html 
> 将打包后的js文件，放入到 `html` 文件中，这个插件主要是针对的是 `html` 文件。
* `npm i html-webpack-plugin` 将打包后的文件放入到 `html` 文件内
* `template: 打包后放入的模板路劲`。
* `filename`: 模板打包后的文件名。
* `minify`: 对象，最小化操作，将打包后 `html` 文件也压缩，`removeAttributeQuotes: true` 将 html 文件内的双引号去除。`collapseWhitespace: true, 将html文件的代码转换成一行`。
* `hash`: 哈希戳。防止打包后的文件发生覆盖。保证产生的是不同的缓存。也可以在打包的出口文件处加上`[hash:8]` 生成不同的打包文件。
> 最终的效果在 `html` 文件内有 `<script src=bundle8f33b531.js?**8f33b5319c229ecfbf99**></script>`

### CSS 样式的loader和插件
> CSS文件引入到 `html` 模板文件内不会一起打包，因为 `html` 模板内的代码不会变化，也就不会将 CSS 文件打包，可以通过 `require()` 导入 css 文件结合 `webpack` 配置项 `module` 模块中的loader配置。 
* `css-loader` 用于解析 `@import` 语法，内置多个配置项`model: true` 将css文件成为模块化
* `style-loader`: 把解析打包后的文件插入到 `head` 标签中。
* `less-loader`,将 less 语法转换成 css。
* `postcss-loader`，用来给 css 样式做浏览器前缀 `webkit` 的配置
* 插件：`mini-css-extract-plugin`，将写入 `style` 标签内的 css 抽离成一个 用 `link` 导入 生成的 CSS 文件，`MiniCssExtractPlugin.loader` 可以将抽离文件都导入到一个文件内
* 插件：`optimize-css-assets-webpack-plugin` 对CSS 代码进行压缩。

### JS 插件


## Tree Shaking (webpack 优化)
> Tree Shaking 在 webpack2.0 引入，为了解决导入模块时，不导入其他的函数。去掉了实际上并没有使用的代码来减少包的大小。
* Tree Shaking 只支持 `ES module` 的引入，即 `import from `，不支持 `commonJs` 的`require()`的导入，因为 Tree Shaking 只支持静态的映入方式。
* Tree Shaking 开发环境`mode: production`下的的基本配置，同时还需要在 `package.json` 配置 `"sideEffects":false,`，`sideEffects:['a.css', 'b.css']` 可以在 `tree shaking` 打包的环境下忽略掉某个文件，在 webpack 打包的情况下都会去按照 `Tree Shaking` 的方式打包。
``` js
//
module.exports = {
    mode: 'development',
    // development tree shaking 的配置
    optimization: {
        usedExports: true
    },
}
```
* 没有导出的函数都会被 `Tree Shaking` 忽略掉 


### 思考： 你觉得 CommonJS 为什么不能做 Tree-Shaking ?
> 答：因为 `CommonJS` 是动态的引入方式，`ES module` 内部是静态的引入方式


### 思考：写过 loader 和 plugin 吗？(实话实说，没有)那你知道两者有什么差异吗？(先loader后plugin)



## webpack优化之 Code Splitting(代码分割)
[webpack 中实现的 code splitting](https://www.cnblogs.com/floor/p/10788304.html)
> `Code Splitting` 代码分割，把所有代码分成一块一块(chunk)，需要某块代码的时候再去加载它。 `允许只加载我们修改过的代码`，而不是修改部分代码后全部加载所有文件。
* `Code Splitting` 不是 `webpack` 独有的，原本就有的概念。
* `webpack` 内置了插件`splitChunk`实现代码分割的逻辑，`webpack` 中的代码分割分为同步和异步。
* 同步代码分割，只需要要`optimizations` 中配置`splitChunks`。
* 异步的代码分割，针对于 `import` 导入，不需要做任何的配置，代码会自动分割
``` js
// webpack.config.js 同步代码分割
module.exports = {
    optimizations:{
        // 代码分割的配置项
        splitChunks:{
            chunks:"all"
        }
    }
}
```
[Webpack 大法之 Code Splitting](https://zhuanlan.zhihu.com/p/26710831)

2.那你再说一说Loader和Plugin的区别？

Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。



## 文献
[当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992#heading-0)
[「吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487#heading-0)



