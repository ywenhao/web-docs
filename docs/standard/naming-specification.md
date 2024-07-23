---
outline: deep
---

# 命名规范

## 变量/function

```ts
const a = 1 // [!code --]
function b() {} // [!code --]

const productCount = 1 // [!code ++]
function createCount() {} // [!code ++]
function handleClick() {} // [!code ++]
```

- 变量和函数名使用驼峰命名法，首字母小写，用单词增加可读性
- 用户手动触发的函数，使用`handle`作为前缀，比如`handleClick`

## class/typescript

```ts
class product {} // [!code --]
interface student {} // [!code --]

class Product {} // [!code ++]
interface Student {} // [!code ++]
```

- class/interface/type 命名使用大驼峰命名法，首字母大写，用单词增加可读性

## const 不可变变量

```ts
const countKey = 'countKey' // [!code --]
const provideKey = Symbol('provideKey') // [!code --]

/** xx业务注释 */ // [!code ++]
const COUNT_KEY = 'COUNT_KEY' // [!code ++]
/** xx业务注释 */ // [!code ++]
const PROVIDE_KEY = Symbol('PROVIDE_KEY') // [!code ++]
```

- const 不可变变量使用大写字母，用下划线分割单词增加可读性
- 注释用`/** xx业务注释 */`这种形式书写，在使用的时候，vscode会有相应提示，用`// xx业务注释` 形式书写，不会提示

## 私有变量

```ts
const _count = 1
function _getValue() {}

class Product {
  #count = 1
}
```

- 对于私有变量，使用`_`作为前缀，这是约定俗成的写法，方便区分私有变量和公共变量，增加可读性
- `class`中，私有属性使用`#`作为前缀，详见[class私有属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Private_properties)

## 未使用的函数参数

```ts
function getValue(_value: number, name: string) {
  console.log(name)
}
```

- 对于未使用的函数参数，使用`_`作为前缀，这个在某些地方可以看到，在编辑器中有时候用来消除eslint的警告

## 样式命名

```scss
.productList {
} // [!code --]

.product-list {
} // [!code ++]
```

- 在css中 样式命名使用`kebab-case`命名法，`-`分割单词，首字母小写
