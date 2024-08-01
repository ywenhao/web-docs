# vue3

- 在vue3中，推荐`setup`写法，不推荐`option`写法，`setup` 写法更简洁，更易读，没有`this`指向问题，`hooks`提高代码逻辑复用性，也更易维护。
- 在vue3中，重复性代码，多封装，在后续修改时，只需要修改封装的那一部分代码即可更易维护。
- 不要一个文件几千行，读着累，也就更容易堆成 :shit:山。
- 写业务不建议`jsx`，vue针对jsx的diff优化没有template好。

## 不要使用`prototype`

```ts
// eslint-disable-next-line no-extend-native
Date.prototype.format = function () { // [!code --]
  // xxxxx // [!code --]
} // [!code --]

const date = formatDate(new Date()) // [!code ++]

function formatDate(date: Date) { // [!code ++]
  // 时间处理逻辑 // [!code ++]
} // [!code ++]

// vue3
const app = createApp() // [!code --]
app.config.globalProperties.$formatDate = formatDate // [!code --]
```

- 不要在对象和方法的原型上定义属性和方法，因为所有实例都共享同一个原型对象，保不住被人也在项目里面某个角落也修改了`prototype`上同名的属性和方法，建议用`纯函数`。
- vue3中，`app.config.globalProperties`，在vue2中是`Vue.prototype`，也不建议使用，不容易追踪调用来源，同样用函数直接调用的方式代替。

## hooks(composables)

// hooks/useQuery.ts

````ts
export type Query = Record<string, any>

/**
 * 获取query参数
 * @returns Ref<T>
 *
 * @example
 * ```ts
 * const query = useQuery()
 * const query = useQuery<{ id: string }>()
 * ```
 */
export function useQuery<T extends Query>() {
  const query = shallowRef({} as T)

  onLoad((data) => {
    if (typeof data === 'object') {
      for (const key in data) {
        if (typeof data[key] === 'string') {
          data[key] = decodeURIComponent(data[key])
        }
      }
    }
    query.value = data as T
  })

  return readonly(query)
}
````

- 文件放在`hooks`目录下
- 文件名和函数名一致，以`use`开头
- vue里面又叫`composables`，意思是可复用的组合函数，`react`里面叫`hooks`，`composables`单词太复杂了，所以大家还是叫`hooks`顺口

## store(pinia)

// store/count.ts

```ts
import { defineStore } from 'pinia'

export const useCountStore = defineStore(
  'count',
  () => {
    const count = ref(1)

    function add() {
      count.value++
    }

    return { count, add }
  },
)
```

- 推荐使用`pinia`，`vuex`不好用，`pinia`有更好的类型提示
- 文件放在`store`目录下
- 文件名用 `count`，store名用 `useCountStore`, 增加可读性
- defineStore第一个参数传`id`，第二个参数传一个函数，返回一个对象，在这函数中写法和setup类似，且在函数内定义的方法，变量在同一作用域下，减少开发者心智负担

## computed

```js
import { computed, ref } from 'vue'

const num = ref(1) // [!code --]
const doubleNum = ref(0) // [!code --]

function add() { // [!code --]
  num.value++ // [!code --]
  doubleNum.value = num.value * 2 // [!code --]
} // [!code --]

const count = ref(1) // [!code ++]
const double = computed(() => count.value * 2) // [!code ++]
```

- 上面错误的写法看起来很傻，也很啰嗦，但确实有人在项目里面真的这样写

```vue
<script lang="ts" setup>
import { computed, ref } from 'vue'

const list = ref([
  { key: 1, name: 'a' },
  { key: 2, name: 'b' },
])

const list2 = [
  { key: 1, name: 'list2-a' },
  { key: 2, name: 'list2-b' },
]

const getList2Name = computed(() => (key: string) => { // [!code --]
  return list.value.find(item => item.key === key)?.name // [!code --]
}) // [!code --]

function getList2Name(key: string) { // [!code ++]
  return list.value.find(item => item.key === key)?.name // [!code ++]
} // [!code ++]
</script>

<template>
  <div v-for="item in list" :key="item.key">
    name: {{ item.name }}
    list2-name: {{ getList2Name(item.key) }}
  </div>
</template>
```

- 上面这样的`computed`里面返回一个函数，并不会有缓存效果，相当于直接写函数
- `vue`的`template`里面，响应式数据改变时，其响应式数据所在的函数也会重新执行
- 上面错误的写法看起来很傻，但确实有人在项目里面真的这样写

