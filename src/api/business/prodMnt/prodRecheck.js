import request from '@/utils/request'

const base = 'prodMnt/prodRecheck'

export function getHtValues(query) {
	return request({
		url: `${base}/GetHtValues`,
		method: 'get',
		params: query,
	})
}

export function getSnDetail(query) {
	return request({
		url: `${base}/GetSnDetail`,
		method: 'get',
		params: query,
	})
}

export function checkLogic(query) {
	return request({
		url: `${base}/CheckLogic`,
		method: 'get',
		params: query,
	})
}