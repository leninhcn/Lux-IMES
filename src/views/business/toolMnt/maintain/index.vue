<template>
    <div h="full" class="app-container">
        <Stack h="full">
            <Stack horizontal ml="3" size="large">
                <InputBox :label='$t("mntntoolmaintain.empNo")' v-model.trim="state.empNo" :readonly="vs.empNo.readonly"
                    v-model:disabled="vs.empNo.disabled" v-model:focused="vs.empNo.focused" @submit="vc.onEmpNoSubmit"
                    v-show="vs.empNo.visible" />
                <InputBox :label='$t("mntntoolmaintain.tooling")' v-model.trim="state.tooling"
                    :readonly="vs.tooling.readonly" v-model:disabled="vs.tooling.disabled"
                    v-model:focused="vs.tooling.focused" @submit="vc.onToolingSubmit" v-show="vs.tooling.visible" />
                <el-button @click="vc.reset">{{ $t('mntntoolmaintain.reset') }}</el-button>
            </Stack>
            <el-table item-flex="1" :data="state.toolingData">
                <el-table-column :label="$t('mntntoolmaintain.toolingType')" align="center" prop="toolingType" />
                <el-table-column :label="$t('mntntoolmaintain.face')" align="center" prop="face" />
                <el-table-column :label="$t('mntntoolmaintain.toolingSn')" align="center" prop="toolingSn" />
                <el-table-column :label="$t('mntntoolmaintain.toolingDesc')" align="center" prop="toolingDesc" />
                <el-table-column :label="$t('mntntoolmaintain.length')" align="center" prop="length" />
                <el-table-column :label="$t('mntntoolmaintain.width')" align="center" prop="width" />
                <el-table-column :label="$t('mntntoolmaintain.height')" align="center" prop="height" />
                <el-table-column :label="$t('mntntoolmaintain.damageDegree')" align="center" prop="damageDegree" />
                <el-table-column :label="$t('mntntoolmaintain.cleanDegree')" align="center" prop="cleanDegree" />
                <el-table-column :label="$t('mntntoolmaintain.rough')" align="center" prop="rough" />
                <el-table-column :label="$t('mntntoolmaintain.scrape')" align="center" prop="scrape" />
                <el-table-column :label="$t('mntntoolmaintain.lastMaintainTime')" align="center"
                    prop="lastMaintainTime" />
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