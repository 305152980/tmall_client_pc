<template>
  <login-header>欢迎登录</login-header>
  <section class="login-section">
    <div class="wrapper">
      <nav>
        <a @click="activeName = 'account'" :class="{ active: activeName === 'account' }" href="javascript:;">账户登录</a>
        <a @click="activeName = 'qrcode'" :class="{ active: activeName === 'qrcode' }" href="javascript:;">扫码登录</a>
      </nav>
      <!-- 帐号登录 & 扫码登录 -->
      <login-form v-if="activeName === 'account'">表单</login-form>
      <div v-if="activeName === 'qrcode'" class="qrcode-box">
        <img src="@/assets/images/qrcode.jpg" alt="">
        <p>打开 <a href="javascript:;">天猫商城App</a> 扫码登录</p>
      </div>
    </div>
  </section>
  <login-footer />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import LoginHeader from './components/login-header'
import LoginForm from './components/login-form'
import LoginFooter from './components/login-footer'
export default {
  name: 'PageLogin',
  components: { LoginHeader, LoginForm, LoginFooter },
  setup () {
    const activeName = ref('account')

    // 存储 QQ 登录后的回跳地址。
    const store = useStore()
    const route = useRoute()
    store.commit('user/setRedirectUrl', route.query.redirectUrl || '/')

    return { activeName }
  }
}
</script>

<style scoped lang="less">
.login-section {
  background: url(../../assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: @tmColor;
          font-weight: bold;
        }
      }
    }
  }
}
// 二维码容器。
.qrcode-box {
  text-align: center;
  padding-top: 40px;
  p {
    margin-top: 20px;
    a {
      color: @tmColor;
      font-size: 16px;
    }
  }
}
</style>
