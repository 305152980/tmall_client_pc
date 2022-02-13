// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法。注意：没有全局过滤器。
// 这就是插件
// vue2.0 插件写法要素：导出一个对象，有 install 函数，默认传入了 Vue 构造函数，Vue 基础之上扩展。
// vue3.0 插件写法要素：导出一个对象，有 install 函数，默认传入了 app 应用实例，app 基础之上扩展。

// import TmSkeleton from './tm-skeleton.vue'
// import TmCarousel from './tm-carousel.vue'
// import TmMore from './tm-more.vue'
// import TmBread from './tm-bread.vue'
// import TmBreadItem from './tm-bread-item.vue'

import defaultImg from '@/assets/images/200.jpg'

export default {
  install (app) {
    // // 在 app 上进行扩展，app 提供 component directive 函数。
    // // 如果要挂载原型，则需要使用 app.config.globalProperties 方式。
    // app.component(TmSkeleton.name, TmSkeleton)
    // app.component(TmCarousel.name, TmCarousel)
    // app.component(TmMore.name, TmMore)
    // app.component(TmBread.name, TmBread)
    // app.component(TmBreadItem.name, TmBreadItem)

    // 使用 `require` 提供的 `context` 函数，加载某一个目录下所有 `.vue` 后缀的文件。
    // `context` 函数会返回一个导入函数 `importFn`，导入函数的属性 `keys()` 可以获取所有的文件路径。
    // 通过遍历文件路径数组，再使用 `importFn` 函数根据路径导入组件对象。
    // 遍历的同时进行全局注册。

    // context(目录路径，是否加载子目录，加载文件的正则匹配)
    const importFn = require.context('./', false, /\.vue$/)
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      // 进行注册
      app.component(component.name, component)
    })

    // 自定义指令
    defineDirective(app)
  }
}

const defineDirective = (app) => {
  // 1、v-lazy 图片懒加载指令。
  // 原理：先存储图片地址，不能放在 src 上；当图片进入可视区，将存储图片地址设置给图片元素即可。
  app.directive('lazy', {
    // vue2.0 监听使用指令的 DOM 是否创建好的钩子函数：inserted。
    // vue3.0 指令拥有的钩子函数和组件拥有的钩子函数是一样的，监听使用指令的 DOM 是否创建好的钩子函数：mounted。
    mounted (el, binding) {
      // 2、创建一个观察对象，用来观察当前使用指令的元素。
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察者模式。
            observe.unobserve(el)
            // 3、把指令的值设置给 el 的 src 属性。
            // 4、处理 <img> 标签加载事件：error 图片加载失败；load 图片加载成功。
            el.onerror = () => {
              // 加载失败，设置默认图片。
              el.src = defaultImg
            }
            el.src = binding.value
          }
        },
        {
          threshold: 0
        }
      )
      // 开启观察者模式
      observe.observe(el)
    }
  })
}
