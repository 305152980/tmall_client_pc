import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  // 获取原数据
  state: {},
  // 获取在原数据基础上得到的数据
  getters: {},
  // 设置原数据
  mutations: {},
  // 异步操作设置数据，比如说获取请求数据之后设置数据。
  actions: {},
  // vuex 的数据模块化
  modules: {
    cart,
    user,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在 localStorage
    createPersistedState({
      // 本地存储名字
      key: 'tmall-client-pc-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
