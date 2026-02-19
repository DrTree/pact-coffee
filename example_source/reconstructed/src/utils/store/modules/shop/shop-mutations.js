export default {
	resetInfo(state) {
		state.plans = []
		state.products = []
		state.timeOfLastCache = undefined
	},
  resetPlpProductsInfo(state) {
		state.plp_products = []
	},
	updateProductsForced(state, payload) {
		state.products = payload
		state.timeOfLastCache = state.isUpdatingAge = Date.now()
		state.isUpdating = false
	},
	updateProductsRefresh(state, payload) {
		payload.forEach((product) => {
			const index = state.products.findIndex((prod) => prod.sku === product.sku)
			if (index !== -1) {
				state.products[index] = product
			} else {
				state.products.push(product)
			}
		})
	},
  updatePlpProductsRefresh(state, payload) {
		payload.forEach((product) => {
			const index = state.plp_products.findIndex((prod) => prod.sku === product.sku)
			if (index !== -1) {
				state.plp_products[index] = product
			} else {
				state.plp_products.push(product)
			}
		})
	},
  //Coffee Range Carousel Products
  updateOffersProductsRefresh(state, payload) {
		payload.forEach((product) => {
			const index = state.offers_products.findIndex((prod) => prod.sku === product.sku)
			if (index !== -1) {
				state.offers_products[index] = product
			} else {
				state.offers_products.push(product)
			}
		})
	},
  updateVoucherPlpProductsRefresh(state, payload) {
		payload.forEach((product) => {
			const index = state.voucher_products.findIndex((prod) => prod.sku === product.sku)
			if (index !== -1) {
				state.voucher_products[index] = product
			} else {
				state.voucher_products.push(product)
			}
		})
	},
  updateBasketAddons(state, payload) {
    state.basket_addons = payload
	},
	updatePlans(state, payload) {
		state.coffee_plans = payload
    state.timeOfLastCachePlans = state.isUpdatingAgePlans = Date.now()
		state.isUpdatingPlans = false
	},
  updateAccountPlans(state, payload) {
		state.coffee_plans = payload
	},
	setStartUpdating(state) {
		state.isUpdating = true
		state.isUpdatingAge = Date.now()
	},
	setStartUpdatingPlans(state) {
		state.isUpdatingPlans = true
		state.isUpdatingAgePlans = Date.now()
	},
  updateFunnelCoffeesRange(state, payload) {
		state.coffees_range = payload
	},
  updateQuizFlexiPacks(state, payload) {
		state.quiz_flexi_packs = payload
	},
}
