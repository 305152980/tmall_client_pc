<template>
  <tm-dialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 订单取消原因列表。 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a @click="curText = item" v-for="item in cancelReason" :key="item" href="javascript:;" :class="{ active: curText === item }">
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 操作按钮区域。 -->
    <template #footer>
      <tm-button type="gray" @click="visibleDialog = false" style="margin-right: 20px;">取消</tm-button>
      <tm-button type="primary" @click="submit">确认</tm-button>
    </template>
  </tm-dialog>
</template>

<script>
import { ref } from 'vue'
import { cancelReason } from '@/api/constants'
import { cancelOrder } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'OrderCancel',
  emits: ['getOrderListFn'],
  props: {
    pageFlag: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visibleDialog = ref(false)

    // 当前选中的订单。
    const currOrder = ref(null)

    // 订单取消的原因。
    const curText = ref('')

    // 对话框打开函数。
    const open = order => {
      visibleDialog.value = true
      curText.value = ''
      currOrder.value = order
    }

    // 对话框确认按钮函数。
    const submit = () => {
      if (!curText.value) return Message({ text: '亲，请选择订单取消的原因。' })
      cancelOrder({
        orderId: currOrder.value.id,
        cancelReason: curText.value
      })
        .then(() => {
          Message({ type: 'success', text: '取消订单成功' })
          if (props.pageFlag) {
            currOrder.value.orderState = 6
          } else {
            emit('getOrderListFn')
          }
          visibleDialog.value = false
        })
        .catch(() => {
          Message({ type: 'error', text: '取消订单失败' })
        })
    }

    return { visibleDialog, cancelReason, curText, open, submit }
  }
}
</script>

<style scoped lang="less">
.tm-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @tmColor;
      }
    }
  }
}
</style>
