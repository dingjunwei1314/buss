import request from '@/utils/request'
import { getUserId } from '@/utils/auth'

export function login (username, password) {
  const _event = {
    action: 'login',
    comment: `用户 ${username} 登录`
  }
  return request({
    url: '/login/login',
    method: 'post',
    data: {
      'user_account': username,
      'user_pwd': password
    }
  }, _event)
}

export function getInfo () {
  const userId = getUserId()
  const _event = {
    action: 'pull',
    comment: `用户 ${userId} 获取用户权限`
  }
  return request({
    url: '/perm/role-perm',
    method: 'post',
    data: {
      'user_id': userId
    }
  }, _event)
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
