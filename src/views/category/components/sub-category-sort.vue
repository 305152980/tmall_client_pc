<template>
  <div class='sub-category-sort'>
    <div class="sort">
      <a :class="{ active: sortParams.sortField === null }" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{ active: sortParams.sortField === 'publishTime' }" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{ active: sortParams.sortField === 'orderNum' }" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{ active:sortParams.sortField === 'evaluateNum' }" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod === 'asc' }" />
        <i class="arrow down" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod=== 'desc' }" />
      </a>
    </div>
    <div class="check">
      <tm-checkbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</tm-checkbox>
      <tm-checkbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</tm-checkbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'SubCategorySort',
  setup (props, { emit }) {
    // 明确与后台交互的数据。
    const sortParams = reactive({
      inventory: false, // 是否有货
      onlyDiscount: false, // 是否特惠
      sortField: null, // publishTime, orderNum, price, evaluateNum
      sortMethod: null // asc 正序，desc 倒序。
    })
    const changeSort = sortField => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 触发 sort-change 事件。
      emit('sort-change', sortParams)
    }

    const changeCheck = () => {
      // 触发 sort-change 事件。
      emit('sort-change', sortParams)
    }

    return { sortParams, changeSort, changeCheck }
  }
}
</script>

<style scoped lang='less'>
.sub-category-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @tmColor;
        border-color: @tmColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @tmColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @tmColor;
          }
        }
      }
    }
  }
  .check {
    .tm-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
