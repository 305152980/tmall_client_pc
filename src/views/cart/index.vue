<template>
  <div class="tm-cart-page">
    <div class="container">
      <tm-bread>
        <tm-bread-item to="/">首页</tm-bread-item>
        <tm-bread-item>购物车</tm-bread-item>
      </tm-bread>
      <div class="cart">
        <table>
          <!-- 购物车头部 -->
          <thead>
            <tr>
              <th width="120px">
                <tm-checkbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</tm-checkbox>
              </th>
              <th width="400px">商品信息</th>
              <th width="220px">单价</th>
              <th width="180px">数量</th>
              <th width="180px">小计</th>
              <th width="140px">操作</th>
            </tr>
          </thead>
          <!-- 有效商品列表 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <cart-none />
              </td>
            </tr>
            <tr v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
              <td>
                <tm-checkbox @change="value => checkOne(goods.skuId, value)" :modelValue="goods.selected" />
              </td>
              <td>
                <div class="goods">
                  <router-link :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt="">
                  </router-link>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <!-- 选择规格组件 -->
                    <cart-sku @change="value => updateCartSku(goods.skuId, value)" :skuId="goods.skuId" :attrsText="goods.attrsText" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.price - goods.nowPrice > 0">
                  比加入时降价 <span class="red">&yen;{{ goods.price - goods.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <tm-numbox @change="value => updateCount(goods.skuId, value)" :max="goods.stock" :modelValue="goods.count" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ Math.round(goods.nowPrice * 100) * goods.count / 100 }}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品列表 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="goods in $store.getters['cart/invalidList']" :key="goods.skuId">
              <td>
                <tm-checkbox style="color:#eee;" />
              </td>
              <td>
                <div class="goods">
                  <router-link :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt="">
                  </router-link>
                  <div>
                    <p class="name ellipsis">{{ goods.name }}</p>
                    <p class="attr">{{ goods.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
              </td>
              <td class="tc">{{ goods.count }}</td>
              <td class="tc">
                <p>&yen;{{ Math.round( goods.nowPrice * 100) * goods.count / 100 }}</p>
              </td>
              <td class="tc">
                <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 购物车操作栏 -->
      <div class="action">
        <div class="batch">
          <tm-checkbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</tm-checkbox>
          <a @click="batchDeleteCart()" href="javascript:;">批量删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validTotal'] }} 件商品，已选择 {{ $store.getters['cart/selectedTotal'] }} 件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedAmount' ]}}</span>
          <tm-button @click="checkout()" type="primary">下单结算</tm-button>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <good-relevant />
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
import CartNone from './components/cart-none'
import CartSku from './components/cart-sku'
import GoodRelevant from '@/views/goods/components/goods-relevant'
export default {
  name: 'TmCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()

    // 单选商品按钮事件。
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected: selected })
    }

    // 全选商品按钮事件。
    const checkAll = selected => {
      store.dispatch('cart/checkAllCart', selected)
    }

    // 单个删除购物车商品。
    const deleteCart = skuId => {
      Confirm({ text: '亲，您是否确认删除该商品？' })
        .then(() => {
          store.dispatch('cart/deleteCart', skuId)
        })
        .catch(e => {})
    }

    // 批量删除选中商品 | 清空失效商品。
    const batchDeleteCart = isClear => {
      Confirm({ text: `亲，您是否确认删除${isClear ? '失效' : '选中'}的商品？` })
        .then(() => {
          store.dispatch('cart/batchDeleteCart', isClear)
        })
        .catch(e => {})
    }

    // 修改有效商品的数量。
    const updateCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }

    // 修改购物车商品的规格信息。
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }

    // 结算购物车选中商品。
    const router = useRouter()
    const checkout = () => {
      // 无有效商品。
      if (store.getters['cart/selectedList'].length === 0) {
        return Message({ text: '请至少选中一件有效商品' })
      }
      // 用户已登录。
      if (store.state.user.profile.token) {
        return router.push('/member/checkout')
      }
      // 用户未登录。
      Confirm({ text: '下单结算需要登录，确认现在去登录吗？' })
        .then(() => {
          router.push('/member/checkout')
        })
        .catch(e => {})
    }

    return { checkOne, checkAll, deleteCart, batchDeleteCart, updateCount, updateCartSku, checkout }
  }
}
</script>

<style scoped lang="less">
.tc {
  text-align: center;
  .tm-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @tmColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .tm-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.tm-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
