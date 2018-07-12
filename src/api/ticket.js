import request from '@/utils/request'

export function getTicketList (params) {
  const _event = {
    action: 'pull',
    comment: `获取优惠券列表`
  }
  return request({
    url: '/activity/coupon/list',
    method: 'post',
    data: params
  }, _event)
}

export function getTicketType () {
  const _event = {
    action: 'pull',
    comment: `获取优惠券类型`
  }
  return request({
    url: '/activity/coupon/type',
    method: 'post'
  }, _event)
}

export function getTicketStatus () {
  const _event = {
    action: 'mock',
    comment: `获取优惠券状态`
  }
  return request({
    url: '/mock/ticket/status',
    method: 'get'
  }, _event)
}

export function getRoles () {
  const _event = {
    action: 'pull',
    comment: `获取优惠规则`
  }
  return request({
    url: '/activity/coupon/rule',
    method: 'post'
  }, _event)
}

export function getDetail (params) {
  const _event = {
    action: 'pull',
    comment: `获取优惠券详情`
  }
  return request({
    url: '/activity/coupon/view',
    method: 'post',
    data: params
  }, _event)
}

export function submitCreateTicket (params) {
  const _event = {
    action: 'create',
    comment: `新建优惠券`
  }
  return request({
    url: '/activity/coupon/add',
    method: 'post',
    data: params
  }, _event)
}

export function editStatus (params) {
  const _event = {
    action: 'edit',
    comment: params.status === '1' ? `禁用优惠券${params.id}` : `启用优惠券${params.id}`
  }
  return request({
    url: '/activity/coupon/status',
    method: 'post',
    data: params
  }, _event)
}

export function deleteTicket (params) {
  const _event = {
    action: 'delete',
    comment: `删除优惠券`
  }
  return request({
    url: '/activity/coupon/del',
    method: 'post',
    data: params
  }, _event)
}

export function getRecord (params) {
  const _event = {
    action: 'pull',
    comment: `获取全部优惠券记录`
  }
  return request({
    url: '/activity/record/list',
    method: 'post',
    data: params
  }, _event)
}

export function getGrant (params) {
  const _event = {
    action: 'pull',
    comment: `获取发放优惠券记录`
  }
  return request({
    url: '/activity/publish/list',
    method: 'post',
    data: params
  }, _event)
}

export function getRedress (params) {
  const _event = {
    action: 'pull',
    comment: `获取补偿优惠券记录`
  }
  return request({
    url: '/activity/redress/list',
    method: 'post',
    data: params
  }, _event)
}

export function getSource () {
  const _event = {
    action: 'pull',
    comment: `获取优惠券来源`
  }
  return request({
    url: '/activity/coupon/source_type',
    method: 'post'
  }, _event)
}
