import Vue from 'vue'
import Router from 'vue-router'
import { menuCode } from '@/utils/permissionMap'
import { APP_ENV } from '@/config/app'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

const whiteRouterMap = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]

export const constantRouterMap = [{
        path: '/',
        component: Layout,
        redirect: '/home',
        name: 'Home',
        hidden: true,
        meta: { menuId: menuCode.home },
        children: [{
            path: 'home',
            component: () =>
                import ('@/views/home/index')
        }]
    },

    {
        path: '/ticket',
        component: Layout,
        redirect: '/ticket/ticketList',
        name: 'ticket',
        meta: {
            title: '优惠券管理',
            icon: 'coupon',
            menuId: menuCode.couponManage
        },
        children: [{
                path: 'ticketList',
                name: 'ticketList',
                component: () =>
                    import ('@/views/ticket/ticketList/index'),
                meta: { title: '优惠券列表', icon: 'list', menuId: menuCode.couponList }
            },
            {
                path: 'ticketDetail',
                name: 'ticketDetail',
                hidden: true,
                component: () =>
                    import ('@/views/ticket/ticketList/ticketDetail'),
                meta: { title: '优惠券详情' }
            },
            {
                path: 'redeemCode',
                name: 'redeemCode',
                component: () =>
                    import ('@/views/ticket/redeemCode/index'),
                meta: {
                    title: '优惠券兑换码',
                    icon: 'code',
                    menuId: menuCode.couponCode
                }
            },
            {
                path: 'redeemDetail',
                name: 'redeemDetail',
                hidden: true,
                component: () =>
                    import ('@/views/ticket/redeemCode/redeemDetail'),
                meta: { title: '优惠券兑换码详情', icon: 'user' }
            },
            {
                path: 'grantCoupon',
                name: 'grantCoupon',
                component: () =>
                    import ('@/views/ticket/grantCoupon/index'),
                meta: {
                    title: '发放优惠券',
                    icon: 'send',
                    menuId: menuCode.grantCoupon
                }
            },
            {
                path: 'redressCoupon',
                name: 'redressCoupon',
                component: () =>
                    import ('@/views/ticket/redressCoupon/index'),
                meta: {
                    title: '补偿优惠券',
                    icon: 'redress',
                    menuId: menuCode.redressCoupon
                }
            },
            {
                path: 'record',
                name: 'record',
                component: () =>
                    import ('@/views/ticket/couponRecord'),
                meta: {
                    title: '优惠券领取记录',
                    icon: 'record',
                    menuId: menuCode.couponRecord
                }
            }
        ]
    },

    {
        path: '/user',
        component: Layout,
        redirect: '/user/userList',
        name: 'user',
        meta: { title: '用户管理', icon: 'user', menuId: '23' },
        children: [{
                path: 'userList',
                name: 'UserList',
                component: () =>
                    import ('@/views/user/userList'),
                meta: { title: '用户列表', icon: 'user', menuId: '24' }
            },
            // {
            //     path: 'walletList',
            //     name: 'walletList',
            //     component: () =>
            //         import ('@/views/user/userWalletList/walletList'),
            //     meta: { title: '用户钱包列表', icon: 'user' }
            // },
            // {
            //     path: 'consume',
            //     name: 'consume',
            //     hidden: true,
            //     component: () =>
            //         import ('@/views/user/userWalletList/consume'),
            //     meta: { title: '用户钱包消费记录', icon: 'user' }
            // },
            // {
            //     path: 'couponList',
            //     name: 'couponList',
            //     hidden: true,
            //     component: () =>
            //         import ('@/views/user/userWalletList/couponList'),
            //     meta: { title: '用户钱包优惠券清单', icon: 'user' }
            // },
            // {
            //     path: 'reCharge',
            //     name: 'reCharge',
            //     hidden: true,
            //     component: () =>
            //         import ('@/views/user/userWalletList/reCharge'),
            //     meta: { title: '用户钱包充值记录', icon: 'user' }
            // },
            // {
            //     path: 'identityAudit',
            //     name: 'identityAudit',
            //     component: () =>
            //         import ('@/views/user/identityAudit/index'),
            //     meta: { title: '身份认证审核', icon: 'user' }
            // },
            // {
            //     path: 'auditDeatil',
            //     name: 'auditDeatil',
            //     hidden: true,
            //     component: () =>
            //         import ('@/views/user/identityAudit/auditDetail'),
            //     meta: { title: '查看认证详情', icon: 'user' }
            // },
            // {
            //     path: 'bond',
            //     name: 'Bond',
            //     component: () =>
            //         import ('@/views/user/bond'),
            //     meta: { title: '保证金管理', icon: 'user' }
            // },
            {
                path: 'rechargeRecord',
                name: 'rechargeRecord',
                component: () =>
                    import ('@/views/user/rechargeRecord'),
                meta: { title: '充值记录', icon: 'user', menuId: '26' }
            },
            // {
            //     path: 'consumptionRecord',
            //     name: 'consumptionRecord',
            //     component: () =>
            //         import ('@/views/user/consumptionRecord'),
            //     meta: { title: '消费记录', icon: 'user' }
            // },
            {
                path: 'rechargeUser',
                name: 'rechargeUser',
                component: () =>
                    import ('@/views/user/recharge'),
                meta: { title: '为用户充值', icon: 'user', menuId: APP_ENV === 'pro' ? '52' : '25' }
            },  
            {
                path: 'reduction',
                name: 'reduction',
                component: () =>
                    import ('@/views/user/reduction'),
                meta: { title: '余额减额', icon: 'user', menuId: APP_ENV === 'pro' ? '52' : '25' }
            },
            {
                path: 'phoneManagement',
                name: 'phoneManagement',
                component: () =>
                    import ('@/views/user/phoneManagement'),
                meta: { title: '更换用户手机号', icon: 'user', menuId: APP_ENV === 'pro' ? '51' : '28' }
            },
            {
                path: 'walletList/:userId',
                name: 'walletList',
                component: () =>
                    import ('@/views/user/walletList'),
                meta: { title: '用户钱包列表', icon: 'user' },
                hidden: true
            },
            // ,
            // {
            //     path: 'changeAccount',
            //     name: 'changeAccount',
            //     component: () =>
            //         import ('@/views/user/changeAccount'),
            //     meta: { title: '更换用户手机号', icon: 'user' }
            // }
        ]
    },

    {
        path: '/order',
        component: Layout,
        redirect: '/order/index',
        name: 'order',
        meta: { title: '订单管理', icon: 'list', menuId: '19' }, // 这里还要把数据添加到某个文件
        children: [{
                path: 'orderList',
                name: 'orderList',
                component: () =>
                    import ('@/views/order/orderList/index'),
                meta: { title: '订单列表', icon: 'list', menuId: '20' }
            },
            {
                path: 'exceptionOrderList',
                name: 'exceptionOrderList',
                component: () =>
                    import ('@/views/order/exceptionOrderList/index'),
                meta: {
                    title: '异常订单列表',
                    icon: 'list',
                    menuId: '21'
                }
            },
            {
                path: 'resetCancelTimes',
                name: 'resetCancelTimes',
                component: () =>
                    import ('@/views/order/resetCancelTimes/index'),
                meta: {
                    title: '重置取消订单次数',
                    icon: 'list',
                    menuId: '22'
                }
            }
            // modifyReturnCarMemo
            // parkingFeeManage
            // {
            //   path: 'parkingFeeManage',
            //   name: 'parkingFeeManage',
            //   component: () => import('@/views/order/parkingFeeManage/index'),
            //   meta: { title: '停车费管理', icon: 'list', menuId: menuCode.parkingFeeManage }
            // },
        ]
    },

    // {
    //   path: '/permission',
    //   component: Layout,
    //   redirect: '/permission/account',
    //   name: 'permission',
    //   meta: { title: '账号权限管理', icon: 'user', menuId: '99999' },
    //   children: [{
    //     path: 'account',
    //     name: 'account',
    //     component: () => import('@/views/permission/account/index'),
    //     meta: { title: '账号管理', icon: 'user' }
    //   }, {
    //     path: 'role',
    //     name: 'role',
    //     component: () => import('@/views/permission/role/index'),
    //     meta: { title: '角色管理', icon: 'user' }
    //   }]
    // },

    { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
    // hashbang: false,
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: whiteRouterMap
        // routes: whiteRouterMap.concat(constantRouterMap)
})

export default router