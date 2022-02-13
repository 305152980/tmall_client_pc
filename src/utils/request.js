// 1. 创建一个新的 axios 实例；
// 2. 请求拦截器：如果有 token 进行头部携带；
// 3. 响应拦截器：1. 剥离无效数据；2. 处理 token 失效；
// 4. 导出一个函数，调用当前的 axsio 实例发请求，返回值 promise。

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址。原因：其他不是通过 axios 发请求的地方也可能会用上基准地址。
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios 的一些配置
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    // 1. 获取用户信息对象。
    const { profile } = store.state.user
    // 2. 判断是否有 token。
    if (profile.token) {
      // 3. 设置 token 到请求头。
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // 未登录 401 状态码，进入该函数。
    if (err.response && err.response.status === 401) {
      // 1. 清空无效/过期的用户信息。
      // 2. 路由跳转到登录页。
      // 3. 传参（当前路由地址）给登录页。
      store.commit('user/setUser', {})
      // 当前路由地址
      // 组件里头：'/user?a=10'  $route.path === /user  $route.fullPath === /user?a=10
      // js 模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 就是组件中的 $route。
      //    因为在 vue-next 中 router.currentRoute 是被 ref 包装过的响应式数据，所以取值时需要加上 .value。
      // encodeURIComponent 转换 uri 编码，防止解析地址出问题。
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
// submitData 参数对象
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // 1. 如果是 get 请求，需要使用 params 来传递 submitData；    自定转换为 ?a=10&c=10
    // 2. 如果不是 get 请求，需要使用 data 来传递 submitData。    自定转换为请求体参数
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
