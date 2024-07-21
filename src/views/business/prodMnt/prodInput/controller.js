
import * as q from '@/api/business/prodMnt/prodInput.js'
import * as models from './models.js'

const { snInfo, woInfo, kpsnInfo, toolInfo, glueInfo, reelInfo, current } = models

async function _getValues(label, inputValue, ret) {
	if (label === 'SN') {
		const res = await q.checkSNStatus({ sn: inputValue })
		if (!res.status) {
			snInfo.sn = inputValue
			return
		}
		if (woInfo.wo === '') {
			ret.ok = false
			ret.msg = '请先选工单！'
			return
		}
	}

	if (label === 'KPSN' && woInfo.wo === '') {
		ret.ok = false
		ret.msg = '请先选工单！'
		return
	}

	let res = await q.getValues({ inputValue, item: label, modelName: snInfo.model })
	if (res.ok) {
		if (!res.data) {
			ret.ok = false
			ret.msg = `没有获取到 ${label} 输入框中条码的数据`
		}

		const data = ret.ok ? JSON.parse(res.data) : null

		switch (label) {
			case 'SN':
				if (!data) return
				snInfo.sn = inputValue
				if (woInfo.wo === '') {
					woInfo.wo = snInfo.wo = data['SN_GET_WO'].toString()
				}
				woInfo.model = snInfo.model = data['SN_GET_MODEL'].toString()
				woInfo.ipn = snInfo.ipn = data['SN_GET_IPN'].toString()
				woInfo.route = snInfo.route = data['SN_GET_ROUTE'].toString()
				break
			case "WO":
				if (!data) return
				snInfo.wo = woInfo.wo = inputValue
				woInfo.target = parseInt(data["WO_GET_WO_TARGET_QTY"])
				woInfo.input = parseInt(data["WO_GET_WO_INPUT_QTY"])
				woInfo.output = parseInt(data["WO_GET_WO_OUTPUT_QTY"])
				woInfo.needInput = parseInt(woInfo.target) - parseInt(woInfo.input)
				snInfo.ipn = woInfo.ipn = data["WO_GET_IPN"].toString()
				snInfo.model = woInfo.model = data["WO_GET_MODEL"].toString()
				snInfo.route = woInfo.route = data["WO_GET_ROUTE"].toString()
				snInfo.kol = data["WO_GET_KOL"]?.toString()
				break
			case "TOOL":
				toolInfo.tool = inputValue
				break

			case "KPSN":
				kpsnInfo.kpsn = inputValue.toUpperCase()
				if (!snInfo.sn && woInfo.wo) {
					const res = await q.getPamSn({ wo: woInfo.wo })
					if (res.ok) {
						snInfo.sn = res.data
					}
				}
				break
			case "GLUE":
				glueInfo.glueNo = inputValue
				break
			case "REEL":
				reelInfo.reelNo = inputValue
				break
		}
	}

	ret.ok = true
	ret.msg = ''
}

export async function getValues(label, inputValue) {
	const result = { ok: true, msg: '' }

	try {
		await _getValues(label, inputValue, result)
	}
	catch (e) {
		result.ok = false
		result.msg = e.toString()
	}

	return result
}

export async function clearGetSN(stationType) {
	const sn = snInfo.sn
	const result = { ok: true, msg: '' }
	try {
		const res = await q.getSNLinkKpsnInfo({ sn, stationType })
		if (res.kpList.length == 0) {
			await q.clearGetSN({ sn })
		}
	}
	catch (e) {
		result.ok = false
		result.msg = e.toString()
	}

	return result
}


export async function checkValue(label, inputValue) {
	const result = { ok: true, msg: '' }
	const res = await q.checkValue({ inputValue, item: label, modelName: snInfo.model })
	result.ok = res.ok
	result.msg = res.data

	return result
}

export async function checkKpsn(station) {
	const result = { ok: true, msg: '', kpIpn: '' }
	const res = await q.checkKpsn({ sn: snInfo.sn, wo: woInfo.wo, kpsn: kpsnInfo.kpsn, station })

	if (result.ok = res.ok)
		result.kpIpn = res.data
	else
		result.msg = res.data

	return result
}

export async function checkHalbStockOut(stationType) {
	const result = { ok: true, msg: '' }

	const res = await q.checkStockOut({ stationType })
	if (res.any) {
		//
	}

	return result
}

export async function checkLogic(station, step) {
	const result = { ok: true, msg: '' }

	const res = await q.checkLogic({
		sn: snInfo.sn,
		wo: woInfo.wo,
		kpsn: current.kpList,
		model: woInfo.model,
		tool: toolInfo.tool,
		glue: glueInfo.glueNo,
		reel: reelInfo.reelNo,
		station,
		route: woInfo.route,
		step
	})

	if (!(result.ok = res.ok)) {
		result.msg = res.data
	}
	return result
}