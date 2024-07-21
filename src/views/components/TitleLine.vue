<template>
	<Stack size="small" horizontal flex-items="center">
		<div class="split-left"></div>
		<el-text>{{ props.title }}</el-text>
		<div class="split-right" item-flex="1 1"></div>
	</Stack>
</template>

<style scoped>
.split-left {
	--el-border-style: solid;
	border-top: 1px var(--el-border-color) var(--el-border-style);
	width: 16px;
}

.split-right {
	--el-border-style: solid;
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>

<script setup>
import Stack from '@/views/components/Stack.vue'

const props = defineProps({
	title: {
		type: String,
	}
})
</script>