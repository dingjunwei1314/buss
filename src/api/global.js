import request from '@/utils/request'
import { PREFIX } from '@/config/app'

export function getCity (params) {
  const _event = {
    action: 'pull',
    comment: `获取城市列表`
  }
  return request({
    url: '/city/city/all',
    method: 'post',
    data: params
  }, _event)
}

export function getExportData (params) {
  const _event = {
    action: 'pull',
    comment: `获取导出数据`
  }
  return request({
    url: params.url,
    method: 'post',
    data: params.data,
    prefix: PREFIX,
    sign: true
  }, _event)
}
