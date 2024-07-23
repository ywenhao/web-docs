# vue3

- 在vue3中也有一些注意点，可以避免一些bug和一些性能问题

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
