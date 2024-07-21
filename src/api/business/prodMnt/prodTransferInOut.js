import request from '@/utils/request'

const base = 'prodMnt/prodTransferInOut'

export function insertOBA(query) {
    return request({
        url: `${base}/InsertOBA`,
        method: 'get',
        params: query,
    })
}