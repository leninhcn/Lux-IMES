import request from '@/utils/request'

const base = 'warehousemanagement/warehousing'

export function actionWarehousing(data) {
  return request({
    url: `${base}/action`,
    method: 'post',
    data: data
  })
}