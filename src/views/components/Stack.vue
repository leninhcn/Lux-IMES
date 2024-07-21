<script>
import { cloneVNode } from 'vue'

//author: hwl
function render(props, slots) {
	let vnodes = slots.default ? slots.default() : []
	const size = props.size
	const isHorizontal = props.horizontal

	const getGap = () => {
		let val = 0.5
		switch (size) {
			case 'small': val = 0.25; break
			case 'large': val = 1; break
			case '0': val = 0; break
		}

		return val + 'rem'
	}

	const gapVal = getGap()

	const children = []

	if (vnodes.length == 1 && vnodes[0].type.description) {
		vnodes = vnodes[0].children ?? []
	}

	vnodes.forEach((node, index) => {
		// console.log(index)

		const isStaticNode = (node.type && typeof (node.type) === 'string')
		if (isStaticNode) {
			node = cloneVNode(node)
			node.props = { ...node.props }
		}

		const nodeProps = node.props

		let itemClasses = []
		let itemNoGap = false
		const itemStyles = {}

		function getDStore() {
			let dstore = node.dstore
			if (!dstore) node.dstore = dstore = {}
			return dstore
		}

		if (nodeProps) {
			let flexProp = null

			if (nodeProps['item-flex'] && (flexProp = nodeProps['item-flex'], typeof (flexProp) === 'string')) {
				delete nodeProps['item-flex']
				getDStore().itemFlex = flexProp
				itemStyles.flex = flexProp
			}
			else if (node.dstore && (flexProp = node.dstore.itemFlex)) {
				itemStyles.flex = flexProp
			}

			let classList = null

			if (nodeProps['item-class'] && (classList = nodeProps['item-class'], typeof (classList) === 'string')) {
				classList = classList.split(' ')
				delete nodeProps['item-class']
				getDStore().itemClassList = classList
				itemClasses = itemClasses.concat(classList)
			}
			else if (node.dstore && (classList = node.dstore.itemClassList)) {
				itemClasses = itemClasses.concat(classList)
			}

			let noGapRaw = false
			if (Object.hasOwnProperty.call(nodeProps, 'item-nogap')) {
				noGapRaw = nodeProps['item-nogap']
				switch (typeof (noGapRaw)) {
					case 'boolean': itemNoGap = noGapRaw; break
					case 'string': itemNoGap = noGapRaw === '' || noGapRaw === 'true'
				}

				delete nodeProps['item-nogap']
				getDStore().itemNoGap = itemNoGap
			}
			else if (node.dstore && node.dstore.itemNoGap) {
				itemNoGap = true
			}
		}

		const gap = (!itemNoGap && index != vnodes.length - 1) ? gapVal : 0
		if (isHorizontal) {
			itemClasses.push('stack-h-item-c')
			if (gap != 0) itemStyles.marginRight = gap
		}
		else {
			itemClasses.push('stack-item-c')
			if (gap != 0) itemStyles.marginBottom = gap
		}

		const stackItemVnode = h('div', { class: itemClasses, style: itemStyles }, node)
		children.push(stackItemVnode)
	});

	return h('div', { class: isHorizontal ? 'stack-h-c' : `stack-c` }, children)
}

export default defineComponent({
	props: {
		size: {
			type: String,
			default: 'default'
		},
		horizontal: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { slots }) {
		return () => render(props, slots)
	}
})

</script>

<style>
.stack-c {
	display: flex;
	flex-direction: column;
}

.stack-item-c {
	display: flex;
	flex-direction: column;
	min-width: 100%;
}

.stack-item-c>* {
	flex: 1;
}

.stack-h-c {
	display: flex;
	flex-direction: row;
}

.stack-h-item-c {
	display: flex;
}

.stack-h-item-c>* {
	flex: 1;
}
</style>