# loader
## loader 介绍
### loader 是什么
> loader 其实是一个函数，对匹配到的内容进行转换，将转换后的结果返回。

### loader 作用
> 在 `webpack` 中 `loader` 就像是一位翻译官。`webpack` 只认识 `JavaScript` 这们语言，对于其他的资源通过 `loader` 后可以转化做预处理


### 常见的loader
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
> 思路：前面我们说过 1.`loader` 是一个函数；2.对匹配到的内容进行转换；3.再将转换内容返回
``` js
// 创建一个 替换字符串的loader
module.exports = function(source) {
    return source.replace('a', 'b')
}

// 在webpack.config.js 使用loader

```



Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情。
Loader的API 可以去官网查阅

Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据尽可能的异步化 Loader，如果计算量很小，同步也可以Loader 是无状态的，我们不应该在 Loader 中保留状态使用 loader-utils 和 schema-utils 为我们提供的实用工具加载本地 Loader 方法

Npm linkResolveLoader


## 参考
[webpack之loader和plugin简介](https://zhuanlan.zhihu.com/p/28245984)
[webpack 面试题](https://juejin.cn/post/6844904094281236487#heading-17)

