import request from '@/utils/request'

export function changeAccount (data) {
  const _event = {
    action: 'push',
    comment: `修改手机号码`
  }
  return request({
    url: '/oms/user/updateMobile',
    method: 'post',
    data: data,
    sign: true
  }, _event)
}
