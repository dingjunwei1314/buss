import request from '@/utils/request'

export function getRedeemList (params) {
  const _event = {
    action: 'pull',
    comment: `获取优惠券兑换码列表`
  }
  return request({
    url: '/activity/redeem/list',
    method: 'post',
    data: params
  }, _event)
}

export function redeemDetail (params) {
  const _event = {
    action: 'pull',
    comment: `获取优惠券兑换码详情`
  }
  return request({
    url: '/activity/code/list',
    method: 'post',
    data: params
  }, _event)
}

export function getCoupon (params) {
  const _event = {
    action: 'pull',
    comment: `获取优惠券列表`
  }
  return request({
    url: '/activity/coupon/coupon',
    method: 'post',
    data: params
  }, _event)
}

export function createRedeem (params) {
  const _event = {
    action: 'create',
    comment: `生成兑换码`
  }
  return request({
    url: '/activity/redeem/add',
    method: 'post',
    data: params
  }, _event)
}

export function editRedeemStatus (params) {
  const _event = {
    action: 'edit',
    comment: params.cstatus === '1' ? '恢复兑换' : '暂停兑换'
  }
  return request({
    url: '/activity/redeem/status',
    method: 'post',
    data: params
  }, _event)
}

export function sendCoupon (params) {
  const _event = {
    action: 'create',
    comment: '发放优惠券'
  }
  return request({
    url: '/activity/publish/add',
    method: 'post',
    data: params
  }, _event)
}
