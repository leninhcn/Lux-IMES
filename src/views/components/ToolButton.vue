<template>
	<el-button :type="type" px="2" py="0.5" h="10" m="0">
		<span class="flex" flex="col" flex-items="center">
			<el-icon size="20" mb="1">
				<component :is="IconCom"></component>
			</el-icon>
			<div font-size="3">
				<slot></slot>
			</div>
		</span>
	</el-button>
</template>

<script setup>
const props = defineProps(['type', 'icon']);
const IconCom = props.icon
defineOptions({ a: 1 })

defineExpose({ IconCom })
</script>