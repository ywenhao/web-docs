# 代码优化

- 增加代码可读性，增加代码可维护性
- 熟悉array的api也是很有必要的

## 消除多级if嵌套

```ts
import { ref } from 'vue'

const count = ref(0)
const isActive = ref(false)

function test() {
  if (count.value < 5)
    return
  if (isActive.value)
    return

  add()
}

function add() {
  count.value++
  // 其他逻辑
}
```

- 在函数体中，先把否定的条件提前，`return`掉，后面只处理正面的逻辑。好处就是，写的时候思维不容易分散，写起来更清晰。
- 代码逻辑复杂，可以按逻辑拆分成多个函数，方便维护。

```ts
import { ref } from 'vue'

const type = ref(0)

function test() {
  if (type === 1 || type === 2 || type === 3) { // [!code--]
    console.log('ok')// [!code--]
  }// [!code--]

  if ([1, 2, 3].includes(type.value)) { // [!code++]
    console.log('ok')// [!code++]
  }
}
```

- 可以用`includes`消除`||`，后续添加新类型，只需要在数组中添加即可。

```ts
import { ref } from 'vue'

type Type = 1 | 2

const type = ref<Type>()

const typeMap: Record<`${Type}`, () => void> = {
  1: add,
  2: mise,
}

function add() {
  console.log('add')
}

function mise() {
  console.log('mise')
}

function test(val: Type) {
  const fn = typeMap[val]
  fn?.()
}
```

- 可以用对象来代替多级`if`，后续添加新类型，只需要在对象中添加即可。
- 也可以用 `new Map()`，道理是一样的

## 熟练使用array api

```ts
const list = [0, 1, 2, 3]

const isAdd = ref(false)

async function test() {
  const userList = list.filter(Boolean) // [1, 2, 3]
  const userObj = userList.map(item => ({
    id: item,
    name: `${item} - ${item}`,
  }))

  const params = isAdd.value ? userList : userObj
  const requestFn = isAdd.value ? addUser : editUser

  await requestFn(params)
}
```

- 用array 的 api，每个变量单独写出来，不要揉到一个for循环里面，代码可读性更好
- 合理使用三目运算符，也能提高可读性
- 代码换行分块

## promise

- 建议精读文档:
  1. [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  2. [async_function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
  3. [try...catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)

### async/await

```ts
async function test() {
  const num = await test2()
  console.log(num) // 6
}

async function test2() {
  const num = await test3()
  return num + 1
}

function test3() {
  // `number` 是Promise的返回值，通过泛型传入
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(5)
    }, 1000)
  })
}
```

- 异步操作，使用`async/await`，可以避免回调地狱。
- 什么情况下只能用`new Promise`，那就是需要拿到一个`callback`内部的数据的时候，这个`callback`调用不一定是同步的，比如`setTimeout`、`onload`等。

### try/catch

```ts
async function test() {
  try {
    const data = await fetchFn()
    // 这里相当于promise.then里

    // 这里可以手动throw一个错误，会执行下面catch 里面的代码
    throw new Error('error')
  }
  catch (error) {
    // 这里相当于promise.catch里
    console.log(error)
  }
  finally {
    // 这里相当于promise.finally里
    console.log('finally')
  }
}

async function fetchFn() {
  return axios.get('/api')
}
```

- `async/await`和`try/catch`配套使用

### try/catch 返回值探索

```ts
function test() {
  try {
    return 1
  }
  catch (error) {
    return 2
  }
  finally {
    // eslint-disable-next-line no-unsafe-finally
    return 3
  }
  return 4
}

test() // 3
```

```ts
function test() {
  try {
    return 1
  }
  catch (error) {
    return 2
  }
  finally {
    console.log('finally')
  }
  return 4
}

test() // 1
```

- `try/catch`在函数中`return`的返回值，建议精读文档
