// 用户相关的接口

import request from '@/utils/request'

/**
 * 帐号密码方式的登录
 * @param { String } account - 帐号
 * @param { String } password - 密码
 * @returns promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 获取手机号方式登录的短信验证码
 * @param { String } mobile - 手机号
 * @returns promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机号方式的登录
 * @param { String } mobile - 手机号
 * @param { String } code - 短信验证码，默认 123456。
 * @returns promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ 号方式的登录
 * @param { String } unionId - QQ 唯一标识，openId。
 * @param { String } source - 客户端类型：1 PC。
 * @returns
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取 QQ 号方式登录绑定手机号时的短信验证码
 * @param { String } mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ 号绑定手机号时的提交方法
 * @param { String } unionId - QQ 唯一标识，openId。
 * @param { String } mobile - 手机号
 * @param { String } code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * QQ 号完善用户信息时校验用户名是否已存在
 * @param {String} account - 帐号
 * @returns promise
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取 QQ 号完善用户信息时的短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ 号完善用户信息时的提交方法
 * @param { String } unionId - QQ 唯一标识，openId。
 * @param { String } mobile - 手机号
 * @param { String } code - 验证码
 * @param { String } account - 帐号
 * @param { String } password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { mobile, code, account, password })
}

// QQ 号和手机号解绑
// http://pcapi-xiaotuxian-front-devtest.itheima.net/login/social/unbind?mobile=17362624015
