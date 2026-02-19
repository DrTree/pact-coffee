import mutations from './user-mutations'
import actions from './user-actions'
import state from './initialState'
import cookieHandler from '../../../../components/utils/cookies/cookieHandler'
import objects from '../../../../components/utils/objects/handleObjects.js'
const ttp = process.env.TIME_TO_UPDATE ? process.env.TIME_TO_UPDATE : 1000

export const user = {
	namespaced: true,
	state,
	getters: {
		isOnline(state) {
      if(state.id)
        return true
      else
       return false
		},
		user_id(state) {
			return state.id
		},
		account_balance(state) {
			return state.balance
		},
		first_name(state) {
			return state.first_name
		},
		last_name(state) {
			return state.last_name
		},
		full_name(state) {
			return state.first_name + ' ' + state.last_name
		},
		opt_in(state) {
			return state.opt_in
		},
		email(state) {
			return state.email
		},
		phone_number(state) {
			return state.phone_number
		},
		viral_code(state) {
			return state.viral_code
		},
		isPioneer(state) {
			return state.is_pioneer
		},
		isPodPioneer(state) {
			return state.is_pod_pioneer
		},
		userType(state) {
			return state.type
		},
    isAdventRated(state) {
			return state.advent_coffees_rated
		},
		ordersHistory(state) {
			return state.ordersHistory.orders
		},
		ordersHistoryPage(state) {
			return state.ordersHistory.current_page
		},
		ordersHistoryMax(state) {
			return state.ordersHistory.max
		},
		receiptPage(state) {
			return state.receiptPage
		},
		receiptPageMax(state) {
			return state.receiptPageMax
		},
		cards(state) {
			return state.cards
		},
		card(state) {
			return state.cards[0]
		},
		addresses(state) {
			return state.addresses
		},
    getting_addresses(state) {
			return state.getting_addresses
		},
    getMostRecentAddressID: state => {
      return state.addresses.length > 0 ? state.addresses[state.addresses.length - 1 ].id : 'no_addresses'
    },
		getPricePolicy: (state) => {
			return state.pricePolicy
		},
		getAddressById: (state) => (id) => {
			return state.addresses.find((address) => address.id === id)
		},
		plans(state) {
			return state.recurrables
		},
		coffees(state) {
			return state.coffees
		},
		getPlanById: (state) => (id) => {
			return state.recurrables.find((plan) => plan.id === id)
		},
		getPlansByAddress: (state) => (addressId) => {
			var returnPlans = state.recurrables.filter((plan) => plan.address_id === addressId)
			return returnPlans
		},
		getPlanByOrder: (state) => (id) => {
			return state.recurrables.find((plan) => plan.current_order.id === id)
		},
		getNextOrderRecurrable(_, getters) {
			var selectedOrder = null
			getters.orders.forEach((order) => {
				if (
					(!selectedOrder ||
					(selectedOrder &&
						new Date(selectedOrder.dispatch_on) > new Date(order.dispatch_on)))
          && order.source_type !== 'pact_store'
				)
					selectedOrder = order
			})
			return selectedOrder
		},
    getNextOrder(_, getters) {
			var selectedOrder = null
			getters.orders.forEach((order) => {
				if (
					(!selectedOrder ||
					(selectedOrder &&
						new Date(selectedOrder.dispatch_on) > new Date(order.dispatch_on)))
				)
					selectedOrder = order
			})
			return selectedOrder
		},
		planNextOrder: state => planId => {
      return state.recurrables.find(plan => plan?.id === planId )?.current_order
    },
		recurrableOrders(state) {
		 	return state.orders.filter(order => order.recurrable_id)
		},
		storeOrders(state) {
			return state.orders.filter(order => !order.recurrable_id)
		},
		orders(state) {
			return state.orders
		},
		getOrderById: (_, getters) => (id) => {
			return getters.orders.find((order) => order.id === id)
		},
		getOrdersByDate: (_, getters) => {
			var datesDict = {}
			getters.orders.forEach((order) => {
				if (datesDict[order.dispatch_on]) datesDict[order.dispatch_on].push(order)
				else datesDict[order.dispatch_on] = [order]
			})
			return datesDict
		},
		getOrdersByDateAndAddress: (_, getters) => (address) => {
			var datesDict = {}
			getters.orders.forEach((order) => {
				if (objects.addressJoin(address) === objects.addressJoin(order.label_address)) {
					if (datesDict[order.dispatch_on]) datesDict[order.dispatch_on].push(order)
					else datesDict[order.dispatch_on] = [order]
				}
			})
			return datesDict
		},
		getOrdersAddresses(_, getters) {
			return getters.orders.map(order => order.label_address).reduce((uniques, item) =>
				uniques.includes(item) ? uniques : [...uniques, item], []
			)
		},
		cs_mode(state) {
			return state.cs_mode ? state.cs_mode : false
		},
    getShowSidebar(state){
      return state.showSidebar
    },
    user_employee_discount(state){
      return state.employee_discount
    },
    user_card_declined(state){
      return state.card_declined
    },
    advent_calendar_coffees(state){
      return state.advent_coffees
    },
    recurrable_state_count(state){
      return state.recurrable_state_count
    }
	},
	mutations,
	actions,
}
