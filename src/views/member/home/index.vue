<template>
  <div class="member-home">
    <!-- 概览 -->
    <member-home-overview />
    <!-- 我的收藏 -->
    <member-home-panel title="我的收藏">
      <category-goods-item v-for="item in collectGoods" :key="item.id" :goods="item" />
    </member-home-panel>
    <!-- 我的足迹 -->
    <member-home-panel title="我的足迹">
      <category-goods-item v-for="i in 4" :key="i + 'index'" :goods="goods" />
    </member-home-panel>
    <!-- 猜你喜欢 -->
    <goods-relevant />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findCollect } from '@/api/member'
import MemberHomeOverview from './components/member-home-overview'
import MemberHomePanel from './components/member-home-panel'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import CategoryGoodsItem from '@/views/category/components/category-goods-item'
export default {
  name: 'MemberHome',
  components: {
    MemberHomeOverview,
    MemberHomePanel,
    GoodsRelevant,
    CategoryGoodsItem
  },
  setup () {
    const goods = {
      id: '1',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
      desc: '清汤鲜香 红汤劲爽',
      price: '159.00'
    }

    // 调用 mock.js 模拟的接口。
    const collectGoods = ref([])
    findCollect({
      page: 1,
      pageSize: 4
    }).then(data => {
      collectGoods.value = data.result.items
    })

    return { goods, collectGoods }
  }
}
</script>

<style scoped lang="less">
:deep(.tm-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.tm-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
