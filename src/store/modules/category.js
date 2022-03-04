// 分类模块

import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合。依赖 topCategory 初始化设置，保证页面渲染不出现白屏。
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  // 修改分类函数
  mutations: {
    // categoryList 所有的分类集合。
    setList (state, categoryList) {
      state.list = categoryList
    },
    // 定义 show 和 hide 函数，控制当前分类二级分类的显示和隐藏。
    show (state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList ({ commit }) {
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据。
      data.result.forEach((top) => {
        top.open = false
      })
      commit('setList', data.result)
    }
  }
}
