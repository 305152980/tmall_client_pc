<template>
  <div class="member-order">
    <!-- tab 选项卡组件。 -->
    <tm-tabs v-model="activeName" @tab-click="tabClick">
      <tm-tabs-panel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></tm-tabs-panel>
    </tm-tabs>
    <!-- 订单列表。 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <order-item @on-cancel="handlerCancel" @on-delete="handlerDelete" @on-confirm="handlerConfirm" @on-logistics="handlerLogistics" v-for="item in orderList" :key="item.id" :order="item" />
    </div>
    <!-- 分页组件。 -->
    <tm-pagination v-if="total > 0" :current-page="reqParams.page" :page-size="reqParams.pageSize" :total="total" @current-change="page => reqParams.page = page" />
    <!-- 订单取消原因组件。 -->
    <order-cancel ref="orderCancelRef" @get-order-list-fn="getOrderList" />
    <!-- 查看物流组件。 -->
    <order-logistics ref="orderLogisticsRef" />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item'
import OrderCancel from './components/order-cancel'
import OrderLogistics from './components/order-logistics'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup () {
    const activeName = ref('all')

    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)

    // 条件查询参数。
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })

    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams)
        .then(data => {
          orderList.value = data.result.items
          total.value = data.result.counts
          loading.value = false
        })
        .catch(() => {
          orderList.value = []
          total.value = 0
          loading.value = false
        })
    }

    watch(
      reqParams,
      () => {
        getOrderList()
      },
      { deep: true, immediate: true }
    )

    // 点击 tab 选项卡。
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }

    // 删除 [5, 6] 订单。
    const handlerDelete = order => {
      Confirm({ text: '亲，您确认删除该订单吗？' })
        .then(() => {
          deleteOrder(order.id).then(() => {
            Message({ type: 'success', text: '删除订单成功' })
            getOrderList()
          })
        })
        .catch(() => {})
    }

    return { activeName, orderStatus, orderList, tabClick, loading, total, reqParams, handlerDelete, ...useCancel(), ...useConfirm(getOrderList), ...useLogistics(), getOrderList }
  }
}
// 订单取消逻辑。
export const useCancel = () => {
  const orderCancelRef = ref(null)
  const handlerCancel = order => {
    orderCancelRef.value.open(order)
  }
  return { handlerCancel, orderCancelRef }
}
// 确认收货逻辑。
export const useConfirm = getOrderListFn => {
  const handlerConfirm = order => {
    Confirm({ text: '亲，您确认收货吗？确认后货款将打给卖家。' })
      .then(() => {
        confirmOrder(order.id).then(() => {
          Message({ type: 'success', text: '确认收货成功' })
          if (!getOrderListFn) {
            order.orderState = 4
          } else {
            getOrderListFn()
          }
        })
      })
      .catch(() => {})
  }
  return { handlerConfirm }
}
// 查看物流逻辑。
export const useLogistics = () => {
  const orderLogisticsRef = ref(null)
  const handlerLogistics = order => {
    orderLogisticsRef.value.open(order)
  }
  return { handlerLogistics, orderLogisticsRef }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
