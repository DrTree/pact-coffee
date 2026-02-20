import { noAuthReq, authReq, authReqGet } from './generalRequest'
import cookieHandler from '../../../components/utils/cookies/cookieHandler'

const DEFAULT_HOST = process.env.API_BASE ? process.env.API_BASE : 'http://127.0.0.1:4000'
const DEFAULT_VERSION = 'v3'

const v3BaseUrl = `${DEFAULT_HOST}/${DEFAULT_VERSION}`

function authConfig() {
	return {
		headers: { Authorization: `Bearer ${cookieHandler.getToken()}` },
	}
}
export default {
	getRecurrables() {
		return authReq('/users/me/recurrables', 'get', {}, authConfig())
	},
	getOrders() {
		return authReqGet('/users/me/orders/upcoming', 'get', {}, authConfig())
	},
	skipOrder(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/skip`, 'patch', {}, authConfig())
	},
	updateOrder(payload) {
		return authReq(`/users/me/orders/${payload.order_id}`, 'patch', payload, authConfig())
	},
	updateOrderItems(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/order_items/${payload.item_id}`, 'patch', payload, authConfig())
	},
  orderAvailableProductAddonsV3(payload) {
    return authReqGet(`/users/me/orders/${payload.order_id}/available_product_addons`, 'get', {}, authConfig())
  },

	createUserFunnel(payload) {
		return noAuthReq('/users/d2c/funnel', 'post', payload)
	},
	createUserStore(payload) {
		return noAuthReq('/users/d2c/store', 'post', payload)
	},
	redeemVoucher(payload) {
		return authReq(`vouchers/${payload.code}/redeem`, 'post', payload, authConfig())
	},
	validateVoucher(payload) {
		return authReq(`vouchers/${payload.code}/validate`, 'post', payload.body, authConfig())
	},
  claimIdentity( payload ) {
    return authReq('users/claim', 'post', payload,authConfig())
  },
	checkoutBasket(payload) {
		return authReq('/users/me/basket', 'post', payload, authConfig())
	},
	checkoutExpressBasket(payload) {
		return authReq('/users/me/basket/express', 'post', payload, authConfig())
	},
	checkoutExpressPlan(payload) {
		return authReq('/users/me/recurrables/express', 'post', payload, authConfig())
	},
  // Rate Advent Coffees Page
  async loginEUAdventRatings(email, password, opt_in) {
		var payload = {
			email: email,
			password: password,
      opt_in: opt_in
		}
		return noAuthReq('/tokens/advent_ratings_2025', 'post', payload)
	},
  async loginNUAdventRatings(payload) {
		return noAuthReq('/users/d2c/advent_ratings_2025', 'post', payload)
	},
  getUserAdventCoffees(payload) {
		return authReqGet('users/me/coffees/advent_coffees', 'get', { day: payload }, authConfig())
	},
  rateAdventCoffee(payload) {
		return authReq('users/me/coffee-ratings/advent-ratings-2025', 'post', payload, authConfig())
	},
  rateAdventDuplicatePlan(payload) {
		return authReq('users/me/recurrables/duplicate', 'post', payload, authConfig())
	},
  getUserRecurrableStateCount() {
		return authReq('users/me/recurrables/state_count', 'get',{}, authConfig())
	},


  // Api version 3
  async loginV3(email, password) {
		var payload = {
			email: email,
			password: password,
		}
		return noAuthReq('/tokens', 'post', payload, v3BaseUrl)
	},
  async logoutV3() {
		return authReq('/tokens/me', 'delete', {}, authConfig(), v3BaseUrl)
	},
  getUserInfoV3() {
		return authReq('/users/me', 'get', {}, authConfig(), v3BaseUrl)
	},
  updateUserInfoV3(payload) {
		return authReq('/users/me', 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateUserEmailV3(payload) {
		return authReq('/users/me/email', 'patch', payload, authConfig(), v3BaseUrl)
	},
	updateUserPasswordV3(payload) {
		return authReq('/users/me/password', 'patch', payload, authConfig(), v3BaseUrl)
	},
	getCardsV3() {
		return authReq('/users/me/payment_cards', 'get', {}, authConfig(), v3BaseUrl)
	},
	getCardAddressV3(payload) {
		return authReq(`/users/me/payment_cards/${payload}/billing_address`, 'get', {}, authConfig(), v3BaseUrl)
	},
  //D2C 2873: rollback to v2
	updateUserCardV3(payload) {
		return authReq('/users/me/payment_cards', 'post', payload, authConfig())
	},
  getAddressesV3() {
		return authReq('/users/me/addresses', 'get', {}, authConfig(), v3BaseUrl)
	},
	createAddressV3(payload) {
		return authReq('/users/me/addresses', 'post', payload, authConfig(), v3BaseUrl)
	},
	editAddressV3(payload) {
		return authReq(`/users/me/addresses/${payload.id}`, 'patch', payload, authConfig(), v3BaseUrl)
	},
	deleteAddressV3(payload) {
		return authReq(`/users/me/addresses/${payload.id}`, 'delete', payload, authConfig(), v3BaseUrl)
	},
  getPrimaryRecurrableV3() {
		return authReqGet('/users/me/recurrables/primary', 'get', {}, authConfig(), v3BaseUrl)
	},
  getRecurrableTiersV3(payload) {
		return authReqGet(`/users/me/recurrables/${payload.id}/tiers`, 'get', {}, authConfig(), v3BaseUrl)
	},
  getRecurrableSizesV3(payload) {
		return authReqGet(`/users/me/recurrables/${payload.id}/bag_sizes`, 'get', {}, authConfig(), v3BaseUrl)
	},
  getRecurrableCoffeeTypesV3(payload) {
		return authReqGet(`/users/me/recurrables/${payload.id}/coffee_types`, 'get', {}, authConfig(), v3BaseUrl)
	},
  getRecurrableCoffeesV3(payload) {
		return authReqGet(`/users/me/recurrables/${payload.id}/coffees`, 'get', {}, authConfig(), v3BaseUrl)
	},
  updateRecurrableNameV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/name`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableTierV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/tier`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableBrewMethodV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/brew_method`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableSizeV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/bag_size`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableCoffeeTypeV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/coffee_type`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableFrequencyV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/frequency`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  updateRecurrableAddressV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/address`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  getRecurrablesSwitchListV3() {
		return authReqGet('/users/me/recurrables/switch_list', 'get', {}, authConfig(), v3BaseUrl)
	},
  getPausedRecurrablesV3() {
		return authReqGet('/users/me/recurrables/paused', 'get', {}, authConfig(), v3BaseUrl)
	},
  getRecurrablebyIdV3(id) {
		return authReqGet(`/users/me/recurrables/${id}`, 'get', {}, authConfig(), v3BaseUrl)
	},
  rateRecurrablesV3(payload) {
    return authReqGet(`/users/me/coffee_ratings/${payload.id}/recurrables`, 'get', {}, authConfig(), v3BaseUrl)
  },
	sendEmailInvitesV3(payload) {
    return authReq(`/users/me/invite`, 'post', payload, authConfig(), v3BaseUrl)
  },
  referralStatsV3() {
    return authReqGet(`/users/me/referral_stats/`, 'get', {}, authConfig(), v3BaseUrl)
  },
  pauseRecurrableV3(payload) {
    return authReq(`/users/me/recurrables/${payload.id}/pause`, 'patch', payload, authConfig(), v3BaseUrl)
  },
  unPauseRecurrableV3(payload) {
    return authReq(`/users/me/recurrables/${payload.id}/unpause`, 'patch', {}, authConfig(), v3BaseUrl)
  },
  cancelRecurrableV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/cancel`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  getRetentionPlans(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/retention_plans`, 'get', { }, authConfig(), v3BaseUrl)
	},
  updateCancelPauseFlowPlanAmountV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/coffee_plan_amount`, 'patch', { amount: payload.amount, flow: payload.flow }, authConfig(), v3BaseUrl)
	},
  updateCancelPauseFlowPlanTierV3(payload) {
		return authReq(`/users/me/recurrables/${payload.id}/coffee_plan_tier`, 'patch', { tier: payload.tier, flow: payload.flow }, authConfig(), v3BaseUrl)
	},
  updateOrderItemV3(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/order_items/${payload.item_id}`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  asapOrderV3(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/asap`, 'patch', {}, authConfig(), v3BaseUrl)
	},
	delayOrderV3(payload) {
		return authReq(`/users/me/orders/${payload.id}/delay`, 'patch', { days: payload.days }, authConfig(), v3BaseUrl)
	},
  skipOrderV3(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/skip`, 'patch', {}, authConfig(), v3BaseUrl)
	},
	checkScheduleV3(payload) {
    var id = payload.id
    delete payload.id
		return authReqGet(`/users/me/orders/${id}/scheduler`, 'get', { dispatch_on: payload.dispatch_on} , authConfig(), v3BaseUrl)
	},
	rescheduleOrderV3(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/reschedule`, 'patch', payload, authConfig(), v3BaseUrl)
	},
	addOrderAddonsV3(payload) {
    return authReq(`/users/me/orders/${payload.order_id}/order_items`, 'post', payload, authConfig(), v3BaseUrl)
	},
	deleteOrderAddonV3(payload) {
		return authReq(`/users/me/orders/${payload.order_id}/order_items/batch_destroy`, 'delete', payload, authConfig(), v3BaseUrl)
	},
	availableProductAddonsV3(payload) {
    return authReqGet(`/users/me/recurrables/${payload.recurrable_id}/addons`, 'get', {}, authConfig(), v3BaseUrl)
  },
	addAddonsV3(payload) {
    return authReq(`/users/me/recurrables/${payload.recurrable_id}/recurrable_addons`, 'post', payload, authConfig(), v3BaseUrl)
	},
	updateAddonsV3(payload) {
    return authReq(`/users/me/recurrables/${payload.recurrable_id}/recurrable_addons`, 'patch', payload, authConfig(), v3BaseUrl)
	},
	deleteAddonV3(payload) {
		return authReq(`/users/me/recurrables/${payload.recurrable_id}/recurrable_addons/${payload.addon_id}`, 'delete', {}, authConfig(), v3BaseUrl)
	},
  getCoffeesRatingsV3() {
		return authReq('/users/me/coffee_ratings', 'get', {}, authConfig(), v3BaseUrl)
  },
	createRecurrableV3(payload) {
		return authReq('/users/me/recurrables', 'post', payload, authConfig(), v3BaseUrl)
	},
  getRateLastCoffeeV3() {
    return authReq('/users/me/coffee_ratings/last_coffee', 'get', {}, authConfig(), v3BaseUrl)
  },
  rateNewCoffeeV3(payload) {
		return authReq(`/users/me/coffee_ratings`, 'post', payload, authConfig(), v3BaseUrl)
	},
  editCoffeeRatingV3(payload) {
		return authReq(`/users/me/coffee_ratings/${payload.id}`, 'patch', payload, authConfig(), v3BaseUrl)
	},
  whitelistV3(payload) {
    return authReq(`/users/me/coffees/whitelist`, 'post', payload, authConfig(), v3BaseUrl)
  },
  alwaysSendV3(payload) {
    return authReq(`/users/me/coffees/always_send`, 'post', payload, authConfig(), v3BaseUrl)
  },
  getOrdersHistoryV3(payload) {
    return authReqGet(`/users/me/orders/history`, 'get', payload?.year ? { year: payload.year } : {}, authConfig(), v3BaseUrl)
  },
  getOrderDetailsV3(payload) {
    return authReq(`/users/me/orders/${payload.id}`, 'get', {}, authConfig(), v3BaseUrl)
  },
  submitUserGiftOptionV3(payload) {
		return authReq(`/users/me/orders/${payload.id}/gift`, 'patch', payload, authConfig(), v3BaseUrl)
	},
}
