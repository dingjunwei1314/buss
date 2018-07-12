import request from '@/utils/request'
import { NEW_PREFIX } from '@/config/app'

export function recharge (data) {
  const _event = {
    action: 'push',
    comment: `为用户充值`
  }
  return request({
    url: '/oms/user/rechargeByMobile',
    method: 'post',
    data: data,
    prefix: NEW_PREFIX,
    sign: true,
    args: data,
    module: 'terminal'
  }, _event)
}
export function searchRechargeReason (data) {
  const _event = {
    action: 'pull',
    comment: `获取充值原因列表`
  }
  return request({
    url: '/oms/user/searchRechargeReason',
    method: 'post',
    data: data,
    prefix: NEW_PREFIX,
    sign: true,
    args: data,
    module: 'terminal'
  }, _event)
}
export function searchUserRechargeType (data) {
  const _event = {
    action: 'pull',
    comment: `查询充值类型原因`
  }
  return request({
    url: '/oms/user/searchUserRechargeType',
    method: 'post',
    data: data,
    prefix: NEW_PREFIX,
    sign: true,
    args: data,
    module: 'terminal'
  }, _event)
}
export function searchRechargeRecords (data) {
  const _event = {
    action: 'pull',
    comment: `获取充值列表`
  }
  return request({
    url: '/oms/user/searchRechargeRecords',
    method: 'post',
    data: data,
    prefix: NEW_PREFIX,
    sign: true,
    args: data,
    module: 'terminal'
  }, _event)
}

