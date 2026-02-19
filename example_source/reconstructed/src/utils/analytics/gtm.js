/* eslint-disable no-undef */
function gtmExists() {
	return window.dataLayer || []
}
/*
It's recommended that you use the following command to clear the ecommerce object prior to pushing an
ecommerce event to the data layer.
Clearing the object will prevent multiple ecommerce events on a page from affecting each other.
https://developers.google.com/tag-manager/ecommerce-ga4#clearing_the_ecommerce_object
*/
function ecommerceFlush() {
	dataLayer = gtmExists()
	dataLayer.push({ ecommerce: null })
}

function productGetPrice(product) {
  if(product.category === 'Subscription') return product.price
  return product.variant.price
}

const Salt = 'GoogleEnhancedDataSalt'
const Salt_PII = 'PACTEventsPIIDataSalt'
/******************* CART  *********************/
/*
sent on:
  PDP click
  PLP click
  basket addon click
  choosing plan in funnel
  basket qty increase
*/
export function addToBasket(product, userData) {
	dataLayer = gtmExists()
	ecommerceFlush()
	var user_data = userData
	Promise.all([
		user_data.email ? sha256(user_data.email).then(hex => user_data.email = hex) : Promise.resolve(),
		user_data.phone ? sha256(normalizePhoneNumber(user_data.phone)).then(hex => user_data.phone = hex) : Promise.resolve()
	]).then(() => {
		dataLayer.push({
			event: 'add_to_cart',
			ecommerce: {
				currency: 'GBP',
				items: [
					{
						//  GA4
						item_id: product.sku,
						item_name: product.name,
						item_brand: undefined,
						item_category: product.category,
						item_variant: product.variant ? product.variant?.sku : undefined,
						item_list_name: product.list_name ? product.list_name : undefined, // If associated with a list selection.
						index: product.list_position ? product.list_position + 1 : undefined, // If associated with a list selection.
						//common
						price: productGetPrice(product),
						quantity: product.quantity,
						//  D2C-2259 - Google remarketing
						id: product.variant ? product.variant?.sku : product.sku,
						google_business_vertical: "retail",
					},
				],
			},
			user_data: user_data,
		})
	})
}

/*
sent on:
  basket qty decrease
  basket product removal
*/
export function remFromBasket(product) {
	dataLayer = gtmExists()
	ecommerceFlush()
	dataLayer.push({
		event: 'remove_from_cart',
		ecommerce: {
			currency: 'GBP',
			items: [
				{
					// GA4
					item_name: product.name,
					item_id: product.sku,
					item_brand: undefined,
					item_category: product.category,
					item_variant: product.variant ? product.variant?.sku : undefined,
					// common
					price: productGetPrice(product),
					quantity: product.quantity,
				},
			],
		},
	})
}

/*************************** PURCHASES ***************************************/

// Low lvl encryption to avoid PII saved directly in dataLayer
const crypt = (salt, text) => {
	const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0))
	const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2)
	const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)

	return text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('')
}

const decrypt = (salt, encoded) => {
	const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0))
	const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)
	return encoded
		.match(/.{1,2}/g)
		.map((hex) => parseInt(hex, 16))
		.map(applySaltToChar)
		.map((charCode) => String.fromCharCode(charCode))
		.join('')
}

async function sha256(message) {
	const utf8 = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
}

function normalizePhoneNumber(phoneNumber) {
  let normalizedNumber = phoneNumber.replace(/[^\d+]/g, '').trim();
  return normalizedNumber.replace(/^07/, '+447').replace(/^7/, '+447');
}


