import { noAuthReqGet } from './generalRequest'

export default {
	async getAllProducts() {
		return noAuthReqGet('/products', 'get', {})
	},
  // TODO: D2C 2505: Price Increase
	async getCoffeePlans(payload) {
		return noAuthReqGet('/coffee_plans/d2c', 'get', { available: payload && payload?.available ? payload.available : 'true'})
	},
  async getFunnelCoffees(payload) {
		return noAuthReqGet('/coffee_plans/d2c/funnel_coffees', 'get', payload)
	},
	async getProductById(payload) {
		return noAuthReqGet(`/products/${payload.id}`, 'get', {})
	},
	async getPlpProducts(payload) {
		return noAuthReqGet('/products', 'get', payload.query)
	},
  async getNewPlpProducts(payload) {
		return noAuthReqGet('/products/plp', 'get', payload.query)
	},
  async getBasketAddons() {
		return noAuthReqGet('/products/basket_addons', 'get', {})
	},
	async getSlugProduct(payload) {
		return noAuthReqGet(`/products/${payload.slug}`, 'get', payload.query ? payload.query : {} )
	},
  async getQuizFlexiPacks(payload) {
    return noAuthReqGet('/products/coffee_quiz', 'get', payload)
  }
}


