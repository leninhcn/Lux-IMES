import request from '@/utils/request'

// 验证 reelid
export function verification(params) {
  return request({
    url: '/prodMnt/ProdMaintenance/Verification',
    method: 'get',
    params
  })
}

// 验证
export function validate(params) {
  return request({
    url: '/prodMnt/ProdMaintenance/Validate',
    method: 'get',
    params
  })
}
