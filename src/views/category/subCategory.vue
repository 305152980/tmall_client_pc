<template>
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑 -->
      <tm-bread>
        <tm-bread-item to="/">首页</tm-bread-item>
        <tm-bread-item v-if="category.top" :to="`/category/${ category.top.id }`">{{ category.top.name }}</tm-bread-item>
        <Transition name="fade-right" mode="out-in">
          <tm-bread-item :key="category.sub.id" v-if="category.sub">{{ category.sub.name }}</tm-bread-item>
        </Transition>
      </tm-bread>
      <!-- 筛选区 -->
      <sub-category-filter @filter-change="filterChange" />
      <!-- 商品面板（排序 + 列表） -->
      <div class="category-goods-list">
        <sub-category-sort :key="$route.params.id" @sort-change="sortChange" />
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <category-goods-item :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <tm-infinite-loading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import SubCategoryFilter from './components/sub-category-filter'
import SubCategorySort from './components/sub-category-sort'
import CategoryGoodsItem from './components/category-goods-item'
export default {
  name: 'SubCategory',
  components: { SubCategoryFilter, SubCategorySort, CategoryGoodsItem },
  setup () {
    // 通过计算属性从 vuex 获取顶级和二级商品类目信息。
    // category 数据对象：{ top: { id, name }, sub: { id: name } }
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })

    // 是否加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      // 设置二级分类的 ID。
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 获取数据成功。
        if (result.items.length) {
          // 有数据就追加数据
          goodsList.value.push(...result.items)
          // 把 page 改成下一页页码。
          reqParams.page++
        } else {
          // 没有数据，代表加载完成。
          finished.value = true
        }
        loading.value = false
      })
    }

    // 更改筛选组件的筛选数据，重新请求。
    const filterChange = filterParams => {
      finished.value = false
      // 合并请求参数，保留之前参数。
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }

    // 更改排序组件的筛选数据，重新请求。
    const sortChange = sortParams => {
      finished.value = false
      // 合并请求参数，保留之前参数。
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }

    // 更改了二级分类的时候需要重新加载数据。
    watch(
      () => route.params.id,
      newVal => {
        if (newVal && `/category/subCategory/${newVal}` === route.path) {
          finished.value = false
          goodsList.value = []
          reqParams = {
            page: 1,
            pageSize: 20
          }
        }
      }
    )

    return { category, getData, filterChange, sortChange, loading, finished, goodsList }
  }
}
</script>

<style scoped lang="less">
.category-goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
