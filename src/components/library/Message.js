// 提供一个能够显示 tm-message 组件的函数。
// 这个函数将来可直接导入使用，也可挂载在 vue 实例的原型上使用。
// 使用方法：
//    导入 import Message from 'Message.js'  使用 Message({ type: 'error', text: '提示文字' })
//    this.$message({ type: 'error', text: '提示文字' })

import { createVNode, render } from 'vue'
import TmMessage from './tm-message.vue'

// 创建一个 DOM 容器。
const div = document.createElement('div')
div.setAttribute('class', 'tm-msssage-container')
document.body.appendChild(div)

// 定时器的标识。
let timer = null

export default ({ type, text }) => {
  // 渲染组件。
  // 1、导入消息提示组件。
  // 2、使用 createVNode(组件, 属性对象（props）) 函数，将消息提示组件编译为虚拟的 DOM 节点。
  const vnode = createVNode(TmMessage, { type, text })
  // 3、准备一个装载消息提示组件的 DOM 容器。
  // 4、使用 render(虚拟节点, DOM 容器) 函数，将虚拟 DOM 节点渲染到此 DOM 容器中。
  render(vnode, div)
  // 5、3s 后销毁组件。
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