## props

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string
  likes?: number
  visible?: boolean
}>()

const modelValue = defineModel<boolean>()

console.log(props.visible) // false
</script>

<template>
  <!-- 仅写上 prop 但不传值，会隐式转换为 `true` -->
  <BlogPost is-published />
</template>
```

- 都使用`typescript`了，声明`props`、`emit`和`defineModel`用其`typescript`的声明方式
- 父组件引用子组件时，`visible`带有`?`可选符，如果不给子组件传递`visible`，因为`visible`的类型是`boolean`,vue在底层做了转换，那么`props.visible`的值就是`false`
- 尽量使用`props`传递数据，不要直接修改`props`， vue3.4之后可以使用`defineModel`，它的底层也是`props`结合 `emit`实现的，本质上算是`v-model`的语法糖,详见[defineModel](https://cn.vuejs.org/api/sfc-script-setup.html#usage-with-typescript)

## defineModel

```ts
const visible = defineModel<boolean>('visible')

// 等价于
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>()

const visible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})
```

- `defineModel`可以简化代码，一行相当于写了上面那一坨

```vue
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  list?: string[]
}>(), {
  list: () => []
})
</script>
```

- 上面代码中，`list`是可选的，如果不传值，则使用默认值`[]`,值得注意的是`list`的默认值需要是函数`() => []`
- 如果希望默认值是空对象`{}`,那么同理默认值应该是函数`() => ({})`
- 详见[withDefaults](https://cn.vuejs.org/guide/typescript/composition-api.html#props-default-values)

## emit

```ts
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
```

- 建议使用上面的方式进行标注，更简洁
- 详见[针对类型的 props/emit 声明](https://cn.vuejs.org/api/sfc-script-setup.html#type-only-props-emit-declarations)

## ref

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import Child from './Child.vue'

const childRef = ref<InstanceType<typeof Child>>()

function add() {
  childRef.value.count++ // [!code --]
  childRef.value?.add() // [!code ++]
}
</script>

<template>
  <Child ref="childRef" />
</template>
```

- 用`ref`获取一个组件实例，需要修改组件实例里面的数据时，为了不破坏数据流向，应该在组件内部`defineExpose`暴露一个修改数据的函数，然后在父组件中调用该方法
- 使用`InstanceType`和`typeof`组合来获取子组件的实例类型，可以获得相应的代码提示，包括子组件`defineExpose`暴露的方法和属性

## 泛型

```vue
<script lang="ts" setup generic="T extends Item">
export interface Item {
  id: string
  name: string
}

const props = defineProps<{
  data: T[]
}>()

function add(item: T) {
  console.log(item)
}
</script>
```

- 上面代码中，`T`是泛型，`generic="T extends Item"`表示`T`继承于`Item`, 父组件的传值的数据类型必须是`{id: string; name: string}[]`，或者它的扩展。
- 顺便一提，`vue`文件里面的类型是可以`export`的，在其他地方可以使用的。如果类型定义很多，很混乱的话，建议在`types.ts`里面定义好，然后在`vue`文件里面`import`使用。
- 详见[泛型](https://cn.vuejs.org/api/sfc-script-setup.html#generics)

## devtools

- 这个插件很好用，但是不知道为什么还是有很多人不用
- 有vite插件版本和chrome插件版本
- 亮点
  1. 可以很清晰的看到组件结构
  2. 2直接从dom跳转到编辑器的代码行位置
  3. 可以很清晰的看到组件的`props`、`data`、`computed`、`watch`等，调试的时候减少`console.log`的次数
  4. 可以看到pinia的数据
  5. 在vite版本下还有很多新功能值得探索，chrome版本后续会跟进

## 组件的设计

### 组件架构

<img src="/static/component-design-1.svg" />

- 符合这样的设计，那么在`vue3`里面，父组件引用子组件时，可以这样写

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'
import Child2 from './Child2.vue'

const data = ref()
</script>

<template>
  <Child :data="data" />
  <Child2 :data="data" />
</template>
```

### 数据流向

<img src="/static/component-design-2.svg" />

- 父组件`data`传递给子组件，层级不深的用`props`传递，层级深的可以用用`provide/inject`传递，也可以使用`store`传递
- **不要在父组件里面通过`ref`直接调用子组件方法**,当组件复杂度上来后，会变得难以维护，数据流向混乱。
- 父组件`data`传递给子组件，子组件应该有自己的组件方法和状态，子组件接受到`data`这个响应式数据后，子组件自己内部使用`watch`等方式触发相应的操作。