/*
sent on store purchase
 source may be : 'Store' , 'Store EU'
*/
export function purchaseStore(products, OrderId, revenue, voucherCode, user_id, source, enhanced_data) {
	dataLayer = gtmExists()
	ecommerceFlush()
	//encrypt PII
	var processed_enhanced_data = { email: '', address: {} }
	processed_enhanced_data.email = crypt(Salt, enhanced_data.email)
	processed_enhanced_data.phone = enhanced_data.phone ? crypt(Salt, enhanced_data.phone) : ''
	Object.keys(enhanced_data.address).map(function (key) {
		processed_enhanced_data.address[key] = crypt(Salt, enhanced_data.address[key])
	})
	var user_data = { email: '', phone: '', external_id: user_id }
	Promise.all([
		enhanced_data.email ? sha256(enhanced_data.email).then(hex => user_data.email = hex) : Promise.resolve(),
		enhanced_data.phone ? sha256(normalizePhoneNumber(enhanced_data.phone)).then(hex => user_data.phone = hex) : Promise.resolve()
	]).then(() => {
		/***/
		dataLayer.push({
			event: 'purchase',
			ecommerce: {
				currency: 'GBP',
				transaction_id: OrderId,
				affiliation: 'Website',
				source: source,
				value: parseFloat(revenue),
				all_revenue: parseFloat(revenue),
				user_id: user_id,
				tax: undefined,
				shipping: undefined,
				currency: 'GBP',
				coupon: voucherCode,
				items: products.map((elem) => ({
					// GA4
					item_id: elem.sku,
					item_name: elem.name,
					price: productGetPrice(elem),
					discount: elem.item_from_be[0].discount,
					item_brand: undefined,
					item_category: elem.category ? elem.category : elem.coffeeType,
					item_variant: elem.variant ? elem.variant?.sku : undefined,
					item_coupon: undefined,
					item_from_quiz: elem.quiz_prod ? elem.quiz_prod : false,
					// common
					quantity: elem.quantity,
				})),
				enhanced_data: processed_enhanced_data,
			},
			user_data: user_data,
		})
	})
}
//getCookie used for rokt cookie for tracking id
function getCookie(cname) {
	var name = cname + '='
	var decodedCookie = decodeURIComponent(document.cookie)
	var ca = decodedCookie.split(';')
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ''
}

export function purchasePlanNewUser(price, trackingID, newUserID, voucherCode, order, plan, enhanced_data, is_funnel_acquisition) {
	dataLayer = gtmExists()
	ecommerceFlush()
	var rokttrackingID = null
	if (getCookie('roktoffer') === 'true') {
		rokttrackingID = getCookie('rokttrackingid')
		// remove rokt cookie after
		document.cookie = 'roktoffer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
		document.cookie = 'rokttrackingid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
	}
	//encrypt PII
	var processed_enhanced_data = { email: '', address: {} }
	processed_enhanced_data.email = crypt(Salt, enhanced_data.email)
	processed_enhanced_data.phone = enhanced_data.phone ? crypt(Salt, enhanced_data.phone) : ''
	Object.keys(enhanced_data.address).map(function (key) {
		processed_enhanced_data.address[key] = crypt(Salt, enhanced_data.address[key])
	})
	var user_data = { email: '', phone: '', external_id: newUserID }
	Promise.all([
		enhanced_data.email ? sha256(enhanced_data.email).then(hex => user_data.email = hex) : Promise.resolve(),
		enhanced_data.phone ? sha256(normalizePhoneNumber(enhanced_data.phone)).then(hex => user_data.phone = hex) : Promise.resolve()
	]).then(() => {
		/***/
		dataLayer.push({
			event: 'purchase',
			ecommerce: {
				currency: 'GBP',
				transaction_id: order.id,
				old_tracking_id: trackingID,
				affiliation: 'Website',
				source: 'Plan',
				value: parseFloat(price),
				all_revenue: parseFloat(price),
				user_id: newUserID,
				tax: undefined,
				shipping: undefined,
				currency: 'GBP',
				coupon: voucherCode,
				rokt_tracking_id: rokttrackingID,
				items: [
					{
						// GA4
						item_id: plan.sku,
						item_name: plan.name,
						price: price,
						item_brand: undefined,
						item_category: 'Subscription',
						item_variant: undefined,
						quantity: 1,
					},
				],
				enhanced_data: processed_enhanced_data,
				funnel_acquisition: is_funnel_acquisition,
			},
			user_data: user_data,
		})
	})
	trackRecurrable('subscribe_plan', order.recurrable_id, parseFloat(price))
}
export function purchasePlanExistingUser(planID, userID, orderID, plan, voucherCode, enhanced_data, is_funnel_acquisition) {
	dataLayer = gtmExists()
	ecommerceFlush()
	//encrypt PII
	var processed_enhanced_data = { email: '', address: {} }
	processed_enhanced_data.email = crypt(Salt, enhanced_data.email)
	processed_enhanced_data.phone = enhanced_data.phone ? crypt(Salt, enhanced_data.phone) : ''
	Object.keys(enhanced_data.address).map(function (key) {
		processed_enhanced_data.address[key] = crypt(Salt, enhanced_data.address[key])
	})
	var user_data = { email: '', phone: '', external_id: userID }
	Promise.all([
		enhanced_data.email ? sha256(enhanced_data.email).then(hex => user_data.email = hex) : Promise.resolve(),
		enhanced_data.phone ? sha256(normalizePhoneNumber(enhanced_data.phone)).then(hex => user_data.phone = hex) : Promise.resolve()
	]).then(() => {
		/***/
		dataLayer.push({
			event: 'purchase',
			ecommerce: {
				currency: 'GBP',
				transaction_id: orderID,
				old_tracking_id: planID,
				affiliation: 'Website',
				source: 'Plan EU',
				value: parseFloat(plan.plan_price),
				all_revenue: parseFloat(plan.plan_price),
				user_id: userID,
				tax: undefined,
				shipping: undefined,
				coupon: voucherCode,
				items: [
					{
						// GA4
						item_id: plan.coffee_plan_sku,
						item_name: plan.plan,
						price: plan.plan_price,
						item_brand: undefined,
						item_category: 'Subscription',
						item_variant: undefined,
						quantity: 1,
					},
				],
				enhanced_data: processed_enhanced_data,
				funnel_acquisition: is_funnel_acquisition,
			},
			user_data: user_data,
		})
	})
	trackRecurrable('subscribe_plan', planID, parseFloat(plan.plan_price))
}

