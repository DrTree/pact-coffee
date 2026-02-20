import api from '../../../api'
//import cookieHandler from '../../../../components/utils/cookies/cookieHandler'
const time_to_cache_products = process.env.TIME_TO_CACHE ? process.env.TIME_TO_CACHE : 150000
const time_to_cache_plans = process.env.TIME_TO_CACHE ? process.env.TIME_TO_CACHE : 150000
import { checkResponse } from '../../error'
export default {
	async getCoffeePlans({ commit, dispatch, getters }, payload) {
		// If cache is old AND we have previously fetched it
		// OR
		// We havent fetched AND started fetching
		// OR
		// We have started fetching 3s ago and dont have response
    // TODO: D2C 2505: Price Increase
    var is_account = payload && payload.is_account ? payload.is_account : false
    if(is_account === false){
      if (
        (Date.now() - getters.cache_age_plans > time_to_cache_plans &&
          getters.cache_age_plans === getters.updating_timestamp_plans) ||
        (getters.cache_age_plans === undefined && getters.updating_timestamp_plans === undefined) ||
        (Date.now() - getters.updating_timestamp_plans > 3000 &&
          getters.cache_age_plans !== getters.updating_timestamp_plans)
      ) {
        commit('setStartUpdatingPlans')
        return api.shop.getCoffeePlans(payload).then((response) => {
          var result = checkResponse(response)
          if (result.status === 'ok') commit('updatePlans', response.data)
          if (payload && payload.callback) payload.callback(result)
        })
      } else {
        if (getters.is_updating_plans) {
          setTimeout(() => {
            dispatch('getCoffeePlans', payload)
          }, 500)
        } else if (payload && payload.callback) payload.callback()
      }
    }else{
      return api.shop.getCoffeePlans(payload).then((response) => {
        var result = checkResponse(response)
        if (result.status === 'ok') commit('updateAccountPlans', response.data)
      })
    }
	},
	async getAllProducts({ commit, dispatch, getters }, payload) {
		// If cache is old AND we have previously fetched it
		// OR
		// We havent fetched AND started fetching
		// OR
		// We have started fetching 5s ago and dont have response
		if (
			(Date.now() - getters.cache_age > time_to_cache_products && getters.cache_age === getters.updating_timestamp) ||
			(getters.cache_age === undefined && getters.updating_timestamp === undefined) ||
			(Date.now() - getters.updating_timestamp > 5000 && getters.cache_age !== getters.updating_timestamp)
		) {
			commit('setStartUpdating')
			return api.shop.getAllProducts().then((response) => {
				var result = checkResponse(response)
				if (result.status === 'ok') commit('updateProductsForced', response.data)
				if (payload && payload.callback) payload.callback(result)
			})
		} else {
			if (getters.is_updating) {
				setTimeout(() => {
					dispatch('getAllProducts', payload)
				}, 500)
			} else if (payload && payload.callback) payload.callback()
		}
	},
	simpleCallbackAux(_, payload) {
		if (payload && payload.callback) payload.callback()
	},
	async getPlpProducts({ commit }, payload) {
		return api.shop.getPlpProducts(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateProductsRefresh', response.data)
			if (payload && payload.callback) payload.callback(result)
		})
	},
  //Coffee Range Carousel Products
  async getOffersProducts({ commit }, payload) {
		return api.shop.getNewPlpProducts(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateOffersProductsRefresh', response.data)
			if (payload && payload.callback) payload.callback(result)
		})
	},
  async getNewPlpProducts({ commit }, payload) {
		return api.shop.getNewPlpProducts(payload).then((response) => {
			var result = checkResponse(response)
      // always reset before fetch to have the most accurate data
      commit('resetPlpProductsInfo')
			if (result.status === 'ok') {
				commit('updatePlpProductsRefresh', response.data)
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
  async getVoucherPlpProducts({ commit }, payload) {
		return api.shop.getNewPlpProducts(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateVoucherPlpProductsRefresh', response.data)
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
  async resetPlpProductsInfo({ commit }){
    commit('resetPlpProductsInfo')
  },
	async getPdpProduct({ commit }, payload) {
		return api.shop.getSlugProduct(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
				commit('updateProductsRefresh', [response.data])
			}
			if (payload && payload.callback) payload.callback(result)
		})
	},
	async getFunnelCoffeesRange({ commit }, payload) {
		return api.shop.getFunnelCoffees(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateFunnelCoffeesRange', response.data)
			if (payload && payload.callback) payload.callback(result)
		})
	},
  async getCoffeeQuizFlexiPacks({ commit }, payload) {
		return api.shop.getQuizFlexiPacks(payload).then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateQuizFlexiPacks', response.data)
			if (payload && payload.callback) payload.callback(result)
		})
	},
  async getBasketAddons({ commit }, payload) {
		return api.shop.getBasketAddons().then((response) => {
			var result = checkResponse(response)
			if (result.status === 'ok') commit('updateBasketAddons', response.data)
			if (payload && payload.callback) payload.callback(result)
		})
	},
}
