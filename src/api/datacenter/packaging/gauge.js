import request from '@/utils/request'

// 获取包规数据
export function getGaugeData(params) {
  return request({
    url: '/MntnPackSpec/MntnPackSpecController/MntnPackSpeclist',
    method: 'get',
    params
  })
}

// 新增包规数据
export function addGaugeData(data) {
  return request({
    url: '/MntnPackSpec/MntnPackSpecController/MntnPackSpecInsert',
    method: 'post',
    data
  })
}

// 修改包规数据
export function editGaugeData(data) {
  return request({
    url: '/MntnPackSpec/MntnPackSpecController/MntnPackSpecUpdate',
    method: 'put',
    data
  })
}

// 删除包规数据
export function delGaugeData(data) {
  return request({
    url: '/MntnPackSpec/MntnPackSpecController/MntnPackSpecDelet',
    method: 'delete',
    data
  })
}

// 获取日志
export function getGaugeLog(params) {
  return request({
    url: '/MntnPackSpec/MntnPackSpecController/MntnPackSpeclistHt',
    method: 'get',
    params
  })
}
