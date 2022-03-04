import Mock from 'mockjs'
import qs from 'qs'

// 基本配置。
Mock.setup({
  // 随机延时 200-300 毫秒，模拟网络延时。
  timeout: '200-300'
})

// 拦截接口 我的收藏。
// 1、接口地址 正则匹配规则；
// 2、请求方式；
// 3、返回数据（函数返回数据）。
Mock.mock(/\/member\/collect/, 'get', config => {
  // console.log(config)
  // {
  //   body: null,
  //   type: 'GET',
  //   url: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/member/collect?page=1&pageSize=4&collectType=1'
  // }
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10, 20)',
      desc: '@ctitle(4, 10)',
      price: '@float(100, 200, 2, 2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1, 8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
