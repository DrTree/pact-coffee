export const notifications = {
	namespaced: true,
	state: {
		notificationMessage: '',
		maxTime: 7,
		countdown: 0,
		type: '',
		lock: false,
		zindex: 101,
	},
	getters: {
		notificationMessage: (state) => {
			return state.notificationMessage
		},
		maxTime: (state) => {
			return state.maxTime
		},
		countdown: (state) => {
			return state.countdown
		},
		type: (state) => {
			return state.type
		},
		lock: (state) => {
			return state.lock
		},
		zindex: (state) => {
			return state.zindex
		},
	},
	mutations: {
		setNotification(state, payload) {
			state.type = payload.type
			state.notificationMessage = payload.message
			state.countdown = payload.countdown
			state.zindex = payload.zindex
		},
		hideNotification(state) {
			state.countdown = 0
		},
		decreaseCountdown(state) {
			state.countdown = state.countdown > 0 ?  state.countdown - 1 : 0
		},
		setLock(state, lock) {
			state.lock = lock
		},
	},
	actions: {
		showNotification({ commit,dispatch, getters }, payload) {
      const maxTime = payload.countdown ? payload.countdown : getters.maxTime
			commit('setNotification', {
				type: payload.type,
				message: payload.message,
				countdown: maxTime,
				zindex: payload.zindex ? payload.zindex : 120 // window.innerWidth < 992 ? 120 : 101
			})
      if(!payload.permanent_banner)
			  dispatch('startCountdown')
		},
    startCountdown({commit,getters}){
    var max = getters.countdown
			//start countdown
			for (let i = 1; i <= max; i++) {
				setTimeout(function () {
					commit('decreaseCountdown')
				}, i * 1000)
			}
    }
	},
}
