<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right>
        <tm-more path="/" />
      </template>
      <!-- 面板内容 -->
      <div ref="target" style="position: relative; height: 426px;">
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <router-link :to="`/product/${ item.id }`">
                <img :src="item.picture" alt="">
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </router-link>
            </li>
          </ul>
          <home-newhot-item-skeleton v-else bg="#f0f9f4" />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomeNewhotItemSkeleton from './home-newhot-item-skeleton'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeNewhotItemSkeleton },
  setup () {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    // return { goods }
    // 1. target 绑定一个监听 DOM 对象。
    // 2. 传入 API 函数，内部获取调用，返回响应式数据。
    const { target, result } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
