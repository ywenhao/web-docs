# typescript类型修复

- 项目要保证健壮性，typescript是必不可少的
- 使用typescript后，增加了代码量，但是增加了可读性
- 不要满屏的`any`, 遇到类型报错时，要勇于去修复
- 在后端swagger文档类型和注释规范的前提下，前端可以自己写工具，自动生成typescript类型，起码减少3/2的代码量，我写过类型生成插件+api请求函数生成插件，请求函数也不用自己写了，前提是后端文档规范好。

## as

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

## 可选链`?`

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

# @ts-ignore/@ts-expect-error

```ts
const item = {
  alipayAccount: '',
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  _id: uni.$u.guid(),
}
```

- 使用`@ts-ignore`可以忽略报错，但是类型可以自己修复的时候不建议使用

## 泛型

```ts
import { ref } from 'vue'

function getList<T>(list: T[]): T {
  const value = ref<T>()
  return value.value as T
}
```

// request hooks

```ts
import { type Ref, computed, reactive, ref, watch } from 'vue'

type GetDataByRequest<T> = T extends (...args: any[]) => Promise<infer R>
  ? R extends { list?: infer D }
    ? D
    : never
  : never

type RunParams<T extends PromiseFn, P> =
  | (Parameters<T>[number] & Partial<P>)
  | Parameters<T>[number]

type PromiseFn = (...args: any[]) => Promise<any>

interface Pagination {
  page: number
  limit: number
  offset: number
  total: number
}

/**
 * 通用list请求函数
 * @param fn 请求函数
 * @param defaultParams 默认可选参数
 * @return
 */
export function useListRequest<T extends PromiseFn, D extends DefaultParams>(
  fn: T,
  defaultParams?: D
) {
  const loading = ref(false)
  const data = ref([]) as Ref<GetDataByRequest<T>>
  const pagination = reactive<Pagination>({
    page: 1,
    limit: 20,
    offset: 0,
    total: 0,
  })

  const run = async (params?: RunParams<T, D>, ...args: any[]) => {
    loading.value = true
    try {
      const { page, limit } = pagination
      const res = await fn(
        { ...defaultParams, page, limit, ...params },
        ...args
      )

      data.value = res.list
      pagination.total = res.total
    }
    finally {
      loading.value = false
    }
  }

  return { loading, run, data, pagination }
}

type GetSwitchData<K, T> = T extends (
  | [K, PromiseFn]
  | [K, PromiseFn, DefaultParams]
)[]
  ? GetDataByRequest<T[number][1]>
  : never

type GetSwitchRun<K, T> = T extends (
  | [K, infer R extends PromiseFn]
  | [K, infer R extends PromiseFn, infer D extends DefaultParams]
)[]
  ? (params?: RunParams<R, D>, ...args: any[]) => Promise<void>
  : never

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Array<any> ? DeepReadonly<T[K]> : T[K]
}

type NoReadonly<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<any>
    ? NoReadonly<T[K]>
    : T[K]
}

type SwitchFnList<T> = DeepReadonly<
  ([T, PromiseFn, DefaultParams] | [T, PromiseFn])[]
>

/**
 * 多个请求函数切换
 * @param active 切换的值
 * @param switchFnList 切换的函数列表，参数后加上as const, [active, fn][] | [active, fn, defaultParams][]
 * @return
 */
export function useSwitchRequest<T, S extends SwitchFnList<T>>(
  active: Ref<T>,
  switchFnList: S
) {
  const requestList = switchFnList.map(([a, b, c]) => [
    a,
    useListRequest(b, c),
  ]) as [keyof T, ReturnType<typeof useRequest>][]

  const request = computed(() => {
    const item = requestList.find(([a]) => a === active.value)!
    return item[1]
  })

  const loading = computed(() => request.value.loading.value)
  const data = computed(
    () =>
      request.value.data.value as unknown as GetSwitchData<
        NoReadonly<T>,
        NoReadonly<S>
      >
  )

  const run = computed(
    () =>
      request.value.run as unknown as GetSwitchRun<NoReadonly<T>, NoReadonly<S>>
  )

  const pagination = computed(() => request.value.pagination)

  watch(active, () => {
    pagination.value.page = 1
  })
  return reactive({ loading, data, run, pagination })
}
```

- 在写hooks的时候，很有用, 可以用来推导函数传入参数的类型
- 上面的request方法，可以传入一个请求函数，编辑器会自动推导其参数和返回值的类型

## 进阶

- [typescript-utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [typescript教程](https://wangdoc.com/typescript/)
- [type-challenges-类型体操](https://github.com/type-challenges/type-challenges)
