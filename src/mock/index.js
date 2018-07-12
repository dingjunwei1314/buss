import Mock from 'mockjs'

const ticketStatus = [{
  label: '全部',
  value: '0'
}, {
  label: '可用',
  value: '1'
}, {
  label: '禁用',
  value: '2'
}]

// 优惠券状态
Mock.mock(/mock\/ticket\/status/, 'get', {code: 200, data: ticketStatus})
