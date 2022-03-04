<template>
  <div class="tm-dialog" v-show="visible" :class="{ fade }">
    <div class="wrapper" :class="{ fade }">
      <div class="header">
        <h3>{{ title }}</h3>
        <a @click="closeDialog()" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
// vue3.0 v-model:visible 语法糖，拆解 （:visible + @update:visible）。
// vue2.0 visible.sync 语法糖，拆解 （:visible + @update:visible）。
import { ref, watch } from 'vue'
export default {
  name: 'TmDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const fade = ref(false)

    // visible 的值为 true 时打开对话框，其余就是关闭对话框。
    watch(
      () => props.visible,
      newVal => {
        setTimeout(() => {
          fade.value = newVal
        }, 0)
      },
      { immediate: true }
    )

    // 关闭对话框事件。
    const closeDialog = () => {
      emit('update:visible', false)
    }

    return { fade, closeDialog }
  }
}
</script>

<style scoped lang="less">
.tm-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8887;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    width: 600px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .body {
      max-height: 510px;
      overflow-y: auto;
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: center;
      padding: 10px 0 30px 0;
    }
    .header {
      position: relative;
      height: 70px;
      line-height: 70px;
      padding: 0 20px;
      border-bottom: 1px solid #f5f5f5;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 25px;
        top: 25px;
        font-size: 24px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
