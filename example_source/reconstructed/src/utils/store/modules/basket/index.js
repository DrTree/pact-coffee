import mutations from './basket-mutations'
import actions from './basket-actions'
const ttf = process.env.TIME_TO_REFRESH_BASKET ? process.env.TIME_TO_REFRESH_BASKET : 604800000

export const basket = {
	namespaced: true,
	state: {
		id: undefined,
		items: [],
		isLocked: false,
		timeOfLastUpdate: undefined,
		voucher_active: false,
		voucher_basket: undefined,
		voucher_store: undefined,
		basket_intent_id: undefined,
		basket_intent_client_secret: undefined,
		basket_intent_order: undefined,
    basket_confirmation_items: undefined
	},
	getters: {
		basket_id(state) {
			return state.id
		},
		total(state) {
			var sum = 0
			for (x in state.items) {
				const picked_variant = state.items[x].variant
				if (picked_variant.on_offer) sum += picked_variant.offer.offer_price * state.items[x].quantity
				else sum += picked_variant.price * state.items[x].quantity
			}
			return sum
		},
		basketIntentItems(state) {
			return state.items.map((item) => {
				var payload_items = state.basket_intent_order?.items.find((basket_item) => (item.sku === basket_item.sku) || (item.sku === basket_item.variant_sku))
				return {
					...item,
					intent_product: payload_items,
				}
			})
		},
		basketConfirmationPageItems(state) {
      return {
        ...state.basket_confirmation_items,
        voucher_items: state.basket_intent_order?.voucher_items
      }
		},
		basketIntentOrderTotalsValue(state) {
			return {
				balance_discount: state.basket_intent_order.balance_discount,
				delivery_charge: state.basket_intent_order.delivery_charge,
				discount: state.basket_intent_order.discount,
				employee_discount: state.basket_intent_order.employee_discount,
				pioneer_discount: state.basket_intent_order.pioneer_discount,
				subtotal: state.basket_intent_order.subtotal,
				total: state.basket_intent_order.total,
				total_in_cents: state.basket_intent_order.total_in_cents,
				total_without_delivery: state.basket_intent_order.total_without_delivery,
				voucher_discount: state.basket_intent_order.voucher_discount
			}
		},
		items(state) {
			return state.items
		},
		totalItems(state) {
			var result = 0
			state.items.forEach((item) => (result += item.quantity))
			return result
		},
		isLocked(state) {
			return state.isLocked
		},
		getSkus(state) {
			var skus = []
			if (state && state.items)
				state.items.forEach((element) => {
					var i
					for (i = 0; i < element.quantity; i++) {
						if (element.sku.startsWith('FP'))
							skus.push({
								sku: element.sku,
								weight: element.weight ? element.weight : null,
								grind_size: element.grind_size ? element.grind_size.replace('-', '_').replace(' ', '_') : null,
								pre_order: element.pre_order,
								products: element.products,
							})
						else
							skus.push({
								sku: element.sku,
								weight: element.weight ? element.weight : null,
								grind_size: element.grind_size ? element.grind_size.replace('-', '_').replace(' ', '_') : null,
								pre_order: element.pre_order,
                brew_method: element.brew_method ? element.brew_method : null
							})
					}
				})
			return skus
		},
		getGroupedBySku(state) {
			var skus = []
			if (state && state.items)
				state.items.forEach((element) => {
					const i = skus.findIndex((e) => e.sku === element.sku)
					if (i > -1) {
						skus[i].quantity += element.quantity
					} else {
						skus.push({
							sku: element.sku,
							quantity: element.quantity,
						})
					}
				})
			return skus
		},
		isStale(state) {
			return Date.now() - state.timeOfLastUpdate > ttf
		},
		basketHasVoucher(state) {
			return state.voucher_active
		},
    storeHasVoucher(state) {
			return state.voucher_store_active
		},
		voucher_basket(state) {
			return state.voucher_basket
		},
    voucher_store(state) {
			return state.voucher_store
		},
    voucher_applied(state) {
			return state.voucher_applied
		},
    voucher_store_applied(state) {
			return state.voucher_store_applied
		},
		voucher_basket_code(state) {
			return state.voucher_basket?.code ? state.voucher_basket.code : state.voucher_basket_code ? state.voucher_basket_code : ''
		},
    voucher_store_code(state) {
			return state.voucher_store?.code || ''
		},
		// voucher_basket_temp_code(state) {
		// 	return state.voucher_temp
		// },
		basket_intent_id(state) {
			return state.basket_intent_id
		},
		basket_intent_client_secret(state) {
			return state.basket_intent_client_secret
		},
	},
	mutations,
	actions,
}
