<template>
    <div h="full" class="app-container">
        <Stack h="full">
            <el-tabs v-model="state.activeTabName" type="" @tab-change="vc.onTabChange">
                <el-tab-pane :label='$t("mntntoolpickup.pickUp")' name="pickUp">
                    <Stack px="4">
                        <div flex>
                            <el-text>
                                <span font="bold" font-size="8">{{ $t("mntntoolpickup.pickUp") }}</span>
                            </el-text>
                        </div>
                    </Stack>
                </el-tab-pane>
                <el-tab-pane :label='$t("mntntoolpickup.return")' name="return">
                    <Stack px="4">
                        <div flex>
                            <el-text>
                                <span font="bold" font-size="8">{{ $t("mntntoolpickup.return") }}</span>
                            </el-text>
                        </div>
                    </Stack>
                </el-tab-pane>
            </el-tabs>
            <Stack horizontal ml="18" size="large">
                <InputBox :label='$t("mntntoolpickup.empNo")' v-model.trim="state.empNo" :readonly="vs.empNo.readonly"
                    v-model:disabled="vs.empNo.disabled" v-model:focused="vs.empNo.focused" @submit="vc.onEmpNoSubmit"
                    v-show="vs.empNo.visible" />
                <InputBox :label='$t("mntntoolpickup.tooling")' v-model.trim="state.tooling"
                    :readonly="vs.tooling.readonly" v-model:disabled="vs.tooling.disabled"
                    v-model:focused="vs.tooling.focused" @submit="vc.onToolingSubmit" v-show="vs.tooling.visible" />
                <el-button @click="vc.reset">{{ $t('mntntoolpickup.reset') }}</el-button>
            </Stack>
            <el-table item-flex="1" :data="state.pickData">
                <el-table-column :label="$t('mntntoolpickup.toolingType')" align="center" prop="toolingType" />
                <el-table-column :label="$t('mntntoolpickup.toolingNo')" align="center" prop="toolingNo" />
                <el-table-column :label="$t('mntntoolpickup.toolingSn')" align="center" prop="toolingSn" />
                <el-table-column :label="$t('mntntoolpickup.toolingSnDesc')" align="center" prop="toolingSnDesc" />
                <el-table-column :label="$t('mntntoolpickup.totalUsedCount')" align="center" prop="totalUsedCount" />
                <el-table-column :label="$t('mntntoolpickup.maxUseTimes')" align="center" prop="maxUseTimes" />
                <el-table-column :label="$t('mntntoolpickup.toolingStatus')" align="center" prop="toolingStatus" />
                <el-table-column :label="$t('mntntoolpickup.empName')" align="center" prop="empName" />
                <el-table-column :label="$t('mntntoolpickup.updateTime')" align="center" prop="updateTime" />
            </el-table>
            <div h="full" truncate class="windowMsg block-bar" b-rd="2">
                <div :bg="state.windowStateAttr.bg"></div>
                <div class="flex block-bar" p="2" py="4.5" flex="col" flex-items="center" whitespace="normal" h="full"
                    text="2xl center wrap">
                    <div class="msg-content">{{ state.windowMsg }}</div>
                </div>
            </div>
        </Stack>
    </div>
</template>
<style scoped>
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
</style>

<script setup>
import InputBox from '@/views/components/business/InputBox.vue'
import Stack from '@/views/components/Stack.vue'

import * as vc from './viewController.js'
import { state, viewState as vs } from './viewController.js'

vc.setProxy(getCurrentInstance().proxy)

onMounted(() => {
    vc.init()
})
</script>