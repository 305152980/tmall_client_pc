// 个人中心相关的 API 函数。

import request from '@/utils/request'

/**
 * 获取我的收藏分页数据。
 * @param { Integer } collectType - 收藏类型：1 为商品，2 为专题，3 为品牌。
 * @returns
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
