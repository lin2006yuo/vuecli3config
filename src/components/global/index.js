import Vue from 'vue'

const componentContext = require.context('../global', true, /\.js$/)

componentContext.keys().forEach(component => {
  if (component.startsWith('./index')) {
    return
  }
  const componentModule = componentContext(component)
  const ctrl = componentModule.default || componentModule
  console.log('全局注册组件', { ctrl, componentModule })
  Vue.component(ctrl.name, ctrl)
})

export default null
