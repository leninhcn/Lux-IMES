function stepsTask(...cbs) {
	const stepsGen = async function* () {
		let val = null

		for (const i in cbs) {
			if (!Object.hasOwnProperty.call(cbs, i)) continue
			const cb = cbs[i]

			if (typeof (cb) !== 'function') continue

			const r = cb(val)

			if (r instanceof Promise) {
				val = await r
			}
			else {
				val = r
			}
			yield
		}
	}

	const ag = {
		stateMachine: {
			//参数
			cbs: [],
			//局部变量-提升
			lastVal: null,
			//暂存Promise结果，处理Promise<any>没有value属性的问题
			pMiddleR: null,

			//使用迭代器情况下，提升迭代器
			nextIterKey: 0,

			//状态机的状态
			curStep: 0,
			//用于通知异步方法的Promise是否完成
			resolve: null,
			next() {
				if (this.nextIterKey == this.cbs.length)
					this.curStep = 2

				if (this.curStep == 0) {
					for (let i = this.nextIterKey; i < this.cbs.length; ++i) {
						if (!Object.hasOwnProperty.call(this.cbs, i)) continue
						const cb = this.cbs[i]

						if (typeof (cb) !== 'function') continue

						const r = cb(this.lastVal)

						this.nextIterKey = ++i

						if (r instanceof Promise) {
							this.curStep = 1

							r.then(val => {
								this.pMiddleR = val
								this.next()
							})
							return
						}
						else {
							this.curStep = 2
							this.lastVal = r
							break
						}
					}
				}

				if (this.curStep == 1) {
					this.lastVal = this.pMiddleR//read promise<any> result value, continue from `await` suspension
					this.curStep++
				}

				if (this.curStep == 2) {
					this.resolve({ value: null, done: this.nextIterKey == this.cbs.length })
				}

				this.curStep = 0
			},
		},
		next() {
			return new Promise((resolve) => {
				this.stateMachine.resolve = resolve
				this.stateMachine.next()
			})
		},
		init(cbs) {
			this.stateMachine.cbs = cbs
			this.stateMachine.nextIterKey = 0
		}
	}

	return _cancelable(stepsGen())
}

function _cancelable(generator) {
	const icancel = {
		canceled: false
	}
	const task = {
		start() { f(generator) },
		cancel() {
			icancel.canceled = true
		},
		get canceled() { return icancel.canceled }
	}

	async function f(ag) {
		while (true) {
			const stepR = await ag.next()
			if (stepR.done) break
			if (icancel.canceled) {
				break
			}
		}
	}

	return task
}

export { stepsTask }