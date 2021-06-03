# webpack 提高打包速度篇
## webpack
* 1. 可以升级 webpack 的版本，新的 `node, npm, yarn`版本
* 2. 在尽可能少的模块上应用 `loader`，因为不是所有的文件都需要相应的`loader`处理，可以使用`rules数组` 中的`exclude/include`做文件的筛选。 
``` js
module: {
    rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            //include: path.resolve(_dirname,'../src')
            use: {
                loader: "babel-loader",
            }
        }
    ]
}
```


