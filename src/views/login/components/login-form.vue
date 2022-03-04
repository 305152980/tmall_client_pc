<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <vee-form ref="veeFormRef" class="form" :validation-schema="schema" v-slot="{ errors }" autocomplete="off">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <field :class="{ error: errors.account }" v-model="form.account" name="account" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />
            {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <field :class="{ error: errors.password }" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />
            {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <field :class="{ error: errors.mobile }" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />
            {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <field :class="{ error: errors.code }" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span @click="send()" class="code">
              {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <field as="tm-heckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />
          {{ errors.isAgree }}
        </div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </vee-form>
    <div class="action">
      <!-- 其他窗口打开页面。 -->
      <!-- <span id="qqLoginBtn"></span> -->
      <!-- 在本窗口打开页面。-->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onUnmounted } from 'vue'
import { Form as VeeForm, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: { VeeForm, Field },
  setup () {
    // 是否为短信登录方式。
    const isMsgLogin = ref(false)

    // 表单数据对象。
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // vee-validate 校验基本步骤：
    // 1、导入 VeeForm Field 组件，将 form 和 input 进行替换，需要加上 name 属性用来指定将来的校验规则函数；
    // 2、Field 需要进行数据绑定，字段名称最好和后台接口需要的一致；
    // 3. 定义 Field 的 name 属性指定的校验规则函数，Form 的 validation-schema 属性接受定义好的校验规则对象；
    // 4. 自定义组件如果需要校验必须先支持 v-model 属性，然后 Field 使用 as 指定其组件名称。
    const mySchema = {
      // 校验函数规则：返回 true 就是校验成功，返回一个字符串就是失败，字符串就是错误提示。
      isAgree: schema.isAgree,
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code
    }

    // 监听 isMsgLogin 来重置表单（重置数据 + 清除校验结果）。
    const veeFormRef = ref(null)
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果没有销毁 Field 组件，则之前的校验结果不会被清除。例如：v-show 切换。
      // VeeForm 组件提供了一个 resetForm 函数来清除之前的校验结果。
      veeFormRef.value.resetForm()
    })

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      // VeeForm 组件提供了一个 validate 函数作为整体表单的校验函数，它的返回值是一个 promise。
      const valid = await veeFormRef.value.validate()
      if (valid) {
        try {
          let data = null
          // 1、准备一个 API 做短信登录；
          // 2、调用 API 函数；
          // 3、成功：存储用户信息 + 跳转至来源页或者首页 + 消息提示；
          // 4、失败：消息提示。
          if (isMsgLogin.value) {
            // 短信登录。
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
            // 帐号登录。
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存储用户信息。
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行路由跳转。
            router.push(route.query.redirectUrl || '/')
            // 成功消息提示。
            Message({ type: 'success', text: '登录成功' })
          })
        } catch (e) {
          // 失败消息提示。
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          }
        }
      }
    }

    // 倒计时定时器。
    // pause 暂停 resume 开始。
    // useIntervalFn(回调函数, 执行间隔, 是否立即开启)。
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      { immediate: false }
    )
    onUnmounted(() => {
      pause()
    })

    // 发送验证码。
    // 1、绑定发送验证码按钮点击事件；
    // 2、校验手机号，如果成功才去发送短信（定义 API），并且开启 60s 的倒计时；
    // 3、如果失败，显示失败的校验样式。
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 手机号格式校验通过。
        // 没有倒计时才可以发送短信获取验证码。
        if (time.value === 0) {
          try {
            await userMobileLoginMsg(form.mobile)
            Message({ type: 'success', text: '发送成功' })
            time.value = 60
            resume()
          } catch (e) {
            // 失败消息提示。
            if (e.response.data) {
              Message({ type: 'error', text: e.response.data.message || '获取验证码失败' })
            }
          }
        }
      } else {
        // 手机号格式校验未通过。使用 vee-validate 的错误函数显示错误信息 setFieldError(字段, 错误信息)。
        veeFormRef.value.setFieldError('mobile', valid)
      }
    }

    // // 初始化 QQ 登录按钮。
    // // 1. 准备 <span id="qqLoginBtn"></span>；
    // // 2. QC.Login({ btnId: "qqLoginBtn" })。
    // onMounted(() => {
    //   QC.Login({ btnId: 'qqLoginBtn' })
    // })

    return { isMsgLogin, form, schema: mySchema, veeFormRef, login, send, time }
  }
}
</script>

<style scoped lang="less">
// 账号容器。
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @tmColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @tmColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @tmColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
