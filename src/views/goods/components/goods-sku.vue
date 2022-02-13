<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)" v-if="val.picture" :src="val.picture" :title="val.name">
          <span :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)" v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
// 得到路径字典对象。
const getPathMap = skus => {
  // 1. 得到所有的 sku 集合。props.goods.skus。
  // 2. 从所有的 sku 集合中筛选出有效的 sku 集合。
  // 3. 根据有效的 sku 集合使用 power-set 算法得到其子集的集合。
  // 4. 根据其子集的集合往路径字典对象中存储 key-value。
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 可选值数组。
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组的子集。
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集，往 pathMap 插入数据。
      valueArrPowerSet.forEach(arr => {
        const key = arr.join(spliter)
        // 给 pathMap 设置数据。
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 获取已选中的值的数组。
const getSelectedValues = specs => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象。
    const seletedVal = item.values.find(val => val.selected)
    arr.push(seletedVal ? seletedVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态。
const updateDisabledStatus = (specs, pathMap) => {
  // 1. 约定每一个按钮的状态由本身的 disabled 数据来控制。
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2. 判断当前按钮是否选中，如果是选中则不用判断。
      if (val.selected) return
      // 3. 拿当前按钮的值按照顺序套入选中的值的数组中。
      selectedValues[i] = val.name
      // 4. 剔除 undefined 数据，按照分隔符拼接 key。
      const key = selectedValues.filter(value => value).join(spliter)
      // 5. 拿着 key 去路径字典中查找是否有该数据，如果有则按钮可以点击，如果没有则按钮禁用（true）。
      val.disabled = !pathMap[key]
    })
  })
}
// 初始化默认选中的按钮。
const initDefaultSelected = (goods, skuId) => {
  // 1. 找出默认选中的 sku 的信息。
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 2. 遍历每一个按钮，如果按钮的值和 sku 记录的值相同就选中。
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 得到路径字典对象。
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化：更新按钮禁用状态。
    updateDisabledStatus(props.goods.specs, pathMap)
    // 根据 skuId 初始化选中项。
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // 选中与取消选中。约定每一个按钮都拥有自己的选中状态数据：selected。
    const changeSku = (item, val) => {
      // 当按钮是禁用的，阻止程序运行。
      if (val.disabled) return
      // 当前按钮是可用的，程序正常运行。
      if (val.selected) {
        // 1 如果点击的是已选中，则只需要取消当前的选中。
        val.selected = false
      } else {
        // 2 如果点击的是未选中，则需要把同一个规格的所有按钮全部改成未选中，然后把当前点击按钮的改成选中。
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }

      // 点击按钮时：更新按钮禁用状态。
      updateDisabledStatus(props.goods.specs, pathMap)

      // 将选择的商品 sku 信息通知父组件。{ skuId, price, oldPrice, inventory, specsText }
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(value => value)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 1. 选择完整的 sku 组合按钮，可以拿到这些信息，提交给父组件。
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名1：属性值1 属性名2：属性值2 ...
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // 2. 不是完整的 sku 组合按钮，提交空对象给父组件。
        emit('change', {})
      }
    }

    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @tmColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 10px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      line-height: 40px;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
