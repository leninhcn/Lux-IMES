import request from '@/utils/request'

const base = 'prodMnt/prodOBA'

export function insertOBA(query) {
	return request({
		url: `${base}/InsertOBA`,
		method: 'get',
		params: query,
	})
}

export function insertHold(query) {
	return request({
		url: `${base}/InsertHold`,
		method: 'get',
		params: query,
	})
}

export function getSnInfo(query) {
	return request({
		url: `${base}/GetSnInfo`,
		method: 'get',
		params: query,
	})
}

export function getSnFromKpItem(query) {
	return request({
		url: `${base}/GetSnFromKpItem`,
		method: 'get',
		params: query,
	})
}