export function conversionSimple(source) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'conversion',
		send_to: 'AW-867964225/1J1XCKW0yokBEMGq8J0D',
		source: source,
	})
}

export function purchaseGift(value, giftCode) {
	dataLayer = gtmExists()
	ecommerceFlush()
	dataLayer.push({
		event: 'purchase',
		ecommerce: {
			currency: 'GBP',
			transaction_id: giftCode,
			affiliation: 'Website',
			source: 'Gift Voucher',
			value: parseFloat(value),
			all_revenue: parseFloat(value),
			tax: undefined,
			shipping: undefined,
			currency: 'GBP',
		},
	})
}

/******************** PLP AND PDP ****************************** */

/*
sent on PLP ( currently dupepdo n filtered plps)
*/
export function ViewItemList(itemsGA, name) {
	dataLayer = gtmExists()
	ecommerceFlush()
	var index = 1
	var items = []
	itemsGA.forEach((item) => {
		items.push({
			//GA4
			item_id: item.sku,
			item_name: item.name, // Name or ID is required.
			item_brand: undefined,
			item_category: item.category !== '' ? item.category : item.coffeeType,
			item_variant: item.variant ? item.variant?.sku : undefined,
			item_list_name: name !== undefined ? name : 'shop',
			index: index,
			quantity: 1,
			// common
      //price: productGetPrice(item), REMOVED POST VARIANTS
		})
		index = index + 1
	})
	// Measure product views / impressions
	dataLayer.push({
		event: 'view_item_list',
		ecommerce: {
			currency: 'GBP',
			items: items,
		},
	})
}

/*
sent on PLP
*/
export function viewPromo(promos) {
	dataLayer = gtmExists()
	ecommerceFlush()
	promos.forEach((promo) => {
		dataLayer.push({
			event: 'view_promotion',
			ecommerce: {
				items: promo.items.map((elem) => ({
					item_id: elem.sku,
					item_name: elem.name,
          //price: productGetPrice(elem), REMOVED POST VARIANTS
					item_brand: undefined,
					item_category: elem.category ? elem.category : elem.coffeeType,
					item_variant: elem.variant ? elem.variant?.sku : undefined,
					quantity: 1,
					item_coupon: undefined,
					promotion_id: promo.id,
					promotion_name: promo.name,
				})),
			},
		})
	})
}
/*
sent on PLP
*/
export function ClickViewItem(item) {
	dataLayer = gtmExists()
	ecommerceFlush()
	dataLayer.push({
		event: 'select_item',
		ecommerce: {
			currency: 'GBP',
			items: [
				{
					// GA4
					item_id: item.sku,
					item_name: item.name, // Name or ID is required.
					item_brand: undefined,
					item_category: item.category !== '' ? item.category : item.coffeeType,
					item_variant: item.variant ? item.variant?.sku : undefined,
					item_list_name: item.list_name ? item.list_name : undefined,
					index: item.list_position ? item.list_position + 1 : undefined,
					quantity: 1,
					// common
          //price: productGetPrice(item), REMOVED POST VARIANTS
				},
			],
		},
	})
	if (item.on_offer) {
		ecommerceFlush()
		dataLayer.push({
			event: 'select_promotion',
			ecommerce: {
				items: [
					{
						item_id: item.sku,
						item_name: item.name, // Name or ID is required.
						item_brand: undefined,
						item_category: item.category !== '' ? item.category : item.coffeeType,
            item_variant: item.variant ? item.variant?.sku : undefined,
						item_list_name: item.list_name ? item.list_name : undefined,
						index: item.list_position ? item.list_position + 1 : undefined,
						quantity: 1,
            //price: productGetPrice(item), REMOVED POST VARIANTS
						promotion_id: item.offer.promo_event_id,
						promotion_name: item.offer.promo_event_title,
					},
				],
			},
		})
	}
}
/*
sent on PDP
*/

