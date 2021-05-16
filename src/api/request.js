import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from "../router";
import cache from '@/libs/cache'
import { Message } from 'iview'

NProgress.configure({ showSpinner: false }) // NProgress Configuration


const service = axios.create({
  // baseURL: myUrl,
  timeout: 5000
})



// 请求拦截
service.interceptors.request.use(
  config => {
    NProgress.start()
    let token = cache.getStorageExt("token")
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    NProgress.done()
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    NProgress.done()
    return response.data
  },
  error => {
    NProgress.done()
    console.log(error)
    console.log(error.response)
    console.log(error.response.status)
    // 服务器会返回400系列状态码：
    // 400参数错误
    // 401授权错误
    // 403权限不足
    // 404未找到
    let whiteList = ['400', '401', '403', '404']
    // 如果返回的不是400系列错误码
    if (error && error.response && (whiteList.indexOf(error.response.status + '') == -1)) {
      console.log(error.response)
      Message.error({
        content: error.response.status + "：" + error.response.data
      })
      if (router.currentRoute.path != '/login') {
        router.push('/login')
      }
      return
    }
    if (error.response) {
      // if (error.response && error.response.status != 500) {
      if (error.response.status == 401) {
        // if (error.response.status == 401 || error.response.status == 403) {
        cache.clearStorage("token")
        if (router.currentRoute.path != '/login') {
          router.push('/login')
        }
        Message.error({
          content: error.response.status + "：" + error.response.data.message
        })
        // 下面有个return，代表不会继续向下执行
        // 也就是说，如果网络请求报了401，有return，就不会继续执行axios，就不会返回reject
        // return "请求失败，axios执行到这里，直接返回return的数据（不走reject，因此axios错误不会被catch，会被then）"
        return Promise.reject(error.response.data)
      }
      if (error.response.status == 403) {
        Message.error({
          content: error.response.status + "：" + error.response.data.message
        })
        // 如果只return,则会走then且没有值
        // return
        // 如果return后面有值,则会走then且有值
        // return '000'
        // 如果return一个promise.reject,则会走catch
        return Promise.reject(error.response.data)
      }
      if (error.response.status == 400) {
        Message.error({
          content: error.response.status + "：" + error.response.data.message
        })
        return Promise.reject(error.response.data)
      }
    }
    return Promise.reject(error.response.data)
    // return Promise.reject(error)
  }
)

export default service
