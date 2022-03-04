<template>
  <div class="tm-tabs-panel" v-show="name === activeName">
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'TmTabsPanel',
  props: {
    // 选项卡文字。
    label: {
      type: String,
      default: ''
    },
    // 选项卡唯一标识。
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>
