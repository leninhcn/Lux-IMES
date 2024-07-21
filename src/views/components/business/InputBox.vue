<template>
	<Stack horizontal mx="1">
		<el-text item-flex="0 0 20%" align="center" tag="b" size="large">{{ props.label }}</el-text>
		<el-input item-flex="1" ref="inputRef" v-model.lazy="inputValue" :readonly="props.readonly" :size="props.size"
			:disabled="props.disabled" @focus="onFocusChange(true)" @blur="onFocusChange(false)"
			@keyup.enter="$emit('submit')" />
	</Stack>
</template>

<script setup>
import Stack from '@/views/components/Stack.vue'

const props = defineProps({
	label: {
		type: String,
		required: true,
	},

	size: {
		type: String,
	},

	readonly: {
		type: Boolean,
	},

	disabled: {
		type: Boolean,
	},

	focused: {
		type: Boolean,
	},

	modelValue: {
		type: String,
	},
	modelModifiers: {
		default: () => ({})
	}
})

const emit = defineEmits(['update:modelValue', 'update:fullValue', 'update:focused', 'update:disabled', 'submit'])

const inputRef = ref(null)

watch(() => props.modelValue, (value) => {
	if (preventUpperStream) {
		// console.log('prevented.')
		preventUpperStream = !preventUpperStream
		return
	}
	_inputValue.value = typeof (value) === 'string' ? value : value.value
})

watch(() => props.focused, (focusedValue) => {
	if (focusedValue)
		inputRef.value?.focus()
	else
		inputRef.value?.blur()
})

const focused = computed({
	get() { props.focused },
	set(value) {
		emit('update:focused', value)
	}
})

const _inputValue = ref('')

let preventUpperStream = false

const inputValue = computed({
	get() {
		return _inputValue.value
	},
	set(value) {
		_inputValue.value = value

		if (props.modelModifiers.trim)
			value = value.trim()

		preventUpperStream = true
		emit('update:modelValue', value)
		emit('update:fullValue', { label: props.label, value })
	}
})

//methods
function select() {
	inputRef.value?.select()
}

//events
function onFocusChange(fv) {
	focused.value = fv
}

defineExpose({
	label: props.label, select
})
</script>