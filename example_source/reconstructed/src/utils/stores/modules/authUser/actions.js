// user-actions.pinia.js (or replace your existing file content)

import api from '../../../api'
import cookieHandler from '../../../../components/utils/cookies/cookieHandler'
import * as GTM from '../../../analytics/gtm'
import { checkResponse } from '../../../store/error'
// const DEFAULT_HOST_B2B = process.env.WEB_URL_B2B ? process.env.WEB_URL_B2B : 'http://127.0.0.1:7000'

export default {
  // Mutations converted to actions
  saveInfo(payload) {
    this.id = payload.id
    this.email = payload.email
    this.phone_number = payload.phone_number
    this.opt_in = payload.opt_in
    this.first_name = payload.first_name
    this.last_name = payload.last_name
    this.balance = payload.balance
    this.is_pioneer = payload.pact_pioneer
    this.advent_coffees_rated = payload.advent_coffees_rated
    this.is_pod_pioneer = payload.pod_pioneer
    this.viral_code = payload.viral_code
    this.pricePolicy = payload.price_policy
    this.token = payload.token
    this.type = payload.type
    this.employee_discount = payload.employee_discount
    this.card_declined = payload.card_declined
    this.timeOfLastPull = Date.now()
    this.recurrable_state_count = payload.recurrable_state_count
    this.signup_context = payload.signup_context
    this.next_shipment_date =  payload.next_shipment_date
    this.last_created_order_date = payload.last_order_created_date
  },
  resetInfo() {
    this.id = undefined
    this.email = undefined
    this.phone_number = undefined
    this.first_name = undefined
    this.last_name = undefined
    this.balance = undefined
    this.viral_code = undefined
    this.pricePolicy = undefined
    this.token = undefined
    this.is_pioneer = false
    this.is_pod_pioneer = false
    this.advent_coffees_rated = false
    this.opt_in = false
    this.timeOfLastPull = undefined
    this.type = undefined
    this.receiptPage = 0
    this.employee_discount = undefined
    this.card_declined = undefined
    this.receiptPageMax = 1
    this.addresses = []
    this.getting_addresses = 'undefined'
    this.cards = []
    this.orders = []
    //this.recurrables = []
    this.primary_recurrable = undefined,
    this.recurrables_switch_list = [],
    this.paused_recurrables = [],
    this.retention_plans = [],
    this.coffees = []
    this.orders_history = { orders: [], current_page: 0, max: 0 }
    this.recurrable_state_count = undefined
    this.signup_context = undefined
    this.last_rate_coffee = undefined
    this.next_shipment_date =  undefined
    this.last_created_order_date = undefined
    this.next_order_recurrable = undefined
    this.carousel_addons = undefined

  },
  updateInfo(payload) {
    this.balance = payload.balance ? payload.balance : this.balance
    this.email = payload.email ? payload.email : this.email
    this.first_name = payload.first_name
      ? payload.first_name
      : this.first_name
    this.last_name = payload.last_name ? payload.last_name : this.last_name
    this.id = payload.id ? payload.id : this.id
    this.phone_number = payload.phone_number
      ? payload.phone_number
      : this.phone_number
    this.is_pioneer = payload.pact_pioneer
      ? payload.pact_pioneer
      : this.is_pioneer
    this.advent_coffees_rated = payload.advent_coffees_rated
      ? payload.advent_coffees_rated
      : this.advent_coffees_rated
    this.opt_in =
      payload.opt_in !== undefined || payload.opt_in !== null
        ? payload.opt_in
        : this.opt_in
    this.viral_code = payload.viral_code
      ? payload.viral_code
      : this.viral_code
    this.type = payload.type ? payload.type : this.type
    this.employee_discount = payload.employee_discount
    this.card_declined = payload.card_declined
    this.recurrable_state_count = payload.recurrables
      ? payload.recurrables
      : this.recurrable_state_count
    this.next_shipment_date = payload.next_shipment_date
      ? payload.next_shipment_date
      : this.next_shipment_date
    this.last_created_order_date = payload.last_order_created_date
      ? payload.last_order_created_date
      : this.last_created_order_date
    this.orders_history = payload.orders_history
      ? payload.orders_history
      : this.orders_history
  },

  updatePrimaryRecurrable(payload){
    this.primary_recurrable = payload?.recurrable
      ? payload.recurrable
      : payload
  },

  updatePrimaryRecurrableAddress(payload){
    if(payload.id === this.primary_recurrable.address.id)
      this.primary_recurrable.address = payload
  },

  updateLastRateCoffee(payload){
    this.last_rate_coffee = payload
  },

  updatePausedRecurrables(payload){
    this.paused_recurrables = payload
  },

  updateEmail(payload) {
    this.email = payload.email
  },

  updateCards(payload) {
    this.cards = payload
  },

  updateCard(payload) {
    this.cards = [payload]
    this.card_declined = false
  },

  updateCardAddress(payload) {
    this.cards[0] = { ...this.cards[0], billing_address: payload }
  },

  updateAddresses(payload) {
    this.addresses = payload
  },

  updateGettingAddresses(payload) {
    this.getting_addresses = payload
  },

  // gettingSignupContext(payload) {
  //   this.signup_context = payload
  // },

  updateCoffees(payload) {
    this.coffees = payload
  },

  updateOrders(payload) {
    this.orders = payload
  },

  addAddress(payload) {
    this.addresses.push(payload)
  },

  saveNextOrderRecurrable(payload) {
    this.next_order_recurrable = payload
  },

  editAddressUpdate(payload) {
    const i = this.addresses.map((item) => item.id).indexOf(payload.id)
    this.addresses[i] = payload
  },

  removeAddressUpdate(payload) {
    const i = this.addresses.map((item) => item.id).indexOf(payload)
    this.addresses.splice(i, 1)
  },

  isBagOrPodAddon(recurrable_coffee, addon){
    return recurrable_coffee.sku.startsWith('BA')
      ? addon.variants[0].bag_plan_addon
      : addon.variants[0].pod_plan_addon
  },

  updateCarouselAddons(addons) {
    var recurrable_coffee = this.primary_recurrable.current_order.items.find((item) => item.recurrable_coffee)
    addons.filter((addon) => this.isBagOrPodAddon(recurrable_coffee, addon) || !addon.variants[0].bag_plan_addon && !addon.variants[0].pod_plan_addon)
    this.carousel_addons = addons
  },

  updateRetentionPlans(payload) {
    this.retention_plans = payload
  },

  updateRecurrablesSwitchList(payload){
    this.recurrables_switch_list = payload
  },

  updateSwitchListRecurrableState(payload) {
    const i = this.recurrables_switch_list.map((item) => item.id).indexOf(payload.id)
    this.recurrables_switch_list[i] = {
      ...this.recurrables_switch_list[i],
      current_state: payload.state,
      current_order: payload.current_order
    }
  },

  removeRecurrableFromSwitchList(payload) {
    const i = this.recurrables_switch_list.map((item) => item.id).indexOf(payload.id)
    this.recurrables_switch_list.splice(i, 1)
  },

  updatePrimaryRecurrableOrder(payload) {
    this.primary_recurrable.current_order = payload
  },

  updateOrdersHistory(payload) {
    this.orders_history?.orders = payload
    this.orders_history?.current_page = 1
    this.orders_history?.max = 50
  },

  updateRating(payload) {
    const coffee = this.coffees.find(
      (coffee) => coffee.coffee_id === payload.coffee_id
    )
    const index = this.coffees.indexOf(coffee)
    this.coffees[index].coffee_rating = payload.coffee_rating
    this.coffees[index].never_send = payload.never_send || false
    this.coffees[index].always_send = payload.always_send || false
  },

  _alwaysSend(payload) {
    const coffee = this.coffees.find(
      (coffee) => coffee.coffee_id === payload.coffee_id
    )
    const index = this.coffees.indexOf(coffee)
    this.coffees[index].always_send = true
    this.coffees[index].never_send = false

    payload.data.forEach((recurrableData) => {
      if (Object.keys(recurrableData.current_order).length > 0) {
        const orderIndex = this.orders.findIndex(
          (el) => recurrableData.current_order.id === el.id
        )
        if (orderIndex !== -1)
          this.orders[orderIndex] = recurrableData.current_order
      }

      const recurrableIndex = this.recurrables.findIndex(
        (recurrable) => recurrable.id === recurrableData.id
      )
      if (recurrableIndex !== -1) {
        this.recurrables[recurrableIndex].current_order =
          recurrableData.current_order
        this.recurrables[recurrableIndex].always_send =
          recurrableData.always_send
      }
    })
  },

  neverSend(payload) {
    const coffee = this.coffees.find(
      (coffee) => coffee.coffee_id === payload.coffee_id
    )
    const index = this.coffees.indexOf(coffee)
    this.coffees[index].never_send = true
    this.coffees[index].always_send = false
  },

  setPageHistoryMax(payload) {
    this.receiptPageMax = payload
  },

  setCsModeOn() {
    this.cs_mode = true
  },

  setCsModeOff() {
    this.cs_mode = false
  },

  handleAccountSidebar(payload) {
    this.showSidebar = payload
  },

  // Rate Advent Coffees Page
  resetInfoAdventCoffees() {
    this.advent_coffees = undefined
  },

  updateAdventCoffees(payload) {
    this.advent_coffees = payload
  },

  updateAdventCoffeesRating(payload) {
    const coffee = this.advent_coffees.find(
      (coffee) => coffee.coffee.coffee_id === payload.coffee_id
    )
    const index = this.advent_coffees.indexOf(coffee)
    this.advent_coffees[index].coffee_rated = true
    this.advent_coffees[index].coffee_rating = payload
  },

  updateUserRecurrableStateCount(payload) {
    this.recurrable_state_count = payload.recurrables ? payload.recurrables : payload
  },

  // Actions

  async login(payload) {
    return api.users.loginV3(payload.email, payload.password).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        const user = response.data.user
        const token = response.data.token
        /*if (user.type === 'B2bUser') {
          //is B2B
        } else {
          // is D2C
          window.location.href = `${DEFAULT_HOST_D2C}/login?token=${token.id}`;
        }*/
        cookieHandler.setToken(token.id)
        this.saveInfo({ ...user, token: token.id, recurrable_state_count: response.data.recurrables })
        GTM.ImpactIdentify(response.data.user.id, response.data.user.email)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async logout(payload) {
    return api.users.logoutV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        cookieHandler.deleteToken()
        this.resetInfo()
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  // Api calls related to user info

  async getUserInfo(payload) {
    return api.users.getUserInfoV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateInfo(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateUserInfo(payload) {
    return api.users.updateUserInfoV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateInfo(payload)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateUserEmail(payload) {
    return api.users.updateUserEmailV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateEmail(payload)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateUserPasswordV3(payload) {
    return api.users.updateUserPassword(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getCards(payload) {
    return api.users.getCardsV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateCards(response.data)
        if (response.data.length > 0) {
          this.getCardAddress(response.data[0].id)
        }
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getCardAddress(payload) {
    return api.users.getCardAddressV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateCardAddress(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateUserCard(payload) {
    return api.users.updateUserCardV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateCard(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getAddresses(payload) {
    this.updateGettingAddresses(true)
    return api.users.getAddressesV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateAddresses(response.data)
        this.updateGettingAddresses(false)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async createAddress(payload) {
    return api.users.createAddressV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.addAddress(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async editAddress(payload) {
    return api.users.editAddressV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.editAddressUpdate(response.data)
        this.updatePrimaryRecurrableAddress(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async removeAddress(payload) {
    return api.users.deleteAddressV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.removeAddressUpdate(payload.id)
      if (payload?.callback) payload.callback(result)
    })
  },

  // Api calls related to the recurrables

  async createRecurrable(payload) {
    return api.users.createRecurrableV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getPrimaryRecurrable(payload) {
    return api.users.getPrimaryRecurrableV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data)
        this.saveNextOrderRecurrable(response.data.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrableTiers(payload) {
    return api.users.getRecurrableTiersV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrableSizes(payload) {
    return api.users.getRecurrableSizesV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrableCoffeeTypes(payload) {
    return api.users.getRecurrableCoffeeTypesV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrableCoffees(payload) {
    return api.users.getRecurrableCoffeesV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableName(payload) {
    return api.users.updateRecurrableNameV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableTier(payload) {
    return api.users.updateRecurrableTierV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableBrewMethod(payload) {
    return api.users.updateRecurrableBrewMethodV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableCoffeeType(payload) {
    return api.users.updateRecurrableCoffeeTypeV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableSize(payload) {
    return api.users.updateRecurrableSizeV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableFrequency(payload) {
    return api.users.updateRecurrableFrequencyV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateRecurrableAddress(payload) {
    return api.users.updateRecurrableAddressV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrablesSwitchList(payload) {
    return api.users.getRecurrablesSwitchListV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateRecurrablesSwitchList(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getPausedRecurrables(payload) {
    return api.users.getPausedRecurrablesV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePausedRecurrables(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRecurrablebyId(payload) {
    return api.users.getRecurrablebyIdV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },
  async pauseRecurrable(payload) {
    return api.users.pauseRecurrableV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateUserRecurrableStateCount(response.data.recurrables_state_count)
        this.updateSwitchListRecurrableState({
            id: response.data.recurrable.id,
            state: response.data.recurrable.current_state,
            current_order: {},
          })
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.getRecurrablesSwitchList()
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async unPauseRecurrable(payload) {
    return api.users.unPauseRecurrableV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateUserRecurrableStateCount(response.data.recurrables_state_count)
        this.getRecurrablesSwitchList({
          id: response.data.id,
          state: response.data.current_state,
          current_order: response.data.current_order,
        })
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.getRecurrablesSwitchList()
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async cancelRecurrable(payload) {
    return api.users.cancelRecurrableV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateUserRecurrableStateCount(response.data.recurrables_state_count)
        this.removeRecurrableFromSwitchList({ id: payload.id })
        this.getPrimaryRecurrable()
        this.getRecurrablesSwitchList()
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getRetentionFlowPlans(payload) {
    return api.users.getRetentionPlans(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateRetentionPlans(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },


  async updateCancelPauseFlowPlanAmount(payload) {
    return api.users.updateCancelPauseFlowPlanAmountV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateCancelPauseFlowPlanTier(payload) {
    return api.users.updateCancelPauseFlowPlanTierV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

// Addons
  async getRecurrableAvailableAddons(payload) {
    return api.users.availableProductAddonsV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateCarouselAddons(response.data)
      }
      if(payload?.callback) payload.callback(result)
    })
  },

  async addOrderAddons(payload) {
    return api.users.addOrderAddonsV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async deleteOrderAddon(payload) {
    return api.users.deleteOrderAddonV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
        if (payload?.callback) payload.callback(result)
      }
    })
  },

  async addAddons(payload) {
    return api.users.addAddonsV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async updateAddons(payload) {
    return api.users.updateAddonsV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updatePrimaryRecurrable(response.data)
      if (result.status === 'ok' && payload?.callback) payload.callback(result)
    })
  },

  async deleteAddon(payload) {
    return api.users.deleteAddonV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
        if (payload?.callback) payload.callback(result)
      }
    })
  },

  async syncDeleteAddon(payload) {
    return api.users.deleteAddonV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
        if (payload?.callback) payload.callback(result)
      }
    })
  },

// order history
  async loadOrdersHistoryByYear(payload) {
    return api.users.getOrdersHistoryV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateOrdersHistory(response.data)
        if (payload?.callback) payload.callback(result)
      }
    })
  },

  async getLoadOrderDetail(payload) {
    return api.users.getOrderDetailsV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') return response.data
      return null
    })
  },


// Orders
  async updateOrderItems(payload) {
    return api.users.updateOrderItemV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async rescheduleOrder(payload) {
    return api.users.rescheduleOrderV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async asapOrder(payload) {
    return api.users.asapOrderV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async delayOrder(payload) {
    return api.users.delayOrderV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async skipOrder(payload) {
		return api.users.skipOrderV3({ order_id: payload.id }).then(response => {
			var result = checkResponse(response)
			if (result.status === 'ok') {
        this.updatePrimaryRecurrable(response.data.recurrable)
        this.updatePrimaryRecurrableOrder(response.data.recurrable.current_order)
      }
			if (payload?.callback) payload.callback(result)
		})
	},

  async checkSchedule(payload) {
    return api.users.checkScheduleV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },


  async redeemVoucher(payload) {
    return api.users.redeemVoucher(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateInfo(response.data.user)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getCoffeesRatings(payload) {
    return api.users.getCoffeesRatingsV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.updateCoffees(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },


  async getRateLastCoffee(payload) {
    return api.users.getRateLastCoffeeV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateLastRateCoffee(response.data)
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async rateNewCoffee(payload) {
    return api.users.rateNewCoffeeV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateRating({
          coffee_id: payload.coffee_id,
          always_send: false,
          never_send: payload.never_send,
          coffee_rating: response.data.coffee_rating,
        })
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async editCoffeeRating(payload) {
    return api.users.editCoffeeRatingV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this.updateRating({
          coffee_id: payload.coffee_id,
          always_send: false,
          never_send: payload.never_send,
          coffee_rating: response.data.coffee_rating,
        })
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async rateRecurrables(payload) {
    return api.users.rateRecurrablesV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async whitelist(payload) {
    return api.users.whitelistV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') this.neverSend(payload)
      if (payload?.callback) payload.callback(result)
    })
  },

  async alwaysSend(payload) {
    return api.users.alwaysSendV3(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        this._alwaysSend({
          coffee_id: payload.coffee_id,
          data: result.data,
        })
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async sendEmailInvites(payload) {
    return api.users.sendEmailInvitesV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async referralStats(payload) {
    return api.users.referralStatsV3().then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok' && payload?.callback) payload.callback(result)
    })
  },

  async submitUserGiftOption(payload) {
    return api.users.submitUserGiftOptionV3(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  // V2

  async createUserFunnel(payload) {
    return api.users.createUserFunnel(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async createUserStore(payload) {
    return api.users.createUserStore(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async claimIdentity(payload) {
    return api.users.claimIdentity(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async expressCheckoutPlan(payload) {
    return api.users.checkoutExpressPlan(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async authValidateVoucher(payload) {
    return api.users.validateVoucher(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  // async loadOrders(payload) {
  //   return api.users.getOrders().then((response) => {
  //     const result = checkResponse(response)
  //     if (result.status === 'ok') this.updateOrders(response.data)
  //     if (payload?.callback) payload.callback(result)
  //   })
  // },


  // Rate Advent Coffees Page
  async loginEUAdventRatings(payload) {
    return api.users
      .loginEUAdventRatings(payload.email, payload.password, payload.opt_in)
      .then((response) => {
        const result = checkResponse(response)
        if (result.status === 'ok') {
          const user = response.data.user
          const token = response.data.token
          const recurrable_state_count = response.data.recurrables
          cookieHandler.setToken(token.id)
          this.saveInfo({
            ...user,
            token: token.id,
            recurrable_state_count: recurrable_state_count,
          })
          GTM.AdventsRateLogin(
            response.data.user.id,
            response.data.user.email,
            false
          )
        }
        if (payload?.callback) payload.callback(result)
      })
  },

  async loginNUAdventRatings(payload) {
    return api.users.loginNUAdventRatings(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok') {
        const user = response.data.user
        const token = response.data.token
        const recurrable_state_count = response.data.recurrables
        cookieHandler.setToken(token.id)
        this.saveInfo({
          ...user,
          token: token.id,
          recurrable_state_count: recurrable_state_count,
        })
        GTM.AdventsRateLogin(
          response.data.user.id,
          response.data.user.email,
          true
        )
      }
      if (payload?.callback) payload.callback(result)
    })
  },

  async getUserAdventCoffees(payload) {
    return api.users.getUserAdventCoffees(payload.day).then((response) => {
      const result = checkResponse(response)
      this.resetInfoAdventCoffees()
      if (result.status === 'ok') this.updateAdventCoffees(response.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  async rateAdventCoffee(payload) {
    return api.users.rateAdventCoffee(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok')
        this.updateAdventCoffeesRating(response.data.coffee_rating)
      if (payload?.callback) payload.callback(result)
    })
  },

  async rateAdventDuplicatePlan(payload) {
    return api.users.rateAdventDuplicatePlan(payload).then((response) => {
      const result = checkResponse(response)
      if (payload?.callback) payload.callback(result)
    })
  },

  async getUserRecurrableStateCount(payload) {
    return api.users.getUserRecurrableStateCount(payload).then((response) => {
      const result = checkResponse(response)
      if (result.status === 'ok')
        this.updateUserRecurrableStateCount(result.data)
      if (payload?.callback) payload.callback(result)
    })
  },

  csMode() {
    this.setCsModeOn()
    setTimeout(() => {
      this.setCsModeOff()
    }, 300000)
  },

  openSidebar() {
    this.handleAccountSidebar(true)
  },

  closeSidebar() {
    this.handleAccountSidebar(false)
  },
}