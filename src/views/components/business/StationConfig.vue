<template>
	<div h="120" p="2">
		<Stack h="full">
			<el-text size="large" tag="b" my="1">站点配置</el-text>
			<el-card :body-style="{ padding: '0.4rem 1rem' }" :style="{ backgroundColor: '#ffffff7a' }">
				<Stack horizontal>
					<el-text>Factory</el-text>
					<el-select v-model="state.curSite">
						<el-option v-for="(item, index) in state.sites" :key="index" :label="item"
							:value="item"></el-option>
					</el-select>
					<el-text>{{ state.curSite }}</el-text>
				</Stack>
			</el-card>
			<el-row :gutter="10" item-flex="1" item-class="truncate m--2 p-2" h="full">
				<el-col :span="10" h="full">
					<el-card h="full" class="overflow-auto" :body-style="{ padding: '0.4rem', height: '100%' }"
						:style="{ backgroundColor: '#ffffff7a' }">
						<el-tree bg="transparent" h="full" :highlight-current="true" :data="state.stationTree"
							:props="{ class: nodeClass }" :empty-text="state.stationEmptyTip" node-key="label"
							ref="stationTreeRef" @current-change="onStationTreeNodeChange" />
					</el-card>
				</el-col>
				<el-col :span="14">
					<el-card h="full" :body-style="{ padding: '0.4rem', height: '100%' }"
						:style="{ backgroundColor: '#ffffff7a' }">
						<Stack h="full">
							<Stack item-flex="0 0 50%" justify="between" pl="10" pr="40" pt="10">
								<Stack horizontal size="large">
									<el-text item-flex="0 0 25%">Line</el-text>
									<el-text color="red">{{ state.stationParam.line }}</el-text>
								</Stack>
								<Stack horizontal size="large">
									<el-text item-flex="0 0 25%">Stage</el-text>
									<el-text color="red">{{ state.stationParam.stage }}</el-text>
								</Stack>
								<Stack horizontal size="large">
									<el-text item-flex="0 0 25%">StationType</el-text>
									<el-text color="red">{{ state.stationParam.stationType }}</el-text>
								</Stack>
								<Stack horizontal size="large">
									<el-text item-flex="0 0 25%">Station</el-text>
									<el-text color="red">{{ state.stationParam.station }}</el-text>
								</Stack>
							</Stack>
							<div item-flex="1"></div>
							<Stack horizontal mb="2" mr="2">
								<div item-flex="1"></div>
								<el-button px="15" type="primary" @click="onOk">OK</el-button>
								<el-button type="info" @click="onCancel">Cancel</el-button>
							</Stack>
						</Stack>
					</el-card>
				</el-col>
			</el-row>
		</Stack>
	</div>
</template>
<style>
.el-tree--highlight-current .el-tree-node.is-current.station-node>.el-tree-node__content {
	background-color: var(--el-color-primary);
	color: var(--el-color-primary-light-9);
}
</style>

<script setup>
import Stack from '@/views/components/Stack.vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const reqBase = 'prodMnt/stationConfig'
function getSites() {
	return request({
		url: `${reqBase}/GetSites`,
		method: 'get',
		params: null,
	})
}

function getSitesWith(query) {
	return request({
		url: `${reqBase}/GetSitesWith`,
		method: 'post',
		data: query,
	})
}

function getStations(query) {
	return request({
		url: `${reqBase}/GetStations`,
		method: 'post',
		data: query,
	})
}

const props = defineProps({
	sites: {
		type: Array,
		default: [],
	},

	opTypes: {
		type: Array,
		required: true,
	},

	clientTypes: {
		type: Array,
		required: true,
	},

	opened: {
		type: Boolean,
		default: false,
	}
})
const emit = defineEmits(['onOk', 'onCancel'])

const state = reactive({
	sites: [],
	curSite: null,
	stationEmptyTip: '选择工厂来查询站点列表',
	stationTree: [],

	stationParam: {
		line: 'TBD',
		stage: 'TBD',
		stationType: 'TBD',
		station: 'TBD',
	}
})

let selectedNode = null

let lastSite = null
let lastStationTreeData = state.stationTree
let lastSelectedNodeKey = null

let manualSwitchSite = true

let preventEvent = false

const stationTreeRef = ref(null)

//watches
watch(() => state.curSite, async (curSite) => {
	state.stationTree = []
	defaultStationParam()
	if (manualSwitchSite) {
		const res = await getStations({ site: curSite, opTypes: props.opTypes, clientTypes: props.clientTypes })
		if (res instanceof Array) {
			state.stationTree = res
		}
		else {
			ElMessage({
				message: res.msg,
				type: 'info',
				duration: 2000
			})
			state.stationEmptyTip = `${curSite} 没有站点数据`
		}
	}
	else {
		state.stationTree = lastStationTreeData
	}
})

watch(() => props.opened, (opened) => {
	if (preventEvent) {
		preventEvent = false
		return
	}
	if (!opened)
		beforeClose()
})

//methods
const nodeClass = (nodeData) => {
	if (nodeData.iconIndex > 2) return 'station-node'
	return null
}

const clearData = (obj) => {
	for (const i in obj) {
		const op = obj[i]

		const type = typeof (op)
		if (type === 'boolean')
			obj[i] = false
		else if (op instanceof Array)
			obj[i] = []
		else
			obj[i] = null
	}
}

const defaultStationParam = () => {
	state.stationParam.line = 'TBD'
	state.stationParam.stage = 'TBD'
	state.stationParam.stationType = 'TBD'
	state.stationParam.station = 'TBD'
}

/*public*/ const beforeClose = () => {
	onCancel(false)
}

//events
const onStationTreeNodeChange = (nodeData, node) => {
	defaultStationParam()
	selectedNode = node
	let curNode = node
	do {
		const data = curNode.data
		if (data.iconIndex == 0)
			state.stationParam.line = data.label
		else if (data.iconIndex == 1) {
			state.stationParam.stage = data.label
		}
		else if (data.iconIndex == 2) {
			state.stationParam.stationType = data.label
		}
		else if (data.iconIndex == 3) {
			state.stationParam.station = data.label
		}
	}
	while ((curNode = curNode.parent, !(curNode.data instanceof Array)))
}

const onOk = () => {
	if (selectedNode && selectedNode.data.iconIndex == 3 && state.stationParam.station === selectedNode.label) {
		lastSite = state.curSite
		lastStationTreeData = state.stationTree
		lastSelectedNodeKey = state.stationParam.station
		emit('onOk', { ...state.stationParam })
	}
	else {
		ElMessage({ message: '还未选择站点！', type: 'info', duration: 2000 })
	}
}

const onCancel = async (trigger = true) => {
	if (lastSite && lastSite != state.curSite) {
		manualSwitchSite = false

		state.curSite = lastSite

		await nextTick()
		manualSwitchSite = true
	}

	if (lastSelectedNodeKey)
		stationTreeRef.value.setCurrentKey(lastSelectedNodeKey)

	if (trigger) {
		preventEvent = true
		emit('onCancel')
	}
}

onMounted(async () => {
	const sites = props.sites?.length != 0 ? await getSitesWith({ sites: props.sites }) : await getSites()
	state.sites = sites
})

//expose
defineExpose({
	beforeClose
})

</script>
