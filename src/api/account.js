import request from '@/utils/request'

export function getAccount (params) {
  const _event = {
    action: 'pull',
    comment: `获取账号列表`
  }
  return request({
    url: '/access/account/list',
    method: 'post',
    data: params
  }, _event)
}

export function addAccount (params) {
  const _event = {
    action: 'pull',
    comment: `添加账号`
  }
  return request({
    url: '/access/account/add',
    method: 'post',
    data: params
  }, _event)
}

export function accountDetail (params) {
  const _event = {
    action: 'pull',
    comment: `获取账号详情`
  }
  return request({
    url: '/access/account/view',
    method: 'post',
    data: params
  }, _event)
}
