# vue3

- 在vue3中，推荐`setup`写法，不推荐`option`写法，`setup` 写法更简洁，更易读，没有`this`指向问题，`hooks`提高代码逻辑复用性，也更易维护。
- 在vue3中，重复性代码，多封装，在后续修改时，只需要修改封装的那一部分代码即可更易维护。
- 不要一个文件几千行，读着累，也就更容易堆成 :shit:山。

## hooks

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

## 组件设计

- 组件设计，尽量使用`props`传递数据，不要直接修改`props`， vue3.4之后可以使用`defineModel`，它的底层也是`props`结合 `emit`实现的，本质上算是`v-model`的语法糖,详见[defineModel](https://cn.vuejs.org/api/sfc-script-setup.html#definemodel)
