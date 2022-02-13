<template>
  <div class="tm-numbox">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="numbox">
      <a @click="changeNum(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="modelValue">
      <a @click="changeNum(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'TmNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 使用 vueuse 的 useVModel 做数据绑定，修改 count 值时会通知父组件进行数据的更新。
    const count = useVModel(props, 'modelValue', emit)
    const changeNum = step => {
      const newValue = count.value + step
      if (newValue < props.min || newValue > props.max) return
      count.value = newValue
      emit('change', newValue)
    }
    return { changeNum }
  }
}
</script>

<style scoped lang="less">
.tm-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
