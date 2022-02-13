// 定义商品分类相关的 API 接口函数

import request from '@/utils/request'

/**
 * 获取所有商品分类信息（顶级，二级，对应的商品推荐数据。）
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取商品顶级分类信息（children 属性就是各个子商品分类信息）
 * @param { String } id - 顶级类目 ID
 * @returns
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取二级类目的筛选条件数据
 * @param { String } id - 二级类目 ID
 * @returns
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

/**
 * 获取分类下的商品（带筛选条件）
 * @param { Object } params - 可参考接口文档
 */
export const findSubCategoryGoods = (params) => {
  // return request('/category/goods', 'post', params)
  return request('/category/goods/temporary', 'post', params)
}
