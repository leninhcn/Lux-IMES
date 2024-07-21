import request from '@/utils/request'

const base = 'prodMnt/prodVI'

export function getMarinaStation(query) {
	return request({
		url: `${base}/GetMarinaStation`,
		method: 'get',
		params: query,
	})
}

export function marinaCheck(query) {
	return request({
		url: `${base}/MarinaCheck`,
		method: 'get',
		params: query,
	})
}

export function checkErrorCode(query) {
	return request({
		url: `${base}/CheckErrorCode`,
		method: 'get',
		params: query,
	})
}
