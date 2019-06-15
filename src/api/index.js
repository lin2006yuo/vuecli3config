import axios from 'axios'
import router from '../router'
import { Message, Loading } from 'element-ui'
const service = axios.create({
  timeout: 60000,
  baseURL: process.env.BASE_URL
})

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 显示loading效果
let loading = null

// 请求拦截
service.interceptors.request.use(config => {
  loading = Loading.service({
    text: '正在加载中....'
  })

  const token = localStorage.getItem('token')
  if(token) {
    config.headers['Authorization'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  if(loading) {
    loading.close()
  }

  const responseCode = response.status
  if(responseCode === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}, error => {
  // 请求超时 或 断网
  if(!error.response) {
    if(error.message.includes('timeout')) {
      console.log('请求超时')
      Message.error('请求超时，请检查网络是否连接正常')
    }
  }

  const responseCode = error.response.status
  switch(responseCode) {
    // 转跳登录页
    case 401:
        router.replace({
          path: '/login',
        })
    // 403: token过期
    case 403:
        Message({
          type: 'error',
          message: ''
        })
    default: 
        Message({
          message: error.response.data.message,
          type: 'error'
        })
  }
  return Promise.reject(error)
})

export default service