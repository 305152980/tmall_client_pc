<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <tm-bread>
        <tm-bread-item to="/">首页</tm-bread-item>
        <Transition name="fade-right" mode="out-in">
          <tm-bread-item :key="topCategory.id">{{ topCategory.name }}</tm-bread-item>
        </Transition>
      </tm-bread>
      <!-- 轮播图 -->
      <tm-carousel auto-play :sliders="sliders" style="height: 500px;" />
      <!-- 全部二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture">
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 各个二级分类的推荐商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <tm-more :path="`/category/subCategory/${ sub.id }`" />
        </div>
        <div class="body">
          <category-goods-item v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import CategoryGoodsItem from './components/category-goods-item'
import { findTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { CategoryGoodsItem },
  setup () {
    // 获取轮播图数据。
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // 从 vuex 中获取 面包屑 + 商品分类的数据。
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      // 根据路由上的 ID 去 vuex 的 category 模块的 list 中，查找当前的分类数据。
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    // 获取各个一级类目下的推荐商品。
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(
      () => route.params.id,
      newVal => {
        if (newVal && `/category/${newVal}` === route.path) getSubList()
      },
      { immediate: true }
    )

    return {
      sliders,
      topCategory,
      subList
    }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      min-height: 160px;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @tmColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .tm-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
