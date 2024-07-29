# 性能优化

- 性能优化是一个很大的话题，这里只介绍一些基本的优化方法。

## tree-shaking

- vite 默认支持 tree-shaking，不需要额外配置。
- 使用 import 语法导入模块，vite 会自动排除未使用的代码。
- 尽量避免`import * as Utils from '@/utils`语法。这样相当于导入了整个模块，打包会包含整个模块。
- 使用lodash的es库，`lodash-es`，`@types/lodash-es`使用`import { debounce } from 'lodash-es'`导入。

## rollup-plugin-visualizer

- 安装`rollup-plugin-visualizer`插件，在vite中配置，可看到项目中。然后看打包后的文件大小，可以清除的看到模块的大小，针对性的优化。

## 有头有尾

- 计时器等，记得手动清除。

## 其他优化

- 图片压缩
- 代码压缩
- 打包优化
- 请求优化
- 防抖节流
- 缓存
- cdn
- 懒加载
- 预加载
- 预渲染
- 白屏分析，骨架屏
- ...
