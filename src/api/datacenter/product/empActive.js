import request from '@/utils/request'

// 获取人员账号激活数据
export function getEmpActiveData(params) {
    return request({
      url: '/datacenter/empactive/EmpActiveLogList',
      method: 'get',
      params
    })
}

// 新增人员账号激活数据
export function addEmpActiveData(data) {
  return request({
    url: '/datacenter/empactive/EmpActiveLogInsert',
    method: 'put',
    data
  })
}


// 获取人员账号激活LOG
export function getEmpActiveLog(params) {
  return request({
    url: '/datacenter/empactive/EmpActiveLogListHt',
    method: 'get',
    params
  })
}