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

```ts
function checkStatus() { // [!code --]
  if (isLogin()) { // [!code --]
    if (isVip()) { // [!code --]
      if (isDoubleCheck()) { // [!code --]
        done() // [!code --]
      }
      else { // [!code --]
        throw new Error('不要重复点击') // [!code --]
      } // [!code --]
    }
    else { // [!code --]
      throw new Error('不是会员') // [!code --]
    }// [!code --]
  }
  else { // [!code --]
    throw new Error('未登录') // [!code --]
  } // [!code --]
} // [!code --]

function checkStatus() { // [!code ++]
  if (!isLogin()) // [!code ++]
    throw new Error('未登录') // [!code ++]

  if (!isVip()) // [!code ++]
    throw new Error('不是会员') // [!code ++]

  if (!isDoubleCheck()) // [!code ++]
    throw new Error('不要重复点击') // [!code ++]

  done() // [!code ++]
}
```

- 在函数体中，先把否定的条件提前，`return`掉，后面只处理正面的逻辑。好处就是，写的时候思维不容易分散，写起来更清晰。

## 可选链简化判断和调用

```ts
if ( // [!code --]
  store.getters // [!code --]
  && store.getters.userInfo // [!code --]
  && store.getters.userInfo.menus // [!code --]
) { // [!code --]
  // 逻辑...// [!code --]
}// [!code --]

if (store?.getters?.userInfo?.menus) { // [!code ++]
  // 逻辑...// [!code ++]
}// [!code ++]

// 函数调用
props.onChange && props.onChange(e) // [!code --]

props?.onChange?.(e) // [!code ++]
```

## 函数拆分

```ts
function checkGameStatus() { // [!code --]
  if (remaining === 0 // [!code --]
    || (remaining === 1 && remainingPlayers === 1) // [!code --]
    || remainingPlayers === 0) { // [!code --]
    quitGame()// [!code --]
  } // [!code --]
} // [!code --]

function isGameOver() { // [!code ++]
  return ( // [!code ++]
    remaining === 0 // [!code ++]
    || (remaining === 1 && remainingPlayers === 1) // [!code ++]
    || remainingPlayers === 0 // [!code ++]
  ) // [!code ++]
} // [!code ++]

function checkGameStatus() { // [!code ++]
  if (isGameOver()) { // [!code ++]
    quitGame() // [!code ++]
  } // [!code ++]
} // [!code ++]
```

- 代码逻辑复杂，可以按逻辑拆分成多个函数，方便维护。

## 函数传参优化

```ts
function getMyInfo(name, age, gender, address, phone, email) { // [!code --]
  // ...
}// [!code --]

// 行参封装成对象，对象函数内部解构
function getMyInfo(options) { // [!code ++]
  const { name, age, gender, address, phone, email } = options // [!code ++]
  // ...
} // [!code ++]

getMyInfo( // [!code ++]
  { // [!code ++]
    name: '鸽鸽', // [!code ++]
    age: 18, // [!code ++]
    gender: '男', // [!code ++]
    address: '新世界', // [!code ++]
    phone: '123456789', // [!code ++]
    email: '123456789@email.com' // [!code ++]
  } // [!code ++]
) // [!code ++]
```

## include 代替 ||

```ts
import { ref } from 'vue'

const type = ref(0)

function test() {
  if (type === 1 || type === 2 || type === 3) { // [!code --]
    console.log('ok') // [!code --]
  } // [!code --]

  if ([1, 2, 3].includes(type.value)) { // [!code ++]
    console.log('ok') // [!code ++]
  } // [!code ++]
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

```ts
// switch case
function statusMap(status: string) { // [!code --]
  switch (status) { // [!code --]
    case 'success': // [!code --]
      return 'SuccessFully' // [!code --]
    case 'fail': // [!code --]
      return 'failed' // [!code --]
    case 'danger': // [!code --]
      return 'dangerous' // [!code --]
    case 'info': // [!code --]
      return 'information' // [!code --]
    case 'text': // [!code --]
      return 'texts' // [!code --]
    default: // [!code --]
      return status // [!code --]
  } // [!code --]
} // [!code --]

// if else
function statusMap(status: string) { // [!code --]
  if (status === 'success') // [!code --]
    return 'SuccessFully' // [!code --]
  else if (status === 'fail') // [!code --]
    return 'failed' // [!code --]
  else if (status === 'danger') // [!code --]
    return 'dangerous' // [!code --]
  else if (status === 'info') // [!code --]
    return 'information' // [!code --]
  else if (status === 'text') // [!code --]
    return 'texts' // [!code --]
  else return status // [!code --]
} // [!code --]

// 使用映射进行优化
const STATUS_MAP = { // [!code ++]
  success: 'SuccessFully', // [!code ++]
  fail: 'failed', // [!code ++]
  warn: 'warning', // [!code ++]
  danger: 'dangerous', // [!code ++]
  info: 'information', // [!code ++]
  text: 'texts' // [!code ++]
} // [!code ++]

function statusMap(status: string) { // [!code ++]
  return STATUS_MAP[status] ?? status // [!code ++]
} // [!code ++]
```

- `switch`语法在javascript中，看起来层级很深，完全可以用映射代替
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
