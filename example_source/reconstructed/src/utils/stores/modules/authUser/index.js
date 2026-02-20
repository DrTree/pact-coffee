import { defineStore } from 'pinia'
import userActions from './actions'
import userGetters from './getters'
import SecureLS from 'secure-ls'
var ls = new SecureLS({ isCompression: false })

export const useAuthUser = defineStore('authUser', {
	state: () => ({
		id: undefined,
		email: undefined,
		phone_number: undefined,
		first_name: undefined,
		last_name: undefined,
		is_pioneer: false,
		is_pod_pioneer: false,
		opt_in: false,
		balance: 0.0,
		token: undefined,
		timeOfLastPull: undefined,
		// recurrables: [],
    primary_recurrable: undefined,
    orders: [],
    recurrables_switch_list: [],
    paused_recurrables: [],
    retention_plans: [],
		coffees: [],
		receipts: [],
		addresses: [],
		cards: [],
		orders_history: {
			orders: [],
			current_page: 0,
			max: 0
		},
		showSidebar: undefined,
		employee_discount: undefined,
		card_declined: undefined,
		viral_code: undefined,
		pricePolicy: undefined,
		type: undefined,
		advent_coffees_rated: false,
		receiptPage: 0,
		receiptPageMax: 1,
		getting_addresses: 'undefined',
		cs_mode: false,
		advent_coffees: undefined,
		recurrable_state_count: undefined,
		signup_context: undefined,
    next_shipment_date: undefined,
    last_created_order_date: undefined,
    next_order_recurrable: undefined,
    carousel_addons: []
	}),
	getters: userGetters,
	actions: userActions,
  persist: {
    key: 'authUser',
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  }
})
