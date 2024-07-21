import request from '@/utils/request'

// 获取数据
export function getLineData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/ShowLineInfo',
    method: 'get',
    params
  })
}

// 新增数据
export function addLineData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/InsertLineInfo',
    method: 'put',
    data
  })
}

// 修改数据
export function editLineData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/UpdateLine',
    method: 'put',
    data
  })
}

// 删除数据
export function delLineData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/DeleteLineByID',
    method: 'delete',
    data
  })
}
