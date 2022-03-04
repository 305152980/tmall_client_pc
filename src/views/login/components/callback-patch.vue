<template>
  <vee-form ref="veeFormRef" :validation-schema="mySchema" v-slot="{errors}" class="tm-form" autocomplete="off">
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <field :class="{ err: errors.account }" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <field :class="{ err:errors.code }" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="send()" class="code">
          {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <field :class="{ err: errors.password }" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>
    <div class="tm-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <field :class="{ err: errors.rePassword }" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
  </vee-form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { Form as VeeForm, Field } from 'vee-validate'
export default {
  name: 'CallbackPatch',
  components: { VeeForm, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 表单数据对象。
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })

    // 表单校验规则。
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

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
            await userQQPatchCode(form.mobile)
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

    // 提交完善的用户信息。
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await veeFormRef.value.validate()
      if (valid) {
        userQQPatchLogin({ unionId: props.unionId, ...form })
          .then(data => {
            // 存储用户信息。
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            store.dispatch('cart/mergeCart').then(() => {
              // 跳转到来源页或者首页。
              router.push(store.state.user.redirectUrl)
              // 成功消息提示。
              Message({ type: 'success', text: '完善用户信息成功' })
            })
          })
          .catch(e => {
            // 失败消息提示。
            Message({ type: 'error', text: '完善用户信息失败' })
          })
      }
    }

    return { form, mySchema, veeFormRef, time, send, submit }
  }
}
</script>

<style scoped lang='less'>
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
