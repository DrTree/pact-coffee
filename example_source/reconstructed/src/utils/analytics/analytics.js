import * as GTM from './gtm'
import * as DD from './dotdigital'
import * as PP from './paperplanes'

export function addToBasket(basket_id, total, items, prodGA, userData) {
	GTM.addToBasket(prodGA, userData)
	// cart updates
	DD.cartInsight(basket_id, 'CUSTOMER_LOGIN', total, items)
	PP.cartUpdate(items, total)
	GTM.cartInsight(basket_id, total, items)
}

export function remFromBasket(basket_id, total, items, prodGA) {
	GTM.remFromBasket(prodGA)
	// cart updates
	DD.cartInsight(basket_id, 'CUSTOMER_LOGIN', total, items)
	PP.cartUpdate(items, total)
	GTM.cartInsight(basket_id, total, items)
}

export function storePurchase(
	basket_id,
	items,
	order_id,
	total,
	voucher_code,
	email,
	user_id = undefined,
	source = 'Store',
	enhanced_data
) {
	GTM.cartInsight(basket_id, total, items)
	GTM.purchaseStore(items, order_id, total, voucher_code, user_id, source, enhanced_data)
	DD.cartInsight(basket_id, 'ORDER_COMPLETE', total, items)
	PP.cartUpdate(items, total)
	if (voucher_code !== '' && voucher_code !== undefined) discountCode(voucher_code)
	PP.purchaseComplete(order_id, total, voucher_code !== '', email,'store')
}

export function viewItemMain(product, userData) {
	GTM.ViewItem(product, userData)
	PP.productView(product)
}

export function ViewItemListMain(products, name = undefined) {
	GTM.ViewItemList(products, name)
	const promos = []
	products.map((product) => {
		if (product.on_offer) {
			promos.push({
				id: product.offer.promo_event_id,
				name: product.offer.promo_event_title,
				item: product,
			})
		}
	})
	var uniquePromos = []
	promos.forEach(function (item) {
		var i = uniquePromos.findIndex((x) => x.name == item.name)
		if (i <= -1) {
			uniquePromos.push({ id: item.id, name: item.name, items: [item.item] })
		} else {
			uniquePromos[i].items.push(item.item)
		}
	})
	if (uniquePromos.length > 0) {
		GTM.viewPromo(uniquePromos)
	}
}

export function beginCheckout(products) {
	//GTM.beginCheckout(products)
}

export function Identify(email) {
	DD.ddIdentify(email)
	PP.setUserId(email)
	GTM.OmetriaIdentify(email)
	GTM.ImpactIdentify(null, email)
}

export function cartInsight(basket_id, total, items) {
	GTM.cartInsight(basket_id, total, items)
	DD.cartInsight(basket_id, 'CUSTOMER LOGIN', total, items)
	PP.cartUpdate(items, total)
}

// PP specific
export function sendCheckoutSource(source) {
	PP.checkoutInfo(source)
}
export function discountCode(code) {
	PP.discountCode(code)
}
export function sendAddress(email, address, source) {
	PP.sendAddress(address, email, source)
}
export function planCartInsight(total, items) {
	PP.cartUpdate(items, total)
}
export function planPurchase(order_id, total, email, voucher_code) {
	if (voucher_code !== '' && voucher_code !== undefined) discountCode(voucher_code)
	PP.purchaseComplete(order_id, total, voucher_code !== undefined, email,'subscription')
}

export function existingUserIdentify(email,address,source) {
	PP.existingUserIdentify(email,address,source)
}
