import request from '@/utils/request'
import { PREFIX, NEW_PREFIX } from '@/config/app'

export function getUserList (data) {
  const _event = {
    action: 'pull',
    comment: `查询用户列表`
  }
  return request({
    url: '/oms/user/searchUsers',
    method: 'post',
    data: data,
    // data: {},
    prefix: PREFIX,
    sign: true
  }, _event)
}  
export function getwalletList (data) {
  const _event = {
    action: 'pull',
    comment: `查询钱包列表`
  }
  return request({
    url: '/oms/user/seacrProAccount',
    method: 'post',
    data: data,
    // data: {},
    prefix: PREFIX,
    sign: true
  }, _event)
}   
export function getUser (data) {
  const _event = {
    action: 'pull',
    comment: `查询用户`
  }
  return request({
    url: '/oms/user/searchUser',
    method: 'post',
    data: data,
    // data: {},
    prefix: PREFIX,
    sign: true
  }, _event)
}
export function viewInfo (data) {
  const _event = {
    action: 'pull',
    comment: `查看用户详情`
  }
  return request({
    url: '/oms/user/searchDetail',
    method: 'post',
    data: data,
    prefix: PREFIX,
    sign: true
  }, _event)
}
export function changeStatus (data) {
  const _event = {
    action: 'push',
    comment: `禁用启用`
  }
  return request({
    url: '/oms/user/updateUserStatus',
    method: 'post',
    data: data,
    prefix: PREFIX,
    sign: true
  }, _event)
}

export function userAuth (data) {
  const _event = {
    action: 'push',
    comment: `审核用户`
  }
  return request({
    url: '/oms/user/identity',
    method: 'post',
    data: data,
    prefix: PREFIX,
    sign: true
  }, _event)
}

export function phoneChange (data) {
  const _event = {
    action: 'push',
    comment: `用户更换手机号`
  }
  return request({
    url: '/oms/user/updateMobile',
    method: 'post',
    data: data,
    prefix: NEW_PREFIX,
    sign: true,
    args: data,
    module: 'terminal'
  }, _event)
}

export function searchUserAuthReason (data) {
  const _event = {
    action: 'pull',
    comment: `查询用户审核失败原因`
  }
  return request({
    url: '/oms/user/searchUserAuthReason',
    method: 'post',
    data: data,
    prefix: PREFIX,
    sign: true
  }, _event)
}

