import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { setToken, getToken, getAppId } from '@/utils/auth'
import { PREFIX, IS_SEND_LOG, APP_ID, NEW_PREFIX } from '@/config/app'
import sendLog from '@/utils/sendLog'
import qs from 'qs'
import md5 from '@/utils/md5'

// 创建axios实例
const service = axios.create({
  baseURL: PREFIX, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 临时mock数据用
  // if (config.url.indexOf('/mock/') > -1) {
  //   config.baseURL = ''
  // }
  if (config.type !== 'payload') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    config.data = qs.stringify(config.data)
  }
  // 如果指定prefix 则覆盖baseUrl
  if (config.prefix) {
    config.baseURL = config.prefix
  }
  if (config.baseURL.indexOf('gateway') > -1) { // 新网关
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    config.headers['x-version'] = '1.1'
    config.headers['x-token'] = getToken()
    config.headers['x-app-id'] = APP_ID
    config.headers['x-timestamps'] = new Date().getTime()
    if (config.module) {
      config.headers['x-module'] = config.module
    } else {
      config.headers['x-module'] = 'buss'
    }
  } else {
    config.headers['x-incar-request-uri'] = config.uri
    // config.headers['x-incar-request-moudle'] = config.prefix ? 'oms' : 'buss'
    config.headers['x-incar-request-moudle'] = config.baseURL.indexOf('buss') > -1 ? 'buss' : 'oms'
    config.headers['x-incar-app-id'] = APP_ID
    if (config.logId) {
      config.headers['x-operate-id'] = config.logId
    }
    if (getToken()) {
      config.headers['x-incar-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
  }
  // 参数滤空
  let data = config.data.split('&')
  let newArr = []
  for (let i of data) {
    const param = i.split('=')
    if (param[1]) {
      newArr.push(i)
    }
  }
  /*
    java大部分接口 需要时间戳 签名 此处统一处理
    例request({
      url: '/activity/coupon/list',
      method: 'post',
      data: params,
      sign: true 标记参数 此项为true时追加参数
    }, _event)
  */
  if (config.sign) {
    newArr.push(`timestamp=${new Date().getTime().toString().slice(0,-3)}`)
    newArr.push(`sign=${md5('incar' + new Date().getTime().toString().slice(0,-3))}`)
  }
  config.data = newArr.join('&')
  if (config.args) {
    config.data = config.args
    
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code && res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // if (res.code === 401 || res.code === 402) {
      //   store.dispatch('FedLogOut').then(() => {
      //     location.reload()// 为了重新实例化vue-router对象 避免bug
      //   })
      // }
      return Promise.reject('error')
    } else if (res.status && res.status === 20) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
      return Promise.reject('error')
    } else {
      if (response.config.uri === '/login/login' && response.headers['x-incar-token']) {
        store.commit('SET_TOKEN', response.headers['x-incar-token'])
        setToken(response.headers['x-incar-token'])
      }
      return Promise.resolve(response.data.data ? response.data.data : response.data)
    }
  },
  error => {
    console.log(error)
    // console.log('catch Error >>> ', error, '\nError url >>>', error.config.url)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

const request = async (args, _event) => {
  if (IS_SEND_LOG) { // 是否收集log
    let res = await sendLog(args.url, args.data, _event)
    args['logId'] = res.id
  }
  args['uri'] = args.url
  return service(args)
}

export default request