export function ViewItem(item, userData) {
	dataLayer = gtmExists()
	ecommerceFlush()
	// Measure a view of product details. This example assumes the detail view occurs on pageload,
	var user_data = userData
	Promise.all([
		user_data.email ? sha256(user_data.email).then(hex => user_data.email = hex) : Promise.resolve(),
		user_data.phone ? sha256(normalizePhoneNumber(user_data.phone)).then(hex => user_data.phone = hex) : Promise.resolve()
	]).then(() => {
		dataLayer.push({
			event: 'view_item',
			ecommerce: {
				items: [
					{
						// GA4
						item_id: item.sku,
						item_name: item.name, // Name or ID is required.
						//price: productGetPrice(item), REMOVED POST VARIANTS
						item_brand: undefined,
						item_category: item.category !== '' ? item.category : item.coffeeType,
						item_variant: item.variant ? item.variant?.sku : undefined,
						quantity: 1,
						// D2c-2259 - Google Remarketing
						id: item.sku,
						google_business_vertical: "retail",
					},
				],
			},
			user_data: user_data,
		})
	})
}

export function ClickViewVariant(item) {
	dataLayer = gtmExists()
	ecommerceFlush()
	dataLayer.push({
		event: 'click_variant',
		ecommerce: {
			item:
				{
					// GA4
					item_id: item.sku,
					item_parent_sku: item.parent_sku,
				}
		},
	})
}

/*********************** Checkout Progress ************************************/
//Currently unused , remove later
export function beginCheckout(itemsGA) {
	dataLayer = gtmExists()
	ecommerceFlush()
	/**
	 * A function to handle a click on a checkout button.
	 */
	var total = 0
	var items = []
	itemsGA.forEach((item) => {
		total += productGetPrice(item) * item.quantity
		items.push({
			item_id: elem.sku,
			item_name: item.name, // Name or ID is required.
      price: productGetPrice(item),
			item_brand: undefined,
			item_category: item.category !== '' ? item.category : item.coffeeType,
      item_variant: item.variant ? item.variant?.sku : undefined,
			item_list_name: item.list_name ? item.list_name : undefined,
			index: item.list_position ? item.list_position + 1 : undefined,
			quantity: item.quantity,
		})
	})
	dataLayer.push({
		event: 'begin_checkout',
		ecommerce: {
			items: items,
			value: total,
		},
	})
}

export function checkoutProgress(step, item_list, trackingID, source) {
	dataLayer = gtmExists()
	ecommerceFlush()
	/**
	 * A function to handle a click on a checkout next step button.
	 */
	var total = 0
	var items = []
	item_list.forEach((item) => {
		total += productGetPrice(item) * item.quantity
		items.push({
			item_id: item.sku,
			item_name: item.name, // Name or ID is required.
      price: productGetPrice(item),
			item_brand: undefined,
			item_category: item.category !== '' ? item.category : item.coffeeType,
      item_variant: item.variant ? item.variant?.sku : undefined,
			item_list_name: item.list_name ? item.list_name : undefined,
			index: item.list_position ? item.list_position + 1 : undefined,
			quantity: item.quantity ? item.quantity : 1,
			coupon: undefined,
		})
	})

  // D2C-2177 - This is for Google Remarketing Tag aka Google Ads only for store and begin checkout event
  if(step === 1 && source.startsWith('Store')){
    items.forEach((item) => {
      item.id = item.item_id,
      item.google_business_vertical = "retail"
    })
  }

	dataLayer.push({
		event: step === 1 ? 'begin_checkout' : step === 2 ? 'add_shipping_info' : 'add_payment_info',
		ecommerce: {
			currency: 'GBP',
			step: step,
			source: source,
			tracking_id: trackingID,
			items: items,
			value: total,
		},
	})
}

