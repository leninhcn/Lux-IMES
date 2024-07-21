<template>
	<div h="full" b-rd="2" p="2" style="background-color: lavender;">
		<Stack h="full">
			<Stack class="menu-bar" horizontal b-rd="2" p="1" mt="-5">
				<el-dropdown trigger="click" size="small" @command="vc.onMenuCommand">
					<span p="1" class="el-dropdown-link">菜单<el-icon><arrow-down /></el-icon></span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="configTerminal">站点配置</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</Stack>
			<el-row item-flex="1" h="full" :gutter="10" item-class="truncate p-5 m--5" pb="2" item-nogap>
				<el-col :span="14" h="full">
					<Stack h="full">
						<Stack size="small" class="block-bar" b-rd="2" p="2">
							<TitleLine title="Input Info" />
							<el-row>
								<el-col :span="12" pl="5">
									<Stack size="small">
										<el-text self-start>{{ state.stationInfo.stationType }}</el-text>
										<el-text self-start>{{ state.stationInfo.station }}</el-text>
										<el-text self-start>{{ state.actionDesc }}</el-text>
									</Stack>
								</el-col>
								<el-col :span="8">
									<el-button size="small" px="4" type="primary">叫修</el-button>
								</el-col>
							</el-row>
							<InputBox :label="viewState.input.label" size="small" v-model.trim="state.input"
								:readonly="viewState.input.readonly" v-model:disabled="viewState.input.disabled"
								v-model:focused="viewState.input.focused" @submit="vc.onInputSubmit" />
							<InputBox label="Info" size="small" readonly v-model="state.info" />
							<InputBox label="SN" size="small" readonly v-model="state.mainSn" />
							<InputBox label="MO" size="small" readonly v-model="state.snWo" />
							<InputBox label="IPN" size="small" readonly v-model="state.snIpn" />
							<InputBox label="Line" size="small" readonly v-model="state.snLine" />
							<Stack horizontal mx="1" v-show="viewState.showWoList">
								<el-text item-flex="0 0 20%" align="center" tag="b" size="large">MO</el-text>
								<el-select size="small" v-model="state.curWo">
									<el-option v-for="(wo, index) in state.woList" :key="index" :label="wo" :value="wo" />
								</el-select>
							</Stack>
						</Stack>
						<div item-flex="1" class="block-bar" truncate b-rd="2" p="2" h="full">
							<el-row :gutter="8" h="full">
								<el-col :span="11" h="full">
									<Stack h="full" size="small">
										<TitleLine title="正在投入物料" />
										<el-table item-flex="1" border :data="state.inputBomData">
											<el-table-column v-for="i in inputBomDataCols" :key="i.prop" :prop="i.prop"
												:label="i.label" :min-width="i.width" :fixed="i.fixed"
												show-overflow-tooltip />
										</el-table>
									</Stack>
								</el-col>
								<el-col :span="13" h="full">
									<Stack h="full" size="small">
										<TitleLine title="已绑物料" />
										<el-table item-flex="1" border :data="state.bindItemsData">
											<el-table-column v-for="i in bindItemsDataCols" :key="i.prop" :prop="i.prop"
												:label="i.label" :min-width="i.width" :fixed="i.fixed"
												show-overflow-tooltip />
										</el-table>
									</Stack>
								</el-col>
							</el-row>
						</div>
					</Stack>
				</el-col>
				<el-col :span="10" h="full">
					<Stack class="block-bar" b-rd="2" p="2" h="full" size="small">
						<TitleLine title="Station BOM" />
						<el-table item-flex="1" border :data="state.bomData">
							<el-table-column v-for="i in bomDataCols" :key="i.prop" :prop="i.prop" :label="i.label"
								:min-width="i.width" :fixed="i.fixed" show-overflow-tooltip />
						</el-table>
					</Stack>
				</el-col>
			</el-row>
			<div h="full" truncate class="windowMsg block-bar" b-rd="2" mb="-6">
				<div :bg="state.windowStateAttr.bg"></div>
				<div class="flex block-bar" p="2" py="4.5" flex="col" flex-items="center" whitespace="normal" h="full"
					text="2xl center wrap">
					<div class="msg-content">{{ state.windowMsg }}</div>
				</div>
			</div>
		</Stack>
		<DownDialog v-model:visible="viewState.showStationConfig" v-slot="{ dialogOpen }" width="80%">
			<StationConfig class="p-0" h="120" :op-types="['ASSY', 'VI']" :client-types="['MANU']"
				@onOk="vc.onStationConfigOk" @onCancel="vc.switchStationConfig(false)" :opened="dialogOpen" />
		</DownDialog>
	</div>
