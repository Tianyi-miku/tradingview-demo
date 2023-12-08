
import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 6000, // 请求超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest', // 设置为异步
    'Content-Type': 'application/json;charset=UTF-8'
  }
  // withCredentials: true,
  // crossDomain: true
})
// 异常拦截处理器
const errorHandler = (error: any) => {
  const data = error.response?.data
  if (error.response) {
    if (error.response.status === 403) {
      console.log('403');
    }
    if (error.response.status === 401) {
      console.log('401');
    }
  } else {
    console.log(data);
  }
  return Promise.reject(error)
}

// 请求拦截 request interceptor
request.interceptors.request.use((config: any) => {
  // 不校验登录状态，不拿token，这里假设之后有登录
  const flag: boolean = false
  if (flag) {
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
  }
  return config
}, errorHandler)

// 相应拦截 response interceptor
request.interceptors.response.use((response: any) => {
  if (['501', '500'].includes(response?.data?.code)) {
    console.log('后台服务失败');
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue: any) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}

