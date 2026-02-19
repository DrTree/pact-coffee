import api from '../../../api'
import * as analytics from '../../../../utils/analytics/analytics'
import { useAuthUser } from '../../../../utils/stores/modules/authUser/index'
import { checkResponse } from '../../error'
import { checkProduct, checkForProductReset } from './basket-utils'
export default {
	async addToBasket({ commit, state, dispatch, getters }, payload) {
    commit('updateTimeOfLastUpdate')
		const userStore = useAuthUser()
		if (payload.toggle) toggleBasket()
		if (!state.isLocked) {
			var item = state.items.filter((product) => checkProduct(product, payload))
			if (item.length === 0) {
				const { callback, ...payload_object } = payload

        const save_sku = payload_object.variant ? payload_object.variant.sku : payload_object.variants[0].sku
        if(!payload_object.variant) payload_object['variant'] = payload_object.variants[0]
        payload_object = {...payload_object, sku: save_sku}
				commit('addToBasket', payload_object)
				analytics.addToBasket(
					state.id,
					getters.total,
					state.items,
					payload_object,
					userStore.isOnline
						? { email: userStore.userEmail, phone: userStore.phoneNumber, external_id: userStore.userId }
						: { email: '', phone: '', external_id: '' }
				)
				if (callback) callback({ type: 'ok' })
			} else {
				dispatch('incrementQuantity', payload)
			}

			// re-check voucher
			dispatch('basketValidations')
		}
	},
	remFromBasket({ commit, state, getters, dispatch }, payload) {
		if (!state.isLocked) {
			commit('remFromBasket', payload)
			// re-check voucher
			dispatch('basketValidations')
			analytics.remFromBasket(state.id, getters.total, state.items, payload)
			if (payload.callback) payload.callback({ type: 'ok' })
		}
	},
	incrementQuantity({ commit, state, getters, dispatch }, payload) {
		if (!state.isLocked) {
			var item = state.items.filter((product) => checkProduct(product, payload))[0]
			const quantity = payload.quantity ? payload.quantity : 1
			if (item.quantity + quantity <= 12) {
				commit('incrementQuantity', payload)
				// re-check voucher
				dispatch('basketValidations')
				analytics.addToBasket(
					state.id,
					getters.total,
					state.items,
					payload,
					userStore.isOnline
						? { email: userStore.userEmail, phone: userStore.phoneNumber, external_id: userStore.userId }
						: { email: '', phone: '', external_id: '' }
				)
				if (payload.callback) payload.callback({ type: 'ok' })
			} else {
				if (payload.callback) payload.callback({ type: 'max_quantity' })
			}
		}
	},
	decrementQuantity({ commit, state, dispatch, getters }, payload) {
		if (!state.isLocked) {
			var item = state.items.filter((product) => checkProduct(product, payload))[0]
			const quantity = payload.quantity ? payload.quantity : 1
			if (item.quantity - quantity > 0) {
				commit('decrementQuantity', payload)
				// re-check voucher
				dispatch('basketValidations')
				analytics.remFromBasket(state.id, getters.total, state.items, payload)
				if (payload.callback) payload.callback({ type: 'ok' })
			} else {
				dispatch('remFromBasket', payload)
			}
		}
	},
	clearBasket({ commit }) {
		commit('clear')
		commit('resetBasketVoucher')
	},
	BasketLock({ state, commit, dispatch, rootGetters }) {
		commit('flipLock', true)
	},
	BasketUnlock({ commit }) {
		commit('flipLock', false)
	},
	resetBasketVoucher({ dispatch, commit }) {
		commit('resetBasketVoucher')
		dispatch('basketValidations')
	},
  resetStoreVoucherBanners({ commit }) {
		commit('resetStoreVoucherBanners')
	},
  setBasketVoucherCode({ commit }, payload){
    commit('setBasketVoucherCode', { code: payload.code })
  },
	async applyBasketVoucher({ commit, getters, dispatch }, payload) {
    const userStore = useAuthUser()
		const response = userStore.isOnline
			? await api.users.validateVoucher({
					code: payload.code,
					body: {
						origin: 'pact_store',
						basket: getters.getSkus,
					},
			  })
			: await api.vouchers.validateVoucher({
					code: payload.code,
					body: {
						origin: 'pact_store',
						basket: getters.getSkus,
					},
			  })
		var result = checkResponse(response)
		if (result.status === 'ok') {
			commit('setBasketVoucher', { code: payload.code, applied: true, ...result.data })
      if(payload.code === getters.voucher_store){
        commit('setStoreVoucherBannersApplied')
      }
		} else {
      dispatch(
        'notifications/showNotification',
        {
          type: 'error',
          message: response.data.message,
          countdown: 15,
        },
        { root: true }
      )
			commit('resetBasketVoucher')
		}
		dispatch('basketIntentUpdate')
		if (payload.callback) payload.callback(result)
	},
	// Doesnt delete existing voucher if this one fails
	async applyBasketVoucherSafe({dispatch, commit, getters }, payload) {
		const response = await api.vouchers.validateVoucher({
			code: payload.code,
			body: {
				origin: 'pact_store',
				basket: getters.getSkus,
			},
		})
		var result = checkResponse(response)
		var info_for_notification = 'error'
		if (result.status === 'ok') {
			commit('setBasketVoucher', { code: payload.code, ...result.data })
			info_for_notification = 'applied'
      if(payload.code === getters.voucher_store_code){
        commit('setStoreVoucherBannersApplied')
      }
		} else {
      if (getters.totalItems !== 0){
        dispatch(
          'notifications/showNotification',
          {
            type: 'error',
            message: response.data.message,
            countdown: 15,
          },
          { root: true }
        )
      }
			if (!getters.voucher_basket_code) commit('resetBasketVoucher')
			// if utm voucher cannot be applied because basket is empty we save it
			if (getters.totalItems === 0) commit('setWaitingVoucher', payload.code)
			info_for_notification = 'waiting'
		}
		dispatch('basketIntentUpdate')
		if (payload.callback)
			payload.callback({ ...result, notification_status: info_for_notification, notification_code: payload.code })
	},
  // Doesnt delete existing voucher if this one fails
	async getStoreVoucherBanners({ commit, getters }, payload) {
		const response = await api.vouchers.getStoreVoucherBanners(payload)
		var result = checkResponse(response)
		if (result.status === 'ok') {
			commit('setStoreVoucherBanners', { code: payload.code, ...result.data })
		} else {
			if (!getters.voucher_store_code) commit('resetStoreVoucherBanners')
		}
		if (payload.callback)
			payload.callback({ ...result, notification_code: payload.code })
	},

	basketValidations({ dispatch, getters, commit }) {
		if (getters.basketHasVoucher && getters.getSkus.length > 0) {
			dispatch('applyBasketVoucher', { code: getters.voucher_basket_code })
		} else if (getters.voucher_store_code !== undefined && getters.voucher_store_code !== '' && getters.getSkus.length > 0 && getters.voucher_store.voucher.valid_for_store) {
			const temp_code = getters.voucher_store_code
			dispatch('applyBasketVoucher', { code: temp_code })
			commit('resetStoreVoucherBanners')
		} else {
			dispatch('basketIntentUpdate')
		}
	},
	async basketIntentUpdate({ getters, dispatch, state }, payload) {
    const reset_basket = checkForProductReset(state.timeOfLastUpdate) || getters.isStale;
    if(reset_basket){
      console.error(getters.isStale ? 'Old basket reset' : 'Force expire basket')
      dispatch('clearBasket')
    }
		if (getters.getSkus.length > 0 && !reset_basket) dispatch('basketIntentUpdateData', payload)
		else if(getters.basket_intent_id !== undefined) dispatch('basketIntentDelete', payload)
	},
  async checkBasketLifeTimeForReset({ getters, dispatch, state }) {
    const reset_basket = checkForProductReset(state.timeOfLastUpdate) || getters.isStale;
    if(reset_basket){
      console.error(getters.isStale ? 'Old basket reset' : 'Force expire basket')
      dispatch('clearBasket')
    }
  },
	async basketIntentDelete({ commit, getters }, payload) {
		const response = await api.shared.deleteBasketIntent({
			payment_intent_id: getters.basket_intent_id,
			origin: 'basket',
		})
		var result = checkResponse(response)
		commit('setBasketIntent', { intent_id: '', client_secret: '' })
		if (payload?.callback) payload.callback(result)
	},
	async basketIntentUpdateData({ commit, getters, dispatch }, payload) {
		const response = await api.shared.checkBasketIntent({
			payment_intent_id: getters.basket_intent_id,
      //TODO: Voucher ISSUE NEED to Fixt this
			voucher_code: getters.voucher_basket_code,
			basket: getters.getSkus,
			origin: 'basket',
		})
		var result = checkResponse(response)
		if (result.status === 'ok') {
			commit('setBasketIntent', {
				intent_id: result.data.payment_intent.id,
				client_secret: response.data.payment_intent.client_secret,
			})
			// add Basket Intent order
			commit('setBasketIntentOrderInfo', result.data?.order )
			//basket stock refresh
			dispatch('basketStockRefresh', response.data.products)
		} else if (getters.getSkus.length <= 0) {
			commit('setBasketIntent', { intent_id: '', client_secret: '' })
		}else{
      // if error from be on basket intent we clear basket
      if(result.data.error.startsWith('voucher')){
        commit('resetBasketVoucher')
      }else{
        dispatch('clearBasket')
      }
			commit('setBasketIntent', { intent_id: '', client_secret: '' })
    }
		if (payload?.callback) payload.callback(result)
	},
	async basketStockRefresh({ state, getters, dispatch }, payload) {
		skuGroupedCopy = getters.getGroupedBySku.map((x) => x)
		payload.forEach((element) => {
			const i = skuGroupedCopy.findIndex((e) => e.sku === element.sku)
			if (element.stock !== null && element.stock < skuGroupedCopy[i].quantity) {
				skuGroupedCopy[i].toBeRemoved = element.stock - skuGroupedCopy[i].quantity
			} else {
				skuGroupedCopy[i].toBeRemoved = 0
			}
		})
		var has_removals = 0
		skuGroupedCopy.forEach((element) => {
			if (element.toBeRemoved !== 0) {
				has_removals += 1
				dispatch('basketItemRemoval', element)
			}
		})

		if (has_removals > 0) {
			var output = 'Some products have been removed'
			//re-check voucher
			if (getters.basketHasVoucher) dispatch('applyBasketVoucher', { code: getters.voucher_basket_code })
			//show notification
			if (has_removals === 1) {
				output =
					'Sorry, an item in your basket is now out of stock and we’ve removed it.'
			} else if (has_removals > 1) {
				output =
					'Sorry, some items in your basket are now out of stock and we’ve removed it.'
			}
			dispatch('notifications/showNotification', { message: output, type: 'ok' }, { root: true })
			dispatch('basketIntentUpdate')
		}
	},
	async basketItemRemoval({ commit, getters, dispatch }, payload) {
		const item = getters.items.find((e) => e.sku === payload.sku)
		const item_action = payload.toBeRemoved + item.quantity
		if (item_action <= 0) {
			//remove from basket
			dispatch('remFromBasket', item)
			if (item_action < 0) {
				dispatch('basketItemRemoval', { ...payload, toBeRemoved: item_action })
			}
		} else {
			commit('decrementQuantity', { ...item, quantity: payload.toBeRemoved * -1 })
		}
	},
	async verifyExpressBasket({ getters, dispatch }, payload) {
		return api.shared.verifyBasket(payload).then((response) => {
			var result = checkResponse(response)
			if (payload.callback) payload.callback(result)
		})
	},
	async expressCheckoutBasket({ commit, getters, dispatch }, payload) {
		return api.shared.expressCheckoutPurchase(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				// cache the items to fill confirmation page order summary easier TODO Remove ?
				var basket_id = getters.basket_id
				var voucher_code = getters.voucher_basket_code
				var cached_items = getters.basketIntentItems ? getters.basketIntentItems : getters.items
				dispatch('clearBasket')
				result.data = { ...result.data, basket_id: basket_id, voucher_code: voucher_code, cached_items: cached_items }
        commit('setbasketConfirmationPageItems', { voucher_code: voucher_code, cached_items: cached_items })
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
	async expressCheckoutBasketUser({ commit, getters, dispatch }, payload) {
		return api.users.checkoutExpressBasket(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				// cache the items to fill confirmation page order summary easier TODO Remove ?
				var basket_id = getters.basket_id
				var voucher_code = getters.voucher_basket_code
				var cached_items = getters.basketIntentItems ? getters.basketIntentItems : getters.items
				dispatch('clearBasket')
				result.data = { ...result.data, basket_id: basket_id, voucher_code: voucher_code, cached_items: cached_items }
        commit('setbasketConfirmationPageItems', { voucher_code: voucher_code, cached_items: cached_items })
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
	async checkoutBasket({ getters, dispatch }, payload) {
		return api.users.checkoutBasket(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				// cache the items to fill confirmation page order summary easier TODO Remove ?
				var cached_items = getters.basketIntentItems ? getters.basketIntentItems : getters.items
				dispatch('clearBasket')
				result.data = { ...result.data, cached_items: cached_items }
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
}
