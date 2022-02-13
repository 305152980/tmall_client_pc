<template>
  <div class="sub-category-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(item.id)" :class="{ active: item.id === filterData.selectedBrand }" href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{ item.name }}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a @click="changeProp(item, prop.id)" :class="{ active:prop.id === item.selectedProp }" href="javascript:;" v-for="prop in item.properties" :key="prop.id">{{ prop.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-category-filter">
    <tm-skeleton class="item" width="800px" height="40px" />
    <tm-skeleton class="item" width="800px" height="40px" />
    <tm-skeleton class="item" width="600px" height="40px" />
    <tm-skeleton class="item" width="600px" height="40px" />
    <tm-skeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubCategoryFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听商品二级类目 ID 的变化获取筛选数据。
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(
      () => route.params.id,
      newVal => {
        if (newVal && `/category/subCategory/${newVal}` === route.path) {
          filterLoading.value = true
          findSubCategoryFilter(route.params.id).then(data => {
            // 每一组可选的筛选条件缺失 全部 条件。处理数据加上 全部 条件，并且给每一组数据加上一个选中的 ID。
            // 1、品牌
            data.result.selectedBrand = null
            data.result.brands.unshift({ id: null, name: '全部' })
            // 2、属性
            data.result.saleProperties.forEach(item => {
              item.selectedProp = null
              item.properties.unshift({ id: null, name: '全部' })
            })
            filterData.value = data.result
            filterLoading.value = false
          })
        }
      },
      { immediate: true }
    )

    // 获取筛选参数的函数。
    const getFilterParams = () => {
      const filterParamsObj = { brandId: null, attrs: [] }
      // 品牌
      filterParamsObj.brandId = filterData.value.selectedBrand
      // 属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          filterParamsObj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 参考数据：{ brandId: '', attrs: [ { groupName: '', propertyName: '' }, ... ] }
      if (filterParamsObj.attrs.length === 0) filterParamsObj.attrs = null
      return filterParamsObj
    }

    // 记录当前选择的品牌。
    const changeBrand = brandId => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }

    // 记录当前选择的属性。
    const changeProp = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>

<style scoped lang='less'>
.sub-category-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @tmColor;
        }
      }
    }
  }
  .tm-skeleton {
    padding: 10px 0;
  }
}
</style>
