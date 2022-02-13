// 提供商品相关的 API 函数
import request from '@/utils/request'

/**
 * 获取商品详情
 * @param { String } id - 商品 ID
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取相关推荐商品 | 猜你喜欢商品
 * @param { String } id - 商品ID，传入相关推荐，不传猜你喜欢
 * @param { Integer } limit - 商品数量
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 查询商品评价信息
 * @param { String } id - 商品ID
 * @returns
 */
export const findGoodsCommentInfo = (id) => {
  // axios 遇见 http https 开头的地址，不会加上基准地址。
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    'get'
  )
}

/**
 * 查询商品评价列表
 * @param { String } id - 商品ID
 * @param { Object } params - 商品ID
 * @returns
 */
export const findGoodsCommentList = (id, params) => {
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    'get',
    params
  )
}

/**
 * 获取热销榜数据
 * @param { String } id - 商品ID
 * @param { Integer } limit - 商品数量
 * @param { Integer } type - 热销类型，1 为24小时榜，2 为周榜，3 为总榜，默认为 1。
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}
