<template>
  <login-header>联合登录</login-header>
  <section class="container" v-if="isBind">
    <div class="bind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount = true" :class="{ active: hasAccount }" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有天猫商城账号，请绑定手机。</span>
      </a>
      <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有天猫商城账号，请完善资料。</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <callback-bind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <callback-patch :unionId="unionId" />
    </div>
  </section>
  <login-footer />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { userQQLogin } from '@/api/user'
import QC from 'qc'
import Message from '@/components/library/Message'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const hasAccount = ref(true)

    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 确保 QQ 已经登录。
    if (QC.Login.check()) {
      // 通过 QQ API 获取的 openId 是后台需要的 unionId 字段，openId 是第三方 QQ 的唯一标识，我们需要用它去进行登录。
      QC.Login.getMe(openId => {
        unionId.value = openId
        // 请求天猫商城后台，进行 QQ 方式的登录。
        // 默认登录成功： QQ 已经和天猫商城绑定。
        userQQLogin(openId)
          .then(data => {
            // 存储用户信息。
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            store.dispatch('cart/mergeCart').then(() => {
              // 跳转到来源页或者首页。
              router.push(store.state.user.redirectUrl)
              // 登录成功提示。
              Message({ type: 'success', text: 'QQ登录成功' })
            })
          })
          .catch(e => {
            // 登录失败： QQ 没有和天猫商城绑定。
            isBind.value = false
          })
      })
    }

    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .bind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @tmColor;
      border-color: @tmColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
