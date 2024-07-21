import request from '@/utils/request'

// 获取数据
export function getHourData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/StandardTimelist',
    method: 'get',
    params
  })
}

// 新增数据
export function addHourData(data) {
  return request({
    url: '/MntnlStandard/StandardTime/StandardTimeInsert',
    method: 'post',
    data
  })
}

// 修改数据
export function editHourData(data) {
  return request({
    url: '/MntnlStandard/StandardTime/StandardTimeUpdate',
    method: 'put',
    data
  })
}

// 复制数据
export function copyHourData(data) {
  return request({
    url: '/MntnlStandard/StandardTime/StationCopy',
    method: 'post',
    data
  })
}

// 删除数据
export function delHourData(data) {
  return request({
    url: '/MntnlStandard/StandardTime/StandardTimeDelet',
    method: 'delete',
    data
  })
}

// 历史查询
export function getHourLog(params) {
  return request({
    url: '/MntnlStandard/StandardTime/StandardTimelistHt',
    method: 'get',
    params
  })
}

// 获取料号
export function getHourIpnData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/FactoryStandardTimelist',
    method: 'get',
    params
  })
}

// 获取客户
export function getHourModelData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/ModelStandardTimelist',
    method: 'get',
    params
  })
}

// 获取机种负责人
export function getHourDutyofmodelData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/ModelNameStandardTimeList',
    method: 'get',
    params
  })
}

// 获取线别
export function getHourLineData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/LineStandardTimelist',
    method: 'get',
    params
  })
}

// 获取站点
export function getHourStationtypeData(params) {
  return request({
    url: '/MntnlStandard/StandardTime/StationtypeStandardTimelist',
    method: 'get',
    params
  })
}
