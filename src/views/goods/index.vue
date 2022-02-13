<template>
  <div class='tm-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <tm-bread>
        <tm-bread-item to="/">首页</tm-bread-item>
        <tm-bread-item :to="`/category/${ goods.categories[1].id }`">{{ goods.categories[1].name }}</tm-bread-item>
        <tm-bread-item :to="`/category/subCategory/${ goods.categories[0].id }`">{{ goods.categories[0].name }}</tm-bread-item>
        <Transition name="fade-right" mode="out-in">
          <tm-bread-item>{{ goods.name }}</tm-bread-item>
        </Transition>
      </tm-bread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images="goods.mainPictures" />
          <goods-sales />
        </div>
        <div class="spec">
          <goods-name :goods="goods" />
          <goods-sku :goods="goods" @change="changeSku" />
          <tm-numbox label="数量" v-model="num" :max="goods.inventory" />
          <tm-button @click="insertCart()" type="primary" style="margin-top: 20px;">加入购物车</tm-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <goods-relevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 详情 + 评价 -->
          <goods-tabs />
          <!-- 注意事项 -->
          <goods-warn />
        </div>
        <!-- 24小时热销榜 + 周热销榜 -->
        <div class="goods-aside">
          <goods-hot />
          <goods-hot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch, provide } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsRelevant from './components/goods-relevant'
import GoodsTabs from './components/goods-tabs'
import GoodsWarn from './components/goods-warn'
import GoodsHot from './components/goods-hot'
export default {
  name: 'TmGoodsPage',
  components: { GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsRelevant, GoodsTabs, GoodsWarn, GoodsHot },
  setup () {
    const goods = useGoods()

    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
        num.value = 1
      } else {
        goods.value.inventory = 1
        num.value = 1
      }
      // 记录选择后的 sku，可能有数据，可能没有数据 {}。
      currSku.value = sku
    }

    // 选择的商品数量。
    const num = ref(1)
    // 选中商品的 sku 信息。
    const currSku = ref({})

    // 提供 goods 数据给后代组件使用。
    provide('goods', goods)

    const insertCart = () => {
    }

    return { goods, changeSku, num, insertCart }
  }
}
// 获取商品详情数据。
const useGoods = () => {
  // 路由地址中的商品 ID 发生变化，不会重新初始化组件。
  const goods = ref(null)
  const route = useRoute()
  watch(
    () => route.params.id,
    newVal => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then(data => {
          // 让商品数据为 null，然后使用 v-if 属性，组件可以重新销毁和创建。
          goods.value = null
          nextTick(() => {
            goods.value = data.result
          })
        })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
</style>
