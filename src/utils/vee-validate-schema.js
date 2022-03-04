// 给 vee-validate 提供校验规则的函数。

import { userAccountCheck } from '@/api/user'

export default {
  // 用户名格式校验。
  account (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 用户名格式和唯一性校验。
  async accountApi (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  // 密码格式校验。
  password (value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    return true
  },
  // 第二次密码的校验。
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    if (value !== form.password) return '需要和密码保持一致'
    return true
  },
  // 手机号格式校验。
  mobile (value) {
    if (!value) return '请输入手机号'
    // 规则：1 开头，3 - 9 之间，9 个数字。
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不对'
    return true
  },
  // 短信验证码格式校验。
  code (value) {
    if (!value) return '请输入短信验证码'
    if (!/^\d{6}$/.test(value)) return '短信验证码6个数字'
    return true
  },
  // 勾选用户协议的校验。
  isAgree (value) {
    if (!value) return '请勾选登录协议'
    return true
  }
}
