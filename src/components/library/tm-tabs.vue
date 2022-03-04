<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'TmTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 接受 tm-tabs 的 v-model 值。
    const activeName = useVModel(props, 'modelValue', emit)

    provide('activeName', activeName)

    // 点击选项卡触发的函数。
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }

    return { activeName, tabClick }
  },
  render () {
    // 获取 tm-tabs 的默认插槽内容。
    const panels = this.$slots.default()

    // 内容区域模板。
    const dynamicPanels = []

    panels.forEach(item => {
      if (item.type.name === 'TmTabsPanel') {
        // 正常静态渲染的 tm-tabs-panel 组件。
        dynamicPanels.push(item)
      } else {
        // v-for 动态渲染的 tm-tabs-panel 组件。
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })

    // 选项卡区域模板。
    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">
              {item.props.label}
            </a>
          )
        })}
      </nav>
    )

    // return <div class="tm-tabs">{[nav, [<div>内容1</div>, <div>内容2</div>, [<div>内容3</div>, <div>内容4</div>]]]}</div>
    return <div class="tm-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style scoped lang="less">
.tm-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @tmColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