/*
steps are:
  3 pick_coffee_type
  4 pick_type
  5 pick_method
  6 pick_grind
  7 pick_range
  8 pick_freq
  9 complete_funnel
*/
/*
steps for B are:
  1 enter_funnel
  2 pick_preparation
  3 pick_plan
  4 pick_frequency
*/

var currentPlanBuilder = {
	type: undefined,
	method: undefined,
	grind: undefined,
	range: undefined,
	range_sku: undefined,
	coffee: undefined,
	coffee_sku: undefined,
	frequency: undefined,
}
export function funnelProgress(step_number, step, planData, coffeeType = undefined) {
	dataLayer = gtmExists()
	currentPlanBuilder = { ...currentPlanBuilder, ...planData }
	dataLayer.push({
		event: 'funnel_progress',
		step: step,
		step_number: step_number,
		plan_data: currentPlanBuilder,
		coffee_type: coffeeType,
	})
}
export function acquisitionFunnelProgress(step_number, step, planData, coffeeType = undefined) {
	dataLayer = gtmExists()
	currentPlanBuilder = { ...currentPlanBuilder, ...planData }
	dataLayer.push({
		event: 'acquisition_funnel_progress',
		step: step,
		step_number: step_number,
		plan_data: currentPlanBuilder,
		coffee_type: coffeeType,
	})
}

/*
quiz steps are:
  1 enter_quiz
  2 start_quiz
  3 pick_type
  4 pick_coffee_type
  5 pick_wholebean_coffee_type
  6 pick_ground_method
  7/8 pick_roast/pick_flavour // depends on the quiz version
  9 complete_quiz
  10 quiz_add_to_basket
*/

var currentQuizJourney = {
  type: undefined, // decaf or regular
  wholebean: undefined, //true or false
  coffee_type: undefined, // filter, espresso or pod
  method: undefined,
  roast: undefined,
  flavour_profile: undefined,
  grind: undefined,
  product_name: undefined,
  product_parent_sku: undefined,
  product_variant_sku: undefined
}

var cleanCurrentQuizJourney = {
  type: undefined, // decaf or regular
  wholebean: undefined, //true or false
  coffee_type: undefined, // filter, espresso or pod
  method: undefined,
  roast: undefined,
  flavour_profile: undefined,
  grind: undefined,
  product_name: undefined,
  product_parent_sku: undefined,
  product_variant_sku: undefined,
  product_quantity: undefined
}
export function quizProgress(step_number, step, quizData, quizVersion = undefined) {
	dataLayer = gtmExists()
	currentQuizJourney = step_number === 0 ? { ...cleanCurrentQuizJourney } : { ...currentQuizJourney, ...quizData }
	dataLayer.push({
		event: 'quiz_progress',
		quiz_step: step,
		quiz_step_number: step_number,
		quiz_data: currentQuizJourney,
    quiz_version: quizVersion
	})
}

/************ Recurrable Analytics Events *********/
/*
all event names:
  asap_order
  delay_order -> value = days delayed
  skip_order -> value = days skipped
  cancel_plan
  pause_plan
  resume_plan
  change_shipping_date
*/
export function trackRecurrable(event, id, value = undefined) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'subscription_event',
		subscription: {
			event_name: event,
			subscription_id: id,
			event_value: value,
		},
	})
}
/*
tracking for last cancel/pause plan, sending reason in label
*/
export function trackRecurrableWithReason(event, id, reason) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'subscription_event',
		subscription: {
			event_name: event,
			subscription_id: id,
			event_label: reason,
		},
	})
}

/****************  Analytics events   *****************/
/*
event_names might be:
  plan_options_click
  navigation_click
  filters_click
  account_created
  funnel_click
  button_click
  hero-banner-click
*/
export function sendGenericEvent(action, category, label, value) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'analytics_event',
		event_data: {
			event_name: action,
			event_category: category,
			event_label: label,
			event_value: value,
		},
	})
}

// used to track clicks on funnel modals/extra options
export function clickFunnel(category, label) {
	sendGenericEvent('funnel_click', category, label, undefined)
}

export function clickTrackingNavBar(category, subCategory, options) {
	sendGenericEvent(
		`navigation-${category}`,
		'navigation_click',
		category + ' - ' + (category !== subCategory ? subCategory : ''),
		undefined
	)
}

export function buttonClick(action, category, label) {
	sendGenericEvent(action, category, label, undefined)
}

export function clickFilterOption(type, category, filter_option) {
	var categoryString = category === 'bags' ? 'bagged' : category
	sendGenericEvent(
		'filter options ' + categoryString + ' PLP',
		'filters_click',
		type + ' - ' + filter_option,
		undefined
	)
}

