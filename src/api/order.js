import request from '@/utils/request'
import { PREFIX } from '@/config/app'

export function getOrderList(params) {
    const _event = {
        action: 'pull',
        comment: `获取订单列表`
    }
    return request({
        url: '/order/orders-list',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getExceptionOrderList(params) {
    const _event = {
        action: 'pull',
        comment: `获取异常状态的订单`
    }
    return request({
        url: '/order/exception-order-list',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getExceptionOrderDetail(params) {
    const _event = {
        action: 'pull',
        comment: `获取异常订单详情`
    }
    return request({
        url: '/order/exception-order-detail',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.104:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getOrderDetail(params) {
    const _event = {
        action: 'pull',
        comment: `获取订单详情`
    }
    return request({
        url: '/order/order-detail',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getCarInfo(params) {
    const _event = {
        action: 'pull',
        comment: `查询车辆信息`
    }
    return request({
        url: '/car/car-info',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getCarInfoByIds(params) {
    const _event = {
        action: 'pull',
        comment: `查询车辆信息`
    }
    return request({
        url: '/car/getCarInfoByCarIds',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function lockCar(params) {
    const _event = {
        action: 'pull',
        comment: `异常状态-车 >>> 锁车门`
    }
    return request({
        url: '/order/exception-close-car-door',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
    }, _event)
}

export function unlockCar(params) {
    const _event = {
        action: 'pull',
        comment: `异常状态-车 >>> 开门`
    }
    return request({
        url: '/order/exception-open-car-door',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
    }, _event)
}



export function returnCar(params) {
    const _event = {
        action: 'pull',
        comment: `异常状态-车 >> 还车`
    }
    return request({
        url: '/order/exception-order-car-return',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
    }, _event)
}

export function finishExceptionOrder(params) {
    const _event = {
        action: 'pull',
        comment: `异常状态-订单 >>> 完成`
    }
    return request({
        url: '/order/exception-order-complete',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
    }, _event)
}

export function switchToException(params) {
    const _event = {
        action: 'pull',
        comment: `正常-订单 >>> 转入异常状态`
    }
    return request({
        url: '/order/switch-to-exception',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function resetCancelTime(params) {
    const _event = {
        action: 'pull',
        comment: `取消订单次数 >>> 重置`
    }
    return request({
        url: '/order/clear-count',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getUserInfo(params) {
    const _event = {
        action: 'pull',
        comment: `获取用户信息`
    }
    return request({
        url: '/oms/user/searchDetail',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.111:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function getOrderBillDetail(params) {
    const _event = {
        action: 'pull',
        comment: `获取【详情页】的费用信息`
    }
    return request({
        url: '/order/count-bill',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.182:8080',
        prefix: PREFIX,
    }, _event)
}

export function getUserInfoCommon(params) {
    const _event = {
        action: 'pull',
        comment: `获取用户信息`
    }
    return request({
        url: '/oms/user/searchUser',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.111:8080',
        prefix: PREFIX,
        // sign: true
    }, _event)
}

export function exportOrderList(params) {
    const _event = {
        action: 'pull',
        comment: `【正常】导出列表`
    }
    return request({
        url: '/order/orders-export',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.2.111:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}

export function exportExceptionOrderList(params) {
    const _event = {
        action: 'pull',
        comment: `【异常】导出列表`
    }
    return request({
        url: '/order/exception-order-list-export',
        method: 'post',
        data: params,
        // prefix: 'http://192.168.1.101:8080',
        prefix: PREFIX,
        sign: true
    }, _event)
}
