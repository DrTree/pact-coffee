import mutations from './shop-mutations'
import actions from './shop-actions'

export const shop = {
	namespaced: true,
	state: {
		products: [],
    plp_products:[],
    offers_products:[],
    voucher_products:[],
    basket_addons: [],
		coffee_plans: [],
		timeOfLastCache: undefined,
		timeOfLastCachePlans: undefined,
		isUpdating: false,
		isUpdatingPlans: false,
		isUpdatingAge: undefined,
		isUpdatingAgePlans: undefined,
    coffees_range: [],
    quiz_flexi_packs: []
	},
	getters: {
		allShopProducts(state) {
			return state.products.filter((product) => product.visible)
		},
		coffee_plans(state) {
			return state.coffee_plans
		},
		allAvailableCoffees(state) {
			return state.products.filter(
				(product) =>
					(product.category === 'Coffees' || product.category === 'Coffee Pods') &&
					product.visible
			)
		},
    getAllPlpProducts(state) {
			return state.plp_products.filter((product) => product.visible)
		},
    //Coffee Range Carousel Products
    getAllOffersProducts(state) {
			return state.offers_products.filter((product) => product.visible)
		},
    getAllVoucherPlpProducts(state) {
			return state.voucher_products.filter((product) => product.visible)
		},
		getHardwareProducts(_, getters) {
			return getters.allShopProducts.filter(
				(product) => product.category !== 'Coffees' && product.category !== 'Coffee Pods'
			)
		},
		getCoffeeBags(_, getters) {
			return getters.allAvailableCoffees.filter((product) => product.product_type === 'bag')
		},
		getCoffeePods(_, getters) {
			return getters.allAvailableCoffees.filter((product) => product.product_type === 'pod')
		},
		podPlanAddons(state) {
			return state.products.filter((product) => product.variants.filter( variant => variant.pod_plan_addon).length > 0)
		},
    bagPlanAddons(state) {
			return state.products.filter((product) => product.variants.filter( variant => variant.bag_plan_addon).length > 0)
		},
		getProductBySlug: (state) => (slug) => {
			var special_xmas_products_slugs = [
        // Christmas PDPs
        'christmas-coffee-filter',
        'christmas-coffee-espresso',
        'christmas-coffee-decaf',
        'christmas-coffee-1kg',
        'christmas-espresso-1kg',
        'christmas-decaf-1kg',
        'christmas-coffee-twin-pack',
        'coffee-selection-box-coffee-decaf',
        'coffee-selection-box-coffee-filter',
        'coffee-selection-box-coffee-espresso'
      ]
      if(special_xmas_products_slugs.includes(slug)){
        var products_list = state.products.filter((product) => product.slug === slug)
        return products_list.find((prod) => prod.flexi_pack_type && prod.flexi_pack_type !== null)
      } else return state.products.find((product) => product.slug === slug)
		},
    getPlpProductBySlug: (state) => (slug) => {
			return state.plp_products.find((product) => product.slug === slug)
		},
		getProductById: (state) => (id) => {
			return state.products.find((product) => product.product_id === id)
		},
		getProductBySku: (state) => (sku) => {
			return state.products.find((product) => product.sku === sku)
		},
		getProductByVariantSku: (state) => (sku) => {
			return state.products.find((product) => product.variants.filter( variant => variant.sku === sku).length > 0 )
		},
		getCoffeePlanBySku: (state) => (sku) => {
			return state.coffee_plans.find((plan) => plan.sku === sku)
		},
		// Todo: D2C 2505: Price Increase
		getGiftsCoffeePlanBySku: (state) => (sku) => {
			return state.coffee_plans.find((plan) => plan.old_sku === sku)
		},
		getCoffeePlanById: (state) => (id) => {
			return state.coffee_plans.find((plan) => plan.id === id)
		},
		getCoffeesPlansByPlanTier: (state) => (planTier) => {
			return state.coffee_plans.filter((plan) => plan.plan === planTier)
		},
		getCoffeesByPlanId: (state) => (id) => {
			return state.products.filter(
				(product) =>
					(product.category === 'Coffees' || product.category === 'Coffee Pods') &&
					product?.coffee?.coffee_plan_ids && product.coffee.coffee_plan_ids.includes(id)
			)
		},
		getCoffeesByPlanSku: (state) => (sku) => {
			const plan = state.coffee_plans.find((plan) => plan.sku === sku)
			return state.products.filter(
				(product) =>
					(product.category === 'Coffees' || product.category === 'Coffee Pods') &&
					product?.coffee?.coffee_plan_ids && product.coffee.coffee_plan_ids.includes(plan.id)
			)
		},
		basket_addons(state) {
			return state.basket_addons
		},
		cache_age(state) {
			return state.timeOfLastCache
		},
		cache_age_plans(state) {
			return state.timeOfLastCachePlans
		},
		updating_timestamp(state) {
			return state.isUpdatingAge
		},
		updating_timestamp_plans(state) {
			return state.isUpdatingAgePlans
		},
		is_updating(state) {
			return state.isUpdating
		},
		is_updating_plans(state) {
			return state.isUpdatingPlans
		},
    // step 4 coffee range
    coffees_range(state) {
			return state.coffees_range
		},
    // Coffee Quiz Flexi packs
    quiz_flexi_packs(state) {
			return state.quiz_flexi_packs
		},
	},
	mutations,
	actions,
}
