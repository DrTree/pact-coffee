import api from '../../../api'
import cookieHandler from '../../../../components/utils/cookies/cookieHandler'
import * as GTM from '../../../analytics/gtm'
import { checkResponse } from '../../error'
const DEFAULT_HOST_B2B = process.env.WEB_URL_B2B ? process.env.WEB_URL_B2B : 'http://127.0.0.1:7000'
export default {
	async login({ commit }, payload) {
		return api.users.login(payload.email, payload.password).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				const user = response.data.user
				const token = response.data.token
				/*if (user.type === 'B2bUser') {
					//is B2B
				} else {
					// is D2C
          window.location.href = `${DEFAULT_HOST_D2C}/login?token=${token.id}`;
				}*/
					cookieHandler.setToken(token.id)
					commit('saveInfo', { ...user, token: token.id })
          GTM.ImpactIdentify(response.data.user.id,response.data.user.email)
			}
      if (payload?.callback) payload.callback(result)
		})
	},
	async logout({ commit }, payload) {
		return api.users.logout().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				cookieHandler.deleteToken()
				commit('resetInfo')
			}
			if (payload?.callback) payload.callback(result)
		})
	},
	async getUserInfo({ commit }, payload) {
		return api.users.getUserInfo().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateInfo', response.data)
			if (payload?.callback) payload.callback(result)
		})
	},
	async getCoffees({ commit }, payload) {
		return api.users.getCoffees().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateCoffees', response.data)
			if (payload?.callback) payload.callback(result)
		})
	},
	async updateUserInfo({ commit }, payload) {
		return api.users.updateUserInfo(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateInfo', payload)
			if (payload?.callback) payload.callback(result)
		})
	},
	async updateUserEmail({ commit }, payload) {
		return api.users.updateUserEmail(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateEmail', payload)
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateUserPassword(_, payload) {
		return api.users.updateUserPassword(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async getCards({ commit, dispatch }, payload) {
		return api.users.getCards().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok'){
        commit('updateCards', response.data)
        if(response.data.length > 0)
          dispatch('getCardAddress',response.data[0].id)
      }
			if (payload?.callback) payload.callback(result)
		})
  },
	async getCardAddress({ commit }, payload) {
		return api.users.getCardAddress(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok'){
        commit('updateCardAddress', response.data)
      }
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateUserCard({ commit }, payload) {
		return api.users.updateUserCard(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateCard', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async getAddresses({ commit }, payload) {
    commit('gettingAddresses', true)
		return api.users.getAddresses().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
        commit('updateAddresses', response.data)
        commit('gettingAddresses', false)
      }
			if (payload?.callback) payload.callback(result)
		})
  },
	async createAddress({ commit }, payload) {
		return api.users.createAddress(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('addAddress', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async editAddress({ commit }, payload) {
		return api.users.editAddress(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('editAddress', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async removeAddress({ commit }, payload) {
		return api.users.deleteAddress(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('removeAddress', payload.id)
			if (payload?.callback) payload.callback(result)
		})
  },
	async getRecurrables({ commit }, payload) {
		return api.users.getRecurrables().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrables', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateRecurrable({ commit }, payload) {
		return api.users.editRecurrable(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
  async updateRecurrableBagSize({ commit }, payload) {
		return api.users.editRecurrableBagSize(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async firstLoadOrdersHistory({commit, getters}) {
		return api.users.getOrdersHistory({page: 0 }).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok' && response.data.receipts.length > 0){
        commit('firstLoadOrdersHistory', response.data)
      }
		})
	},
	async loadOrdersHistory({commit, getters}, payload) {
		return api.users.getOrdersHistory({page: getters.ordersHistoryPage + 1 }).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok' && response.data.receipts.length > 0){
        response.data.receipts.length > 0 && commit('updateOrdersHistory', response.data)
		    if (payload?.callback) payload.callback(result)
      }
		})
  },
	async loadOrders({commit}, payload) {
		return api.users.getOrders().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrders', response.data)
			if (payload?.callback) payload.callback(result)
		})
	},
	async pauseRecurrable({ commit }, payload) {
		return api.users.pauseRecurrable(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrableState', {id: payload.id, state: 'paused', current_order: {}})
			if (payload?.callback) payload.callback(result)
		})
  },
	async unpauseRecurrable({ commit }, payload) {
		return api.users.unpauseRecurrable(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok'){
        var order = response.data.orders.find(order => order.current_state === 'created')
        commit('updateRecurrableState', {id: payload.id, state: 'active', current_order: order})
      }
			if (payload?.callback) payload.callback(result)
		})
  },
  async cancelRecurrable({ commit }, payload) {
		return api.users.cancelRecurrable(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('removeRecurrable', { id: payload.id })
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateOrder({ commit }, payload) {
		return api.users.updateOrder(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrder', response.data.order)
			if (payload?.callback) payload.callback(result)
		})
  },
  async asapOrder({ commit }, payload) {
		return api.users.asapOrder(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrder', response.data.order)
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateOrderItems({ commit }, payload) {
		return api.users.updateOrderItems(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrder', response.data.order)
			if (payload?.callback) payload.callback(result)
		})
  },
	async checkSchedule(_, payload) {
		return api.users.checkSchedule(payload).then((response) => {
			return checkResponse(response)
		})
  },
	async createUserFunnel(_, payload) {
		return api.users.createUserFunnel(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async createUserStore(_, payload) {
		return api.users.createUserStore(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async redeemVoucher({ commit }, payload) {
		return api.users.redeemVoucher(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateInfo', response.data.user)
			if (payload?.callback) payload.callback(result)
		})
  },
	async authValidateVoucher({ commit }, payload) {
		return api.users.validateVoucher(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async createRecurrable(_, payload) {
		return api.users.createRecurrable(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async rateNewCoffee({ commit }, payload) {
		return api.users.rateNewCoffee(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRating', { coffee_id: payload.coffee_id, always_send: false, never_send: payload.never_send, coffee_rating: response.data.coffee_rating } )
			if (payload?.callback) payload.callback(result)
		})
  },
  async editCoffeeRating({ commit }, payload) {
		return api.users.editCoffeeRating(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRating', { coffee_id: payload.coffee_id, always_send: false, never_send: payload.never_send, coffee_rating: response.data.coffee_rating })
			if (payload?.callback) payload.callback(result)
		})
  },
  async rateRecurrables({ commit }, payload) {
		return api.users.rateRecurrables(payload).then((response) => {
			var result = checkResponse(response)
			//if (result.status === 'ok') commit('updateEmail', payload)
			if (payload?.callback) payload.callback(result)
		})
  },
  async whitelist({ commit }, payload) {
		return api.users.whitelist(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('neverSend', payload)
			if (payload?.callback) payload.callback(result)
		})
  },
  async alwaysSend({ commit }, payload) {
		return api.users.alwaysSend(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('alwaysSend', { coffee_id: payload.coffee_id, data: result.data })
			if (payload?.callback) payload.callback(result)
		})
  },
	async sendEmailInvites(_, payload) {
		return api.users.sendEmailInvites(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
  async referralStats(_, payload) {
		return api.users.referralStats().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok' && payload?.callback) payload.callback(result)
		})
  },
	async getOrderAvailableAddons(_, payload) {
		return api.users.orderAvailableProductAddons(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok' && payload?.callback) payload.callback(result)
		})
  },
	async addOrderAddons({commit}, payload) {
		return api.users.addOrderAddons(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateRecurrable', response.data)
				commit('updateOrder', response.data.current_order)
			}
      if (payload?.callback) payload.callback(result)
		})
  },
	async deleteOrderAddon({commit}, payload) {
		return api.users.deleteOrderAddon(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateRecurrable', response.data)
				commit('updateOrder', response.data.current_order)
				if (payload?.callback) payload.callback(result)
			}
		})
  },
	async getRecurrableAvailableAddons(_, payload) {
		return api.users.availableProductAddons(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok' && payload?.callback) payload.callback(result)
		})
  },
	async addAddons({commit}, payload) {
		return api.users.addAddons(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
	async updateAddons({commit}, payload) {
		return api.users.updateAddons(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (result.status === 'ok' && payload?.callback) payload.callback(result)
		})
  },
	async deleteAddon({commit}, payload) {
		return api.users.deleteAddon(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateRecurrable', response.data)
				commit('updateOrder', response.data.current_order)
				if (payload?.callback) payload.callback(result)
			}
		})
  },
	async syncDeleteAddon({commit}, payload) {
		return await api.users.deleteAddon(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateRecurrable', response.data)
				commit('updateOrder', response.data.current_order)
				if (payload?.callback) payload.callback(result)
			}
		})
  },
	skipOrder({ commit }, payload) {
		return api.users.skipOrder({ order_id: payload.id }).then(response => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrder', response.data.order)
			if (payload?.callback) payload.callback(result)
		})
	},
	delayOrder({ commit }, payload) {
		return api.users.delayOrder(payload).then(response => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOrder', response.data.order)
			if (payload?.callback) payload.callback(result)
		})
	},
  csMode({commit}){
    commit('setCsModeOn')
    setTimeout(function () {
      commit('setCsModeOff')
    }, 300000)
  },
	async claimIdentity(_, payload) {
		return api.users.claimIdentity(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
  openSidebar({ commit }) {
		commit('handleAccountSidebar', true)
	},
	closeSidebar({ commit }) {
		commit('handleAccountSidebar', false)
	},
	async expressCheckoutPlan(_, payload) {
		return api.users.checkoutExpressPlan(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
	async getRecurrableCoffees(_, payload) {
		return api.users.getRecurrableCoffees(payload).then((response) => {
			var result = checkResponse(response)
			if (payload && payload.callback) payload.callback(result)
		})
	},
	async submitUserGiftOption(_, payload) {
		return api.users.submitUserGiftOption(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
	},
  async updateCancelPauseFlowPlanAmount({ commit }, payload) {
		return api.users.updateCancelPauseFlowPlanAmount(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
  async updateCancelPauseFlowPlanTier({ commit }, payload) {
		return api.users.updateCancelPauseFlowPlanTier(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateRecurrable', response.data)
			if (payload?.callback) payload.callback(result)
		})
  },
  // Rate Advent Coffees Page
  async loginEUAdventRatings({ commit }, payload) {
		return api.users.loginEUAdventRatings(payload.email, payload.password, payload.opt_in).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				const user = response.data.user
				const token = response.data.token
        const recurrable_state_count = response.data.recurrables
        cookieHandler.setToken(token.id)
        commit('saveInfo', { ...user, token: token.id, recurrable_state_count: recurrable_state_count })
        GTM.AdventsRateLogin(response.data.user.id, response.data.user.email, false)
			}
      if (payload?.callback) payload.callback(result)
		})
	},
  async loginNUAdventRatings({ commit }, payload) {
		return api.users.loginNUAdventRatings(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				const user = response.data.user
				const token = response.data.token
        const recurrable_state_count = response.data.recurrables
        cookieHandler.setToken(token.id)
        commit('saveInfo', { ...user, token: token.id, recurrable_state_count: recurrable_state_count })
        GTM.AdventsRateLogin(response.data.user.id, response.data.user.email, true)
			}
      if (payload?.callback) payload.callback(result)
		})
	},
  async getUserAdventCoffees({ commit }, payload) {
		return api.users.getUserAdventCoffees(payload.day).then((response) => {
			var result = checkResponse(response)
      commit('resetInfoAdventCoffees')
			if (result.status === 'ok') commit('updateAdventCoffees', response.data)
			if (payload?.callback) payload.callback(result)
		})
	},
	async rateAdventCoffee({ commit }, payload) {
		return api.users.rateAdventCoffee(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateAdventCoffeesRating', response.data.coffee_rating)
			if (payload?.callback) payload.callback(result)
		})
  },
  async rateAdventDuplicatePlan({ commit }, payload) {
		return api.users.rateAdventDuplicatePlan(payload).then((response) => {
			var result = checkResponse(response)
			if (payload?.callback) payload.callback(result)
		})
  },
  async getUserRecurrableStateCount({ commit }, payload) {
		return api.users.getUserRecurrableStateCount(payload).then((response) => {
			var result = checkResponse(response)
      if (result.status === 'ok') commit('updateUserRecurrableStateCount', result.data)
			if (payload?.callback) payload.callback(result)
		})
  },
}