</template>
<style scoped>
.menu-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(22px);
	box-shadow: 0px 20px 20px -10px rgb(0 0 0 / 37%);
}

.block-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(15px);
	box-shadow: 0px 5px 20px 0px rgb(0 0 0 / 12%);
}

.el-dropdown-link {
	cursor: pointer;
	/* color: var(--el-color-primary); */
	display: flex;
	align-items: center;
	font-size: 0.75rem;
}

.windowState {
	color: var(--el-color-primary-light-9);
	transition: all 0.2s ease-out;
}

.windowState[bg~=red] {
	--un-bg-opacity: 1;
	background-color: rgb(248 113 113 / var(--un-bg-opacity));
}

.windowState[bg~=green] {
	--un-bg-opacity: 1;
	background-color: rgb(74 222 128 / var(--un-bg-opacity));
}

.windowState[bg~=white] {
	--un-bg-opacity: 1;
	background-color: rgb(255 255 255 / var(--un-bg-opacity));
}

.windowMsg {
	color: var(--el-text-color-primary);
	position: relative;
	backdrop-filter: blur(3px);
	transition: all 0.5s ease-out;
}

.windowMsg .msg-content {
	--green-: 0 183 40;
	--red-: 255 0 50;

	padding: 0px 4px;
	-webkit-background-clip: text;
	-moz-background-clip: text;
	background-clip: text;
	background-color: #ffffff82;
	-webkit-text-stroke: 5px transparent;
}

.windowMsg>[bg] {
	position: absolute;
	inset: 0.3rem;
	border-radius: 0.3rem;
	transition: all 0.5s ease-out;
	--green-bg: 0 183 40;
	--red-bg: 255 0 50;

	background-color: rgb(230 230 250 / 0.01);
}

.windowMsg>[bg~=red] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--red-bg)/ 100%);
}

.windowMsg>[bg~=green] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--green-bg)/ 100%);
}

.windowMsg>.block-bar {
	backdrop-filter: blur(8px);
}

.windowMsg>[bg~=red]+.block-bar>.msg-content {
	color: rgb(var(--red-))
}

.windowMsg>[bg~=green]+.block-bar>.msg-content {
	color: rgb(var(--green-))
}

.windowMsg>[bg~=white]+.block-bar>.msg-content {
	color: rgb(0 0 0)
}

.disable-all * {
	pointer-events: none;
}
</style>

<style>
.max-w-0\.55 {
	max-width: 55%;
}
</style>

<script setup>
import Stack from '@/views/components/Stack.vue'
import TitleLine from '@/views/components/TitleLine.vue'

import StationConfig from '@/views/components/business/StationConfig.vue'
import DownDialog from '@/views/components/DownDialog.vue'

import InputBox from '@/views/components/business/InputBox.vue'

import { ElMessage } from 'element-plus'
import * as vc from './viewController.js'
import { state, viewState } from './viewController.js'

//cols
const inputBomDataCols = [
	{ prop: 'itemIpn', label: 'ITEM_IPN', width: 110, fixed: true },
	{ prop: 'spec', label: 'Spec', width: 180 },
	{ prop: 'itemSn', label: 'ITEM_SN', width: 200 },
	{ prop: 'slot', label: 'Slot', width: 200 },
]

const bindItemsDataCols = [
	{ prop: 'itemIpn', label: 'ITEM_IPN', width: 110, fixed: true },
	{ prop: 'itemSn', label: 'ITEM_SN', width: 180 },
	{ prop: 'itemGroup', label: 'ITEM_GROUP', width: 200 },
	{ prop: 'mesSpec', label: 'Spec', width: 200 },
	{ prop: 'slot', label: 'Slot', width: 200 },
]

const bomDataCols = [
	{ prop: 'workOrder', label: '工单', width: 110, fixed: true },
	{ prop: 'serialNumber', label: '序列号', width: 180 },
	{ prop: 'stationType', label: '站点类型', width: 200 },
	{ prop: 'nextStationType', label: '下一个站点类型', width: 200 },
]

//refs

//watches


//vue-hooks
onMounted(() => {
	vc.initWatches()
	vc.onLoad()
})
</script>