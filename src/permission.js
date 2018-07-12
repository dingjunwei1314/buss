import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth' // 验权

const auth = (roles, next, to) => {
    let menuCodes = []
    let funcCodes = []
    roles.map((item) => {
        if (item.type === '1' || item.type === '2') {
            menuCodes.push(item.menu_id)
        } else if (item.type === '3') {
            funcCodes.push(item.perm_id)
        }
    })
    menuCodes = Array.from(new Set(menuCodes))
    funcCodes = Array.from(new Set(funcCodes))
    store.dispatch('SetFunc', funcCodes)
    store.dispatch('GenerateRoutes', menuCodes).then(() => { // 生成可访问的路由表
        if (store.getters.addRouters) {
            router.options.routes = store.getters.addRouters
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next(to) // hack方法 确保addRoutes已完成
        } else {
            Message.error('您没有相应权限,请切换账号或联系管理员！')
        }
    })
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            // store 里没有权限缓存
            if (store.getters.menuRoles && store.getters.menuRoles.length === 0) {
                store.dispatch('GetInfo').then(res => { // 拉取用户信息
                    const roles = res
                    if (!roles || roles.length === 0) { // 没有任何权限
                        Message.error('您没有相应权限,请切换账号或联系管理员！')
                        removeToken()
                        next({ path: '/login' })
                    }
                    // 鉴权
                    auth(roles, next, to)
                }).catch(() => {
                    store.dispatch('FedLogOut').then(() => {
                        Message.error('验证失败,请重新登录')
                        next({ path: '/login' })
                    })
                })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})