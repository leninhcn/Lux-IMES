export const current = {
	stationKpCount: 0,
	kpCurrentCount: 0,
	kpList: '',

	bindList: [],

	clear() {
		this.stationKpCount = 0
		this.kpCurrentCount = 0
		this.kpList = ''
		this.bindList = []
	}
}

export const snInfo = {
	sn: '',
	fdiSn: '',
	wo: '',
	model: '',
	ipn: '',
	route: '',
	mpn: '',
	regionCode: '',
	imei: '',
	imei2: '',
	moped: '',
	fdiMpn: '',
	fdiRegionCode: '',
	fdiImei: '',
	fdiMoped: '',
	fdiPower: '',

	clear() {
		this.sn = 'N/A'
		this.model = ''
	}
}

export const woInfo = {
	wo: '',
	target: 0,
	input: 0,
	output: 0,
	needInput: 0,
	ipn: '',
	model: '',
	route: '',

	clear() {
		this.wo = ''
		this.target = 0
		this.input = 0
		this.output = 0
		this.needInput = 0
		this.ipn = ''
		this.model = ''
		this.route = ''
	}
}

export const kpsnInfo = {
	kpsn: '',
	clear() { this.kpsn = '' }
}

export const toolInfo = {
	tool: '',
	clear() { this.tool = '' }
}

export const glueInfo = {
	glueNo: '',
	clear() { this.glueNo = '' }
}

export const reelInfo = {
	reelNo: '',
	clear() { this.reelNo = '' }
}