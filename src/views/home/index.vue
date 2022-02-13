<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
    <!-- 最新专题 -->
    <HomeSpecial />
    <!-- 新鲜好物 -->
    <HomeNew />
    <!-- 人气推荐 -->
    <HomeHot />
    <!-- 热门品牌 -->
    <HomeBrand />
    <!-- 商品板块 -->
    <HomeProduct />
  </div>
</template>

<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner'
import HomeSpecial from './components/home-special'
import HomeNew from './components/home-new'
import HomeHot from './components/home-hot'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeSpecial,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct
  }
}
</script>

<style scoped lang="less">
</style>
