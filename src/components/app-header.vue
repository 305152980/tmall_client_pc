<template>
  <header class="app-header">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">天猫商城</router-link>
      </h1>
      <!-- 使用头部导航组件 -->
      <app-header-nav />
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>
      <!-- 使用头部购物车组件 -->
      <app-header-cart />
    </div>
  </header>
</template>

<script>
import AppHeaderNav from './app-header-nav'
import AppHeaderCart from './app-header-cart'
export default {
  name: 'AppHeader',
  components: { AppHeaderNav, AppHeaderCart }
}
</script>

<style scoped lang='less'>
.app-header {
  background: #fff;
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(../assets/images/logo.png) no-repeat center 18px / contain;
      background-size: 87px 53px;
      // background-size: 125px 76px;
      background-position: center center;
    }
  }
  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
}
</style>
