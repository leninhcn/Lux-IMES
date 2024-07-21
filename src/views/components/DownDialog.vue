<template>
	<div :class="overlayClass" @click.self="onOverlayClose">
		<div class="down-body" v-bind="$attrs" :class="bodyClass" :style="bodyStyle">
			<slot :dialog-open="visible"></slot>
		</div>
	</div>
</template>
<style scoped>
.down-overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2000;
	height: 100%;
	box-shadow: inset 360px 0px 360px -340px rgb(0 0 0 / 47%), inset -360px 0px 360px -340px rgb(0 0 0 / 47%),
		inset 0px -260px 260px -240px rgb(0 0 0 / 47%);
	/* backdrop-filter: blur(0px); */
	overflow: auto;
	transition: all 0.5s;
}

.down-overlay.hide {
	display: none;
}

.down-overlay.trans-back {
	box-shadow: inset 60px 0px 60px -40px rgb(0 0 0 / 0%), inset -60px 0px 60px -40px rgb(0 0 0 / 0%),
		inset 0px -60px 60px -40px rgb(0 0 0 / 0%);
	/* backdrop-filter: blur(0px); */
}

.down-body {
	position: absolute;
	transform: translate(-50%, 0px);
	left: 50%;
	transition: all 0.5s cubic-bezier(0, 1.06, 0.58, 1) 0s;
	border-radius: 0 0 0.6rem 0.6rem;
	overflow: auto;
	background-color: #ffffff80;
	backdrop-filter: blur(35px);
	box-shadow: 0px 40px 40px -20px rgba(0, 0, 0, 0.47)
}

.down-body.hide {
	transform: translate(-50%, -115%);
}
</style>

<script setup>
defineOptions({
	inheritAttrs: false
})
const props = defineProps({
	visible: { type: Boolean, required: false, default: false },
	width: { type: String, required: false, default: '70%' }
})

const emit = defineEmits(['update:visible'])

const overlayClass = reactive({ 'down-overlay': true, hide: true, 'trans-back': true })

const bodyStyle = reactive({
	width: props.width,
})

const bodyClass = reactive({
	hide: false
})

const visible = computed({
	get() {
		return props.visible
	},
	set(value) {
		emit('update:visible', value)
	}
})

watch(() => props.width, (val, old) => {
	bodyStyle.width = val
})

watch(() => props.visible, (val, old) => {
	if (val) {
		open()
	}
	else {
		close()
	}
})

const onOverlayClose = () => {
	visible.value = false
}

const removeHide = () => {
	bodyClass.hide = false
}

const open = async () => {
	bodyClass.hide = true
	overlayClass.hide = false
	await nextTick()

	setTimeout(() => {
		overlayClass['trans-back'] = false
		removeHide()
	}, 1)
}

const close = async () => {
	bodyClass.hide = true
	overlayClass['trans-back'] = true

	await nextTick()
	setTimeout(() => {
		removeHide()
		overlayClass.hide = true
	}, 500)

}
</script>