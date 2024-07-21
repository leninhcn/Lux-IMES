import request from '@/utils/request'

export function addCollecterror(data) {
  return request({
    url: '/collecterror/add',
    method: 'POST',
    data: data
  })
}