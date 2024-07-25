# vue3

- 在vue3中也有一些注意点，可以避免一些bug和一些性能问题
- 封装方法和组件的时候，秉承`复杂封装，简单调用`的原则。

## shallowRef

```vue
<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue'

const chartRef = ref<HTMLDivElement>()

const echartsRef = shallowRef()

onMounted(() => {
  echartsRef.value = echarts.init(chartRef.value)
})
</script>

<template>
  <div ref="chartRef" />
</template>
```

- 因为在vue里面ref是深层次的转换响应式，可能会破坏实例的数据结构，同时性能损坏会更多，而在这种应用场景下，这种转换是不必要的，应该避免
- 需要使用shallowRef的有`echarts`、`mapbox`、`threejs`、`amap`等。

## 手动清除定时器

```ts
import { onMounted, onUnmounted, ref } from 'vue'

let timerId: number | null = null

const count = ref(0)

function start() {
  timerId = setInterval(() => {
    count++
  }, 1000)
}

function stop() {
  if (timerId) {
    window.clearInterval(timerId)
    timerId = null
  }
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
```

- `setInterval`、`requestAnimationFrame`和地图等一些方法或者实例，一定要在`onUnmounted`或者`onBeforeUnmount`中清除，否则可能会内存泄漏，页面复杂的话不好排查也更容易卡顿。

## for循环

```vue
<template>
  <div v-for="item in list" :key="item.id">
    {{ item }}
  </div>
</template>
```

- 循环的时候，一定要加上`key`属性，最好是数据中的一个唯一标识，例如`id`，方便`vue`进行精准更新，对于不会改变的数据，可以使用`index`
- 有的时候使用`index`作为`key`，会导致一些性能问题，的同时出现数据渲染错误，旧数据保留在了dom中，如果`list`中没有唯一标识，可以手动在`list`数据赋值的时候，给`list`中的每一项加上一个`id`，可以使用`uuid`等一些手段
- `v-if`和`v-for`优先级问题，这个是由vue源码决定,没有其他原因，vue2中`v-for`优先级更高，vue3中`v-if`优先级更高,**不建议在同一个元素上一起使用**，碰到需要同时使用的场景，可以外包一层`template`,`template`上使用`v-if`

## 变量声明

```ts
import { ref, watchEffect } from 'vue'

watchEffect(() => {
  console.log(msg.value)
})

const msg = ref('Hello World!')
```

- `msg`声明在`watchEffect`之后，会报错`Cannot access 'msg' before initialization`
- 有的时候不会报错，或者说开发者直接忽略报错，隐藏的bug也是非常致命的，为了避免这种问题，可以把`defineProps`、`ref`、`computed`、`reactive`等放在`setup`最上面。

完整示例：

```ts
import { computed, ref } from 'vue'

const props = defineProps<{
  ids: string[]
  visible: boolean
}>()

const emit = defineEmits<{
  click: []
  change: [value: number]
}>()

interface UserInfo {
  id: string
  name: string
}

const modelValue = defineModel<boolean>({ required: true })

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const userInfo = ref<UserInfo>()

function handleClick() {
  count.value++
  emit('change', count.value)
}

function getUserId() {
  return userInfo.value?.id
}

defineExpose({ getUserId })
```

- 可利用换行把代码分开，方便阅读
