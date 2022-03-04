<template>
  <vee-form ref="veeFormRef" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off" class="tm-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来天猫商城，完成绑定后可以使用QQ账号一键登录哦~</p>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <field :class="{ err: errors.code }" v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span @click="send()" class="code">
          {{ time=== 0 ? '发送验证码' : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </vee-form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import { Form as VeeForm, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
export default {
  name: 'CallbackBind',
  components: { VeeForm, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 准备信息：unionId(openId)、QQ 头像、昵称。
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }

    // 表单数据对象。
    const form = reactive({
      mobile: null,
      code: null
    })

    // 校验规则对象。
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

    // 发送短信验证码。
    // pause 暂停 resume 开始。
    // useIntervalFn(回调函数, 执行间隔, 是否立即开启)。
    const veeFormRef = ref(null)
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
            await userQQBindCode(form.mobile)
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

    // 当前 QQ 号绑定手机号。
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await veeFormRef.value.validate()
      if (valid) {
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        })
          .then(data => {
            // 存储用户信息。
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            store.dispatch('cart/mergeCart').then(() => {
              // 跳转到来源页或者首页。
              router.push(store.state.user.redirectUrl)
              // 成功消息提示。
              Message({ type: 'success', text: 'QQ号绑定手机号成功' })
            })
          })
          .catch(e => {
            // 失败消息提示。
            Message({ type: 'error', text: 'QQ号绑定手机号失败' })
          })
      }
    }

    return { nickname, avatar, form, mySchema, send, time, veeFormRef, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
