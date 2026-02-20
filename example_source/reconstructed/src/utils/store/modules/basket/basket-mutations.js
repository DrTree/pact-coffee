import { checkProduct } from './basket-utils'
import { mixingGenerateUUID } from '../../../../components/utils/mixins/generateUUID'
export default {
	addToBasket(state, payload) {
		// analytics
		const prodGA = {
			id: payload.sku,
			sku: payload.sku,
			name: payload.name,
			category: payload.category !== undefined ? payload.category : payload.coffeeType,
			price: payload.on_offer ? payload.offer.offer_price : payload.price,
			decaf: payload.decaf ? payload.decaf : false,
			quantity: payload.quantity,
			list_position: payload.list_position ? payload.list_position : undefined,
			list_name: payload.list_name ? payload.list_name : undefined,
		}
		if (state.id === undefined) state.id = mixingGenerateUUID.methods.create_UUID()
		state.items.push(payload)
	},
	incrementQuantity(state, payload) {
		var item = state.items.find((product) => checkProduct(product, payload))
		const quantity = payload.quantity ? payload.quantity : 1
		const index = state.items.indexOf(item)
		state.items[index] = { ...item, quantity: item.quantity + quantity }
	},
	decrementQuantity(state, payload) {
		var item = state.items.find((product) => checkProduct(product, payload))
		const quantity = payload.quantity ? payload.quantity : 1
		const index = state.items.indexOf(item)
		state.items[index] = { ...item, quantity: item.quantity - quantity }
	},
	remFromBasket(state, payload) {
		var item = state.items.find((product) => checkProduct(product, payload))
		const index = state.items.indexOf(item)
		state.items.splice(index, 1)
		if (state.items.length === 0) state.id = undefined
	},
	clear(state) {
		state.items = []
		state.isLocked = false
		state.id = undefined
		state.voucher_active = false
    state.voucher_applied = false
		state.voucher_basket = undefined
    state.voucher_store_active = false
		state.voucher_store = undefined
    state.voucher_store_applied = false
    state.basket_intent_id = undefined
    state.basket_intent_client_secret = undefined
    state.timeOfLastUpdate = Date.now()
	},
	flipLock(state, payload) {
		state.isLocked = payload
	},
	setBasketVoucher(state, payload) {
		state.voucher_basket_code = payload.code
		state.voucher_active = true
		state.voucher_basket = payload
    state.voucher_applied = payload.applied
	},
  setBasketVoucherCode(state, payload) {
		state.voucher_basket_code = payload.code
		state.voucher_active = false
    state.voucher_applied = false
	},
  setStoreVoucherBanners(state, payload) {
		state.voucher_store_active = true
		state.voucher_store = payload
    state.voucher_store_applied = false
	},
  setStoreVoucherBannersApplied(state) {
    state.voucher_store_applied = true
	},
	resetBasketVoucher(state) {
		state.voucher_active = false
		state.voucher_basket = undefined
    state.voucher_applied = false
		state.voucher_basket_code = undefined
	},
  resetStoreVoucherBanners(state) {
		state.voucher_store_active = false
		state.voucher_store = undefined
    state.voucher_store_applied = false
	},
	setWaitingVoucher(state, payload) {
		state.voucher_temp = payload
	},
  setBasketIntent(state,payload){
    state.basket_intent_id = payload.intent_id
    state.basket_intent_client_secret = payload.client_secret
    state.timeOfLastUpdate = Date.now()
  },
	setBasketIntentOrderInfo(state, payload) {
		state.basket_intent_order = payload
	},
	setbasketConfirmationPageItems(state, payload) {
		state.basket_confirmation_items = payload
	},
  updateTimeOfLastUpdate(state){
    state.timeOfLastUpdate = Date.now()
  },
}
