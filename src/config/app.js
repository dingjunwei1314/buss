// 项目公用配置项文件
// 全局常量
const win = window
const loc = win.location
const port = loc.port
const host = loc.host
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'

// 初始变量
let APP_IS_LOCAL = false
let PREFIX = 'https://buss-api.mydadao.com'
let NEW_PREFIX = 'https://gateway-inner.mydadao.com'
let SUB_PREFIX = 'https://incar.mydadao.com/oms'
let PIC_URL = APP_ENV === 'pro' ? '//online-incar.bj.bcebos.com/' : '//testincar.bj.bcebos.com/'
let APP_TOKEN_KEY = 'Token'
let USER_ID_KEY = 'userid'
let APP_ID = 'c3f72c84cbfd492c97bf1e33bd09166c'

// 顶级域名
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// 是否收集log
let IS_SEND_LOG = false

const SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV

if (SUFFIX) { // 开发或测试
    PREFIX = 'https://buss-api' + '-' + SUFFIX + '.mydadao.com'
    NEW_PREFIX = 'https://gateway-inner'+ '-' + SUFFIX +'.mydadao.com'
    // SUB_PREFIX = 'https://incar' + '-' + SUFFIX + '.mydadao.com/oms'
    SUB_PREFIX = 'http://192.168.2.111:8088' // 郭峰本机
        // IS_SEND_LOG = false
}

// for env
if (port) {
    APP_IS_LOCAL = true
}

export { APP_IS_LOCAL, TOP_LEVEL_HOST, APP_ENV, PREFIX, SUB_PREFIX, APP_TOKEN_KEY, APP_ID, USER_ID_KEY, IS_SEND_LOG, PIC_URL, NEW_PREFIX }
