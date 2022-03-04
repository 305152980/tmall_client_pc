// 封装购物车相关的 API 函数。

import request from '@/utils/request'

/**
 * 获取最新的购物车商品信息。
 * @param { String } skuId - SKU 的唯一标识
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
 *  获取商品对应的 sku 数据。
 *  @param { String } skuId - SKU 的唯一标识
 */
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并购物车商品数据。
 * @param { Array<object> } cartList - 购物车商品信息列表
 * @param { String } object.skuId - SKU 的唯一标识
 * @param { Boolean } object.selected - 选中状态
 * @param { Integer } object.count - 数量
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/**
 * 获取购物车列表信息。
 * @returns
 */
export const findCart = () => {
  return request('/member/cart', 'get')
}

/**
 * 单个加入购物车商品。
 * @param { String } skuId - SKU 的唯一标识
 * @param { Integer } count - 加入购物车商品数量
 * @returns
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

/**
 * 修改购物车商品数据。
 * @param { String } skuId - SKU 的唯一标识
 * @param { Integer } count - 商品的数量
 * @param { Boolean } selected - 商品的选中状态
 * @returns
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { selected, count })
}

/**
 * 单个 | 批量删除购物车商品。
 * @param { Array<string> } ids - skuId 的集合
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

/**
 * 购物车商品的全部选中和取消。
 * @param { Boolean } selected - 商品的选中状态
 * @param { Array<string> } ids - skuId 的集合
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
