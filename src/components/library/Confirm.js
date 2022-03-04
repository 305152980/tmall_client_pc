import { createVNode, render } from 'vue'
import TmConfirm from './tm-confirm.vue'

// 创建一个 DOM 容器。
const div = document.createElement('div')
div.setAttribute('class', 'tm-confirm-container')
document.body.appendChild(div)

// 返回的是 promise 对象。
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 点击取消触发的函数。
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 点击确认触发的函数。
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vn = createVNode(TmConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
