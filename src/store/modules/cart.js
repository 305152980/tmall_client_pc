// 购物车模块。

import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表。
      list: []
    }
  },
  // vuex 的计算属性。
  getters: {
    // 有效商品列表。
    validList (state) {
      // 有效商品：库存大于 0，商品有效标识为 true。
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品总件数。
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额。
    validAmount (state, getters) {
      // return (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100).toFixed(2)
      // 涉及到价格计算的时候，首先用 Math.round(c.nowPrice * 100) 将价格误差给处理掉。
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表。
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    // 已选商品列表。
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数。
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额。
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选购物车中有效商品。
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    // 单个加入购物车商品。
    insertCart (state, goods) {
      // 约定加入购物车的商品字段必须和后端保持一致。
      // 它们是：id：spuId skuId name attrsText picture price nowPrice selected stock count isEffective：是否为有效商品。
      // 插入商品数据的规则：
      // 1、先确认一下是否有相同的商品；
      // 2、如果有相同的商品，查询它的数量，累加到 goods 上，再保存到最新位置，原来商品需要删除；
      // 3、如果没有相同商品，保存到最新位置即可。
      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      // sameIndex === -1 时为没找到。
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        goods.count += count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // 单个修改购物车商品。
    updateCart (state, goods) {
      // goods 商品信息：nowPrice stock isEffective ...
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才进行修改。
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 单个删除购物车商品。
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 批量设置购物车商品。
    setCart (state, goodsList) {
      // goodsList 空数组为清空购物车。
      state.list = goodsList
    }
  },
  actions: {
    // 获取购物车商品列表。
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          // 同时发送请求（有几个商品发送几个请求），等所有请求成功后，一起去修改本地数据。
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.all(promise 数组).then((promiseArrList) => {})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.race(promise 数组).then((data)=>{}) 同时发请求，最快的请求成功，得到最快的成功结果。
          // promise 数组：promiseArr。
          const promiseArr = ctx.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })
          // promiseArrList 是成功结果的集合，数据顺序和 promiseArr 顺序一致，promiseArr 是根据 state.list 得来的。
          Promise.all(promiseArr).then(promiseArrList => {
            // 更新本地购物车列表信息。
            promiseArrList.forEach((item, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...item.result })
            })
            resolve()
          })
        }
      })
    },
    // 单个加入购物车商品。
    // ctx：执行上下文。
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          insertCart({ skuId: goods.skuId, count: goods.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 单个修改购物车商品。
    updateCart (ctx, goods) {
      // goods：必需要有 skuId  可能有 selected count。
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          updateCart(goods).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },
    // 单个删除购物车商品。
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          deleteCart([skuId]).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 购物车商品全选按钮事件
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除选中商品 | 清空失效商品。
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          // 找出对应条件的商品列表，遍历调用删除的 mutations。
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 批量删除购物车商品。(提交订单时使用)
    batchDeleteCart_c (ctx, skuIdArray) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          deleteCart(skuIdArray).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        }
      })
    },
    // 修改购物车商品的规格信息。
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 用户已登录。
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 用户未登录。
          // 1、找出旧的商品数据；
          // 2、根据新的 sku 数据和旧的 sku 数据，合并成一条新的购物车商品数据；
          // 3、删除旧的商品数据；
          // 4、添加新的商品数据。
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          // 后面的字段会覆盖前面的同名字段。
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('deleteCart', oldSkuId)
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车商品数据。
    async mergeCart (ctx) {
      // 准备合并的参数
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功后，清空本地购物车商品数据。
      ctx.commit('setCart', [])
    }
  }
}
