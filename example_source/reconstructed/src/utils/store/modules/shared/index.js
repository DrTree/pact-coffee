import api from '../../../api'
import { checkResponse } from '../../error'
export const shared = {
	namespaced: true,
	state: {
		viper_status_ok: true,
		viper_status_check_timestamp: undefined,
	},
	actions: {
		async resetPassword(_, payload) {
			return api.shared.resetPassword(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async setNewPassword(_, payload) {
			return api.shared.setNewPassword(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async subscribeNewsletter(_, payload) {
			return api.shared.subscribeNewsletter(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async checkDeliveryDate(_, payload) {
			return api.shared.checkDeliveryDate(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async quickAction(_, payload) {
			return api.shared.executeCommand(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async purchaseGift(_, payload) {
			return api.gifts.purchaseGift(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async fetchGiftInfo(_, payload) {
			return api.gifts.redeemGiftInfo(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async redeemGift(_, payload) {
			return api.gifts.redeemGift(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async submitIdentity(_, payload) {
			return api.shared.submitIdentity(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async updateIdentity(_, payload) {
			return api.shared.updateIdentity(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async claimIdentity(_, payload) {
			if (!payload.source) payload.source = 'claim-account'
			return api.shared.claimIdentity(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async claimBrewBox(_, payload) {
			return api.shared.claimBrewBox(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async validateBrewBox(_, payload) {
			return api.shared.validateBrewBox(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async shareBrewBox(_, payload) {
			return api.shared.shareBrewBox(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async userSources(_, payload) {
			return api.shared.userSources().then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async claimAccount(_, payload) {
			return api.shared.claimAccount(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async submitGiftOption(_, payload) {
			return api.shared.submitGiftOption(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async getJumper(_, payload) {
			return api.shared.getJumper(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async pingViper({ dispatch, commit, getters }) {
			if (Date.now() - getters.viper_check_timestamp > 30000 || getters.viper_check_timestamp === undefined) {
				commit('refreshViperCheckTimestamp')
				return api.shared.pingViper().then((response) => {
					if (!response) {
						commit('viperIsDown')
						dispatch(
							'notifications/showNotification',
							{
								type: 'error',
								message: 'We are having troubles contacting our services, please re-try.',
								countdown: 30,
							},
							{ root: true }
						)
					} else {
						commit('viperIsUp')
					}
				})
			} else {
				dispatch(
					'notifications/showNotification',
					{
						type: 'error',
						message: 'We are having troubles contacting our services, please re-try.',
						countdown: 30,
					},
					{ root: true }
				)
			}
		},
		async checkBasketIntent(_, payload) {
			return api.shared.checkBasketIntent(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async deleteBasketIntent(_, payload) {
			return api.shared.deleteBasketIntent(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async checkPlanIntent(_, payload) {
			return api.shared.checkPlanIntent(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async expressCheckoutPlan(_, payload) {
			return api.shared.expressCheckoutPlan(payload).then((response) => {
				var result = checkResponse(response)
				if (payload?.callback) payload.callback(result)
			})
		},
		async getBasketConfirmation(_, payload) {
			return api.shared.getBasketConfirmation(payload).then((response) => {
				var result = checkResponse(response)
				if (payload?.callback) payload.callback(result)
			})
		},
		async checkGiftIntent(_, payload) {
			return api.shared.checkGiftIntent(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async expressCheckoutPurchaseGift(_, payload) {
			return api.gifts.expressCheckoutPurchaseGift(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async verifyExpressGift(_, payload) {
			return api.shared.verifyGiftPurchase(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
	},
	mutations: {
		refreshViperCheckTimestamp(state) {
			state.viper_status_check_timestamp = Date.now()
		},
		viperIsUp(state) {
			state.viper_status_ok = true
		},
		viperIsDown(state) {
			state.viper_status_ok = false
		},
	},
	getters: {
		viper_status(state) {
			return state.viper_status_ok
		},
		viper_check_timestamp(state) {
			return state.viper_status_check_timestamp
		},
	},
}
