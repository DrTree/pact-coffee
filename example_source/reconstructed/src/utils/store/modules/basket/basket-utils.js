export function checkProduct(product, payload) {
	const { ...payload_object } = payload
	const save_sku = payload_object.variant ? payload_object.variant.sku : payload_object.variants[0].sku
	return (
		(product.sku === save_sku && product.grind_size === payload.grind_size && product.brew_method === payload.brew_method && !save_sku.startsWith('FP')) ||
		(product.sku === save_sku &&
			product.grind_size === payload.grind_size &&
			product.brew_method === payload.brew_method &&
			product.sku.startsWith('FP') &&
			save_sku.startsWith('FP') &&
			JSON.stringify(product.products) === JSON.stringify(payload.products))
	)
}

const RESET_BASKET_TIME = process.env.RESET_BASKET_TIME ? process.env.RESET_BASKET_TIME : ''

export function checkForProductReset(time) {
	if (RESET_BASKET_TIME === '') return false
	return time < parseInt(RESET_BASKET_TIME)
}
