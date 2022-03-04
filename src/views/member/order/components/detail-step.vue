<template>
  <div class="detail-step">
    <tm-steps :active="order.orderState === 6 ? 1 : order.orderState">
      <tm-steps-item title="提交订单" :desc="order.createTime" />
      <tm-steps-item title="付款成功" :desc="order.payTime" />
      <tm-steps-item title="商品发货" :desc="order.consignTime" />
      <tm-steps-item title="确认收货" :desc="order.endTime" />
      <tm-steps-item title="订单完成" :desc="order.evaluationTime" />
    </tm-steps>
  </div>
</template>

<script>
export default {
  name: 'DetailStep',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.detail-step {
  padding: 20px;
}
</style>
