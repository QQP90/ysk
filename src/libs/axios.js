import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
import configData from '@/config'


const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
    console.log('baseURL',this.baseUrl)
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {

    // 请求拦截
    instance.interceptors.request.use(config => {
      instance.credentials=true;
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if(res.data&&res.data.code === 401){ //未登录或者登录过期
        window.location=(process.env.NODE_ENV === 'development')?configData.uidUrl.dev:configData.uidUrl.pro;
      }
      this.destroy(url)
      const { data, status } = res;
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response;
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      console.log('errorInfo', errorInfo);
      this.$Notice.error({
          title: `请求失败：${status}`,
          desc: statusText,
          duration: 0
      });
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
