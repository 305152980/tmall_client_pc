<script>
import { h } from 'vue'
export default {
  name: 'TmBread',
  render () {
    // 用法
    // 1. template 标签去除，单文件组件；
    // 2. h 函数的返回值就是组件内容；
    // 3. vue2.0 的 h 函数是传参进来的，vue3.0 的 h 函数是导入进来；
    // 4. h 函数第一个参数：标签名字；第二个参数：标签属性对象；第三个参数：子节点。
    // 需求
    // 1. 创建 tm-bread 父容器；
    // 2. 获取 tm-bread 默认插槽的内容；
    // 3. 去除 tm-bread-item 组件的 i 标签，交由 render 函数来组织；
    // 4. 遍历 tm-bread 插槽数组，最后一个 item 不加 i 标签；
    // 5. 把处理后的的节点数组渲染到 tm-bread 标签中。
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < items.length - 1) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'tm-bread' }, dymanicItems)
  }
}
</script>

<style lang='less'>
// 去除 scoped 属性，目的：让样式作用到 tm-bread-item 组件。
.tm-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @tmColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
