export default {
  saveInfo(state, payload) {
    state.id = payload.id
    state.email = payload.email
    state.phone_number = payload.phone_number
    state.opt_in = payload.opt_in
    state.first_name = payload.first_name
    state.last_name = payload.last_name
    state.balance = payload.balance
    state.is_pioneer = payload.pact_pioneer
    state.advent_coffees_rated = payload.advent_coffees_rated
    state.is_pod_pioneer = payload.pod_pioneer
    state.viral_code = payload.viral_code
    state.pricePolicy = payload.price_policy
    state.token = payload.token
    state.type = payload.type
    state.employee_discount = payload.employee_discount
    state.card_declined = payload.card_declined
    state.timeOfLastPull = Date.now()
    state.recurrable_state_count = payload.recurrable_state_count
    state.signup_context = payload.signup_context
  },
  resetInfo(state) {
    state.id = undefined
    state.email = undefined
    state.phone_number = undefined
    state.first_name = undefined
    state.last_name = undefined
    state.balance = undefined
    state.viral_code = undefined
    state.pricePolicy = undefined
    state.token = undefined
    state.is_pioneer = false
    state.is_pod_pioneer = false
    state.advent_coffees_rated = false
    state.opt_in = false
    state.timeOfLastPull = undefined
    state.type = undefined
    state.receiptPage = 0
    state.employee_discount = undefined
    state.card_declined = undefined
    state.receiptPageMax = 1
    state.addresses = []
    state.getting_addresses = 'undefined'
    state.cards = []
    state.orders = []
    state.recurrables = []
    state.coffees = []
    state.ordersHistory = {
      orders: [],
      current_page: 0,
      max: 0
    }
    state.recurrable_state_count = undefined
    state.signup_context = undefined
  },
  updateInfo(state, payload) {
    state.balance = payload.balance ? payload.balance : state.balance
    state.email = payload.email ? payload.email : state.email
    state.first_name = payload.first_name ? payload.first_name : state.first_name
    state.last_name = payload.last_name ? payload.last_name : state.last_name
    state.id = payload.id ? payload.id : state.id
    state.phone_number = payload.phone_number ? payload.phone_number : state.phone_number
    state.is_pioneer = payload.pact_pioneer ? payload.pact_pioneer : state.pact_pioneer
    state.advent_coffees_rated = payload.advent_coffees_rated ? payload.advent_coffees_rated : state.advent_coffees_rated
    state.opt_in =
      payload.opt_in !== undefined || payload.opt_in !== null
        ? payload.opt_in
        : state.opt_in
    state.viral_code = payload.viral_code ? payload.viral_code : state.viral_code
    state.type = payload.type ? payload.type : state.type
    state.employee_discount = payload.employee_discount
    state.card_declined = payload.card_declined
    state.recurrable_state_count = payload.recurrable_state_count ? payload.recurrable_state_count : state.recurrable_state_count
  },
  updateEmail(state, payload) {
    state.email = payload.email
  },
  updateCards(state, payload) {
    state.cards = payload
  },
  updateCard(state, payload) {
    state.cards = [payload]
    state.card_declined = false
  },
  updateCardAddress(state, payload) {
    state.cards[0] = { ...state.cards[0], billing_address: payload }
  },
  updateAddresses(state, payload) {
    state.addresses = payload
  },
  gettingAddresses(state, payload) {
    state.getting_addresses = payload
  },
  gettingSignupContext(state, payload) {
    state.signup_context = payload
  },
  updateCoffees(state, payload) {
    state.coffees = payload
  },
  updateOrders(state, payload) {
    state.orders = payload
  },
  addAddress(state, payload) {
    state.addresses.push(payload)
  },
  editAddress(state, payload) {
    //NW
    const i = state.addresses.map((item) => item.id).indexOf(payload.id)
    state.addresses[i] = payload
  },
  removeAddress(state, payload) {
    const i = state.addresses.map((item) => item.id).indexOf(payload)
    state.addresses.splice(i, 1)
  },
  updateRecurrables(state, payload) {
    state.recurrables = payload
  },
  updateRecurrable(state, payload) {
    //NW
    const i = state.recurrables.map((item) => item.id).indexOf(payload.id)
    state.recurrables[i] = payload
  },
  updateRecurrableState(state, payload) {
    const i = state.recurrables.map((item) => item.id).indexOf(payload.id)
    state.recurrables[i] = {
      ...state.recurrables[i],
      current_state: payload.state,
      current_order: payload.current_order,
    }
  },
  removeRecurrable(state, payload) {
    const i = state.recurrables.map((item) => item.id).indexOf(payload.id)
    state.recurrables.splice(i, 1)
  },
  updateOrder(state, payload) {
    const orderIndex = state.orders.indexOf(state.orders.find((item) => item.id === payload.id))
    state.orders[orderIndex] = payload
    if (payload.recurrable_id) {
      var recurrable = state.recurrables.find(recurrable => recurrable.id === payload.recurrable_id)
      const recurrableIndex = state.recurrables.indexOf(recurrable)
      recurrable.current_order = payload
      state.recurrables[recurrableIndex] = recurrable
    }
  },
  firstLoadOrdersHistory(state, payload) {
    state.ordersHistory.orders = payload.receipts
    state.ordersHistory.current_page = payload.current_page
    state.ordersHistory.max = payload.total_pages
  },
  updateOrdersHistory(state, payload) {
    state.ordersHistory.orders = state.ordersHistory.orders.concat(payload.receipts)
    state.ordersHistory.current_page = payload.current_page < payload.total_pages ? payload.current_page : payload.total_pages
    state.ordersHistory.max = payload.total_pages
  },
  updateRating(state, payload) {
    var coffee = state.coffees.find((coffee) => coffee.coffee_id === payload.coffee_id)
    var index = state.coffees.indexOf(coffee)
    state.coffees[index].coffee_rating = payload.coffee_rating
    state.coffees[index].never_send = payload.never_send || false
    state.coffees[index].always_send = payload.always_send || false
  },
  alwaysSend(state, payload) {
    var coffee = state.coffees.find((coffee) => coffee.coffee_id === payload.coffee_id)
    var index = state.coffees.indexOf(coffee)
    state.coffees[index].always_send = true
    state.coffees[index].never_send = false
    payload.data.forEach(recurrableData => {
      if (Object.keys(recurrableData.current_order).length > 0) {
        var orderIndex = state.orders.findIndex(el => recurrableData.current_order.id === el.id)
        if (orderIndex !== -1)
          state.orders[orderIndex] = recurrableData.current_order
      }
      var recurrableIndex = state.recurrables.findIndex(recurrable => recurrable.id === recurrableData.id)
      if (recurrableIndex !== -1) {
        state.recurrables[recurrableIndex].current_order = recurrableData.current_order 
        state.recurrables[recurrableIndex].always_send = recurrableData.always_send
      }
    })
  },
  neverSend(state, payload) {
    var coffee = state.coffees.find((coffee) => coffee.coffee_id === payload.coffee_id)
    var index = state.coffees.indexOf(coffee)
    state.coffees[index].never_send = true
    state.coffees[index].always_send = false
  },
  setPageHistoryMax(state, payload) {
    state.receiptPageMax = payload
  },
  setCsModeOn(state) {
    state.cs_mode = true
  },
  setCsModeOff(state) {
    state.cs_mode = false
  },
  handleAccountSidebar(state,payload) {
    state.showSidebar = payload
  },
  // Rate Advent Coffees Page
  resetInfoAdventCoffees(state) {
    state.advent_coffees = undefined
  },
  updateAdventCoffees(state, payload) {
    state.advent_coffees = payload
  },
  updateAdventCoffeesRating(state, payload) {
    var coffee = state.advent_coffees.find((coffee) => coffee.coffee.coffee_id === payload.coffee_id)
    var index = state.advent_coffees.indexOf(coffee)
    state.advent_coffees[index].coffee_rated = true
    state.advent_coffees[index].coffee_rating = payload
  },
  updateUserRecurrableStateCount(state, payload) {
    state.recurrable_state_count = payload.recurrables
  },
}
