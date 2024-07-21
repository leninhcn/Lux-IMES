import request from '@/utils/request'

// 获取数据
export function getPartData(params) {
  return request({
    url: '/prodMnt/prodModel/PordPartList',
    method: 'get',
    params
  })
}

// 新增
export function addPartData(data) {
  return request({
    url: '/prodMnt/prodModel/PordPartInsert',
    method: 'post',
    data
  })
}

// 修改
export function editPartData(data) {
  return request({
    url: '/prodMnt/prodModel/PordPartUpdate',
    method: 'put',
    data
  })
}

// 删除
export function delPartData(data) {
  return request({
    url: '/prodMnt/prodModel/PordPartDelete',
    method: 'delete',
    data
  })
}

// log
export function getPartLog(params) {
  return request({
    url: '/prodMnt/prodModel/PordPartHtlist',
    method: 'get',
    params
  })
}

// 获取抽查计划数据
export function getPartPlanData(params) {
  return request({
    url: '/prodMnt/prodModel/PlanList',
    method: 'get',
    params
  })
}
