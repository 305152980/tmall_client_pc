<template>
  <div class="member-order-detail" v-if="order">
    <!-- 订单头部 -->
    <detail-action :order="order" :key="order.orderState" />
    <!-- 订单进度 -->
    <detail-step :order="order" :key="order.orderState" />
    <!-- 物流信息 -->
    <Suspense>
      <template #default>
        <detail-logistics v-if="[3, 4, 5].includes(order.orderState)" :order="order" :key="order.orderState" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 订单信息 -->
    <detail-info :order="order" :key="order.orderState" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { findOrderDetail } from '@/api/order'
import DetailAction from './components/detail-action'
import DetailStep from './components/detail-step'
import DetailLogistics from './components/detail-logistics'
import DetailInfo from './components/detail-info'
export default {
  name: 'MemberDetail',
  components: {
    DetailAction,
    DetailStep,
    DetailLogistics,
    DetailInfo
  },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>

<style scoped lang="less">
.member-order-detail {
  height: 100%;
  background: #fff;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
