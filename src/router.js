import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = []
// 自动注册路由模块
const routesContext = require.context('./routes', true, /\.js$/)
routesContext.keys().forEach(route => {
  const routeModule = routesContext(route)
  routes = [...routes, ...(routeModule.default || routeModule)]
})

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})
