<template>
  <div class="tm-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'TmCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // v-model  <==>  :modelValue  +   @update:modelValue

    // 使用 useVModel 实现双向数据绑定 v-model 指令。
    // 1、使用 props 接收 modelValue；
    // 2、使用 useVModel 来包装 props 中的 modelValue 属性数据；
    // 3、使用 checked.value 就是使用父组件的数据；
    // 4、使用 checked.value = '数据' 赋值，会触发 emit('update:modelvalue', '数据')。
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      // 通知父组件。
      checked.value = !checked.value
      // 让组件支持 change 事件。
      emit('change', !checked.value)
    }
    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.tm-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @tmColor;
    ~ span {
      color: @tmColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
