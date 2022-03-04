// 订单相关的 API 函数。

import request from '@/utils/request'

/**
 * 添加收货地址。
 * @returns
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

/**
 * 修改收货地址。
 * @returns
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 结算页面-根据购物车选中的商品生成订单。
 * @returns
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 订单列表页 | 订单详情页-根据订单中的商品生成订单-再次购买。
 * @returns
 */
export const repurchaseOrder = (orderId) => {
  return request('/member/order/repurchase/' + orderId, 'get')
}

/**
 * 结算页面-提交订单。
 * @returns
 */
export const submitOrder = (params) => {
  return request('/member/order', 'post', params)
}

/**
 * 支付页面 | 订单详情页-获取订单详情。
 * @param { String } orderId - 订单 ID
 * @returns
 */
export const findOrderDetail = (orderId) => {
  return request('/member/order/' + orderId, 'get')
}

// 将待发货订单状态修改为已发货的接口请求。
// baseURL/member/order/consignment/待发货订单 ID。

/**
 * 我的订单页面-获取订单列表。
 * @param { String } page - 页码
 * @param { String } pageSize - 每页条数
 * @param { String } orderState - 订单状态：1 为待付款、2 为待发货、3 为待收货、4 为待评价、5 为已完成、6 为已取消，未传参数或传 0 参数为全部。
 * @returns
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'get', { page, pageSize, orderState })
}

/**
 * 我的订单页面-删除订单。
 * @param { String } orderId - 订单 ID
 * @returns
 */
export const deleteOrder = (orderId) => {
  return request('/member/order', 'delete', { ids: [orderId] })
}

/**
 * 我的订单页面-取消订单。
 * @param { String } orderId - 订单 ID
 * @param { String } cancelReason - 取消原因
 * @returns
 */
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

/**
 * 我的订单页面-确认收货。
 * @param { String } orderId - 订单 ID
 * @returns
 */
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'put')
}

/**
 * 我的订单页面 | 订单详情页-查询物流信息。
 * @param { String } orderId - 订单 ID
 * @returns
 */
export const logisticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'get')
}
