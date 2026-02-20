import { computed } from 'vue'
import { useStore } from 'vuex'
// by convention, composable function names start with 'use'
export function useBasketHelpers() {
	// state encapsulated and managed by the composable
	const store = useStore()

	const basket_lock = computed(() => store.getters['basket/isLocked'])
	const original_items = computed(() => store.getters['basket/items'])
	const original_total = computed(() => store.getters['basket/total'])
	// const basket_intent_order_totals = computed(() => store.getters['basket/basketIntentOrderTotalsValue'])
	const original_total_items = computed(() => store.getters['basket/totalItems'])

	const has_voucher = computed(() => store.getters['basket/basketHasVoucher'])
	const voucher_basket = computed(() => store.getters['basket/voucher_basket'])
	const voucher_code = computed(() => store.getters['basket/voucher_basket_code'])

	const basket_skus = computed(() => store.getters['basket/getSkus'])
	const basket_intent_items = computed(() => store.getters['basket/basketIntentItems'])
	const basket_confirmation_page_items = computed(() => store.getters['basket/basketConfirmationPageItems'])

	const has_basket_items = computed(() => {
		return original_total_items.value > 0
	})

	const basket_totals = computed(() => {
		return {
			total:
				has_voucher.value && has_basket_items.value
					? voucher_basket.value.order.total_without_delivery
					: original_total.value,
			subtotal:
				has_voucher.value && has_basket_items.value ? voucher_basket.value.order.subtotal : original_total.value,
			discount: has_voucher.value && has_basket_items.value ? voucher_basket.value.order.discount : 0,
      voucher_discount: has_voucher.value && has_basket_items.value ? voucher_basket.value.order.voucher_discount : 0,
      total_without_delivery: has_voucher.value && has_basket_items.value ? voucher_basket.value.order.total_without_delivery : 0
		}
		// return {
		// 	total: basket_totals_to_use.value && has_basket_items.value
		// 		? basket_totals_to_use.value.total
		// 		: original_total.value,
		// 	subtotal: basket_totals_to_use.value && has_basket_items.value
		// 		? basket_totals_to_use.value.subtotal
		// 		: original_total.value,
		// 	discount: basket_totals_to_use.value && has_basket_items.value ? basket_totals_to_use.value.discount : 0,
		// 	voucher_discount: basket_totals_to_use.value && has_basket_items.value ? basket_totals_to_use.value.voucher_discount : 0,
		// 	total_without_delivery: basket_totals_to_use.value && has_basket_items.value ? basket_totals_to_use.value.total_without_delivery : 0
		// }
	})

	// const basket_totals_to_use = computed(() => {
	// 	return has_voucher.value ? voucher_basket.value.order : basket_intent_order_totals.value
	// })

	const basket_items = computed(() => {
		return basket_intent_items.value ? basket_intent_items.value : original_items.value
	})

	const voucher_items = computed(() => {
		return has_voucher.value ? voucher_basket.value.order.voucher_items : []
	})

	const basket_total_items = computed(() => {
		return voucher_items.value.length + original_total_items.value
	})

	const delivery_type = computed(() => {
		return (
			basket_total_items.value === 1 &&
			basket_items.value[0].quantity === 1 &&
			(basket_skus.value[0].sku.startsWith('BA') || basket_skus.value[0].sku.startsWith('PO'))
		)
	})

	const basket_contains_preorder = computed(() => {
		return basket_items.value.filter((prod) => prod.pre_order).length > 0
	})

	const basket_contains_normal = computed(() => {
		return basket_items.value.filter((prod) => !prod.pre_order).length > 0
	})

	const basket_voucher = computed(() => {
		if(voucher_basket.value === undefined) return ''
		return voucher_basket.value.voucher
	})

	const basketForBackend = computed(() => {
		var skuList = []
		var x
		var y
		for (x in basket_items.value) {
				y = 0
				var prod = basket_items.value[x]
          // Not flexi pack
				if (!prod.sku.startsWith('FP')) {
					while (y < prod.quantity) {
						skuList.push({
							sku: prod.sku,
							weight: prod.weight ? prod.weight : null,
							grind_size: prod.grind_size ? prod.grind_size.toLowerCase().replace(' ', '-').replace('-', '_') : null,
              brew_method: prod.brew_method ? prod.brew_method : null
						})
						y++
					}
				} else {
          // flexi pack
					while (y < prod.quantity) {
						skuList.push({
							sku: prod.sku,
							products: prod.products.map((item) => {
								return {
									...item,
									grind_size: item.grind_size
										? item.grind_size.toLowerCase().replace(' ', '-').replace('-', '_')
										: null,
								}
							}),
						})
						y++
					}
				}
		}
		return skuList
	})

	// DELIVERY
	const free_delivery = computed(() => {
		return basket_totals.value.total >= 15
	})
	const amount_to_free_delivery = computed(() => {
		return free_delivery.value ? 0 : 15 - basket_totals.value.total
	})
	const delivery_charge_value = computed(() => {
		return parseFloat(process.env.DELIVERY_CHARGE)
	})
	// END DELIVERY

	function applyBasketVoucher(payload) {
		store.dispatch('basket/applyBasketVoucher', payload)
	}
	// Doesnt delete existing voucher if this one fails, origin pact_store
	function applyBasketVoucherSafe(payload) {
		store.dispatch('basket/applyBasketVoucherSafe', payload)
	}
	function resetBasketVoucher() {
		store.dispatch('basket/resetBasketVoucher')
	}

  //use this function to merge duplicate vouchers products
  function processVoucherItems(items) {
    var res = items.reduce(
      function (uniques, item) {
        var object = uniques.find((element) => element.variant_sku === item.variant_sku)
        if (object) {
          const index = uniques.indexOf(object)
          object.quantity += 1
          object.discount += parseFloat(item.discount)
          object.price += parseFloat(item.price)
          uniques[index] = object
          return uniques
        } else {
          uniques.push({
            ...item,
            quantity: 1,
            discount: parseFloat(item.discount),
            price: parseFloat(item.price),
          })
          return uniques
        }
      }.bind(this),
      []
    )
    var parents_all = items.filter((item) => !item.parent_item_id)
    var parents_skimmed = res.filter((item) => !item.parent_item_id)
    return parents_skimmed.map(function (parent) {
      var relatives_skus = parents_all
        .filter((other) => other.sku === parent.sku)
        .map((relative) => {
          return relative.id
        })
      return {
        ...parent,
        children: res.filter((item) => relatives_skus.includes(item.parent_item_id)),
      }
    })
  }
	// expose managed state as return value
	return {
		basket_items,
		basket_totals,
		voucher_code,
		has_voucher,
		basket_total_items,
		basket_lock,
		resetBasketVoucher,
		applyBasketVoucher,
		applyBasketVoucherSafe,
		voucher_items,
		delivery_type,
		basket_contains_preorder,
		basket_contains_normal,
		basket_skus,
		basket_voucher,
		free_delivery,
		amount_to_free_delivery,
		delivery_charge_value,
    basketForBackend,
    processVoucherItems,
    basket_confirmation_page_items
	}
}