export function accountCreated(source) {
	sendGenericEvent('account_created', 'Account creation', source, undefined)
}

/****************  Retention tracking events   *****************/

/*
retention_name can be: pause_save, cancel_save
label will be the reason
actions can be :
  enter_save
  pick_reason
  choose_save
 value will be:
  the option chosen when user chooses a save
*/
export function trackRetentionEvents(id, retention_name, action, label = undefined, value = undefined) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'retention_event',
		event_data: {
			subscription_id: id,
			event_category: retention_name,
			event_name: action,
			event_label: label,
			event_value: value,
		},
	})
}

/******************************************************* */

export function updateCookiesConsent(marketingConsent, statisticConsent) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: marketingConsent ? 'marketing_consent_given' : 'marketing_consent_revoked',
		marketing_cookies_consent: marketingConsent,
	})
	dataLayer.push({
		event: statisticConsent ? 'statistic_consent_given' : 'statistic_consent_revoked',
		statistic_cookies_consent: statisticConsent,
	})
}

/*** For Ometria  ***/

export function cartInsight(basket_id, total, itemsGA) {
	dataLayer = gtmExists()
	ecommerceFlush()
	var index = 1
	var items = []
	itemsGA.forEach((item) => {
		items.push({
			//GA4
			item_id: item.sku.split('-')[0],
			item_name: item.name, // Name or ID is required.
			item_brand: undefined,
			item_category: item.category !== '' ? item.category : item.coffeeType,
			item_variant: item.variant ? item.variant?.sku : undefined,
			item_list_name: name !== undefined ? name : 'shop',
			index: index,
			quantity: item.quantity ? item.quantity : 1,
			// common
			price: productGetPrice(item),
		})
		index = index + 1
	})
	// Measure product views / impressions
	dataLayer.push({
		event: 'basket_insight',
		ecommerce: {
			currency: 'GBP',
			items: items,
			value: parseFloat(total),
			basket_id: basket_id,
		},
	})
}
export function OmetriaIdentify(email) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'ometria_identify',
		ometria_id: crypt(Salt_PII, email),
	})
}

export function ImpactIdentify(id, email) {
	dataLayer = gtmExists()
	if (id) {
		dataLayer.push({
			event: 'user_identify',
			pact_user: {
				uid: id,
				ue: crypt(Salt_PII, email),
			},
		})
	} else {
		dataLayer.push({
			event: 'user_identify',
			pact_user: {
				ue: crypt(Salt_PII, email),
			},
		})
	}
}

export function AdventsRateLogin(id, email, new_user) {
	dataLayer = gtmExists()
  dataLayer.push({
    event: 'rate_advent_login',
    pact_user: {
      uid: id,
      ue: crypt(Salt_PII, email),
      new_user: new_user
    },
  })
}

// Gifts Purchase Tracking
/*
steps are:
  1 landing
  2 pick_plan
  3 pick_send_type
  4 fill_gift_data
  5 gift_preview
  6 gift_summary
  7 checkout
*/
var currentGiftBuilder = {
	list_type: undefined,
	plan_tier: undefined,
	plan_decaf: undefined,
	plan_pod: undefined,
	duration: undefined,
	send_type: undefined, //link, email-now, email-later
	theme: undefined,
	coffee_sku: undefined, //used for pods
}
export function giftPurchaseProgress(step_number, step, planData, coffeeType ) {
	dataLayer = gtmExists()
	currentGiftBuilder = { ...currentGiftBuilder, ...planData }
	dataLayer.push({
		event: 'gift_purchase_progress',
		gift_step: step,
		gift_step_number: step_number,
		gift_data: currentGiftBuilder,
		gift_coffee_type: coffeeType
	})
}

// Gifts Redeem Tracking

/*
steps are:
  1 landing
  2 checkout
  3 redeem
*/
export function giftRedeemProgress(step_number, step, planData, coffeeType) {
	dataLayer = gtmExists()
	currentPlanBuilder = { ...currentPlanBuilder, ...planData }
	dataLayer.push({
		event: 'gift_redeem_progress',
		gift_step: step,
		gift_step_number: step_number,
    plan_data: currentPlanBuilder,
		gift_coffee_type: coffeeType
	})
}


// Basket Voucher Tracking

export function basketVoucherAdd(code) {
	dataLayer = gtmExists()
	dataLayer.push({
		event: 'basket_voucher_add',
		basket_voucher_code: code
	})
}
