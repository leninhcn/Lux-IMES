import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listMMaterialdppm(query) {
	return request({
		url: 'quality/dppm/list',
		method: 'get',
		params: query,
	})
}

//查询机种
export function QueryModels(query) {
	return request({
		url: 'quality/dppm/models',
		method: 'get',
		params: query,
	})
}


/**
* 新增
* @param data
*/
export function addMMaterialdppm(data) {
	return request({
		url: 'quality/dppm',
		method: 'post',
		data: data,
	})
}

/**
* 上传
* @param data
*/
export function uploadFiles(data) {
	return request({
		url: 'quality/dppm/upload',
		method: 'POST',
		data: data,
		headers: { 'Content-Type': 'multipart/form-data' }
	})
}


/**
* 修改
* @param data
*/
export function updateMMaterialdppm(data) {
	return request({
		url: 'quality/dppm',
		method: 'PUT',
		data: data,
	})
}
/**
* 获取详情
* @param {Id}
*/
export function getMMaterialdppm(id) {
	return request({
		url: 'quality/dppm/' + id,
		method: 'get'
	})
}

/**
* 删除
* @param {主键} pid
*/
export function delMMaterialdppm(pid) {
	return request({
		url: 'quality/dppm/' + pid,
		method: 'delete'
	})
}
