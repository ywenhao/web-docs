# typescript类型修复

- 项目要保证健壮性，typescript是必不可少的
- 使用typescript后，增加了代码量，但是增加了可读性
- 不要满屏的`any`, 遇到类型报错时，要勇于去修复

# as

```ts
const a: number | string = 1

const b = a as number

const c = a as unknown as null
```

- 在ts中，`as`是类型转换，`unknown`是ts中所有类型的父类，强制转换到某一类型时可以使用`as unknown`,慎用

## 类型断言

```ts
const list = [{
  id: 1,
  value: '1'
}]

const item = list.find(item => item.id === 1) // { id: number; value: string } | undefined
const item2 = list.find(item => item.id === 1)! // { id: number; value: string }

const obj = ref<{ id: 1 }>()

const id = obj.value!.id // number
const id = obj.value?.id // number | undefined
```

- 类型断言`!`, 可以将`undefined`转换为非`undefined`类型

# 可选链`?`

```ts
const obj = ref<{ id: 1 }>()

const id = obj.value?.id // number | undefined
// 相当于
const id = obj.value && obj.value.id // number | undefined
```

- 可选链`?`，可以简化代码，避免`undefined`报错，算是es6的语法糖

## enum

```ts
enum Direction {
  a = 2,
  b,
  c
}

// 编译后
const Direction = {
  2: 'a',
  3: 'b',
  4: 'c',
  a: 2,
  b: 3,
  c: 4
}
```

- 枚举，可以定义常量，常量的值是数字，也可以不指定，默认从0开始递增，也可以指定值，之后的值从指定值开始递增
- 一般不建议使用枚举，因为这个是ts的语法，但是编译后是js的`object`, 看团队规范。

## 取`list`的`value`类型

```ts
type List = { key: string, value: number }[]

type value = List[number]['value']
```

## 取`enum`的`value`和`key`类型

```ts
enum Direction {
  s = 'start',
  e = 'end'
}

type Key = keyof typeof Direction // s | e
type Value = `${Direction}` // "start" | "end"
```

## never

```ts
type A<T> = T extends true ? 1 : never
```

- never是ts中所有类型的子类，`never`类型表示永不存在的值，比如`throw new Error()`
- 配合`never`，可以写出一些类型检查的函数
- `never`在[类型体操](https://github.com/type-challenges/type-challenges)中，可以用来表示没有。ts类型中没有`a || b` 和 `a && b`语法，但是可以用`never`来模拟。
