import objects from '../../../../components/utils/objects/handleObjects.js'
const ttp = process.env.TIME_TO_UPDATE ? process.env.TIME_TO_UPDATE : 1000

export default {
  isOnline: (state) => !!state.id,
  userId: (state) => state.id,
  accountBalance: (state) => state.balance,

  firstName: (state) => state.first_name,
  lastName: (state) => state.last_name,
  fullName: (state) => state.first_name + ' ' + state.last_name,

  optIn: (state) => state.opt_in,
  userEmail: (state) => state.email,
  phoneNumber: (state) => state.phone_number,
  viralCode: (state) => state.viral_code,

  isPioneer: (state) => state.is_pioneer,
  isPodPioneer: (state) => state.is_pod_pioneer,
  userType: (state) => state.type,
  isAdventRated: (state) => state.advent_coffees_rated,

  ordersHistory: (state) => state.orders_history.orders, // state.ordersHistory,
  ordersHistoryPage: (state) => state.orders_history.current_page,
  ordersHistoryMax: (state) => state.orders_history.max,

  receiptPage: (state) => state.receiptPage,
  receiptPageMax: (state) => state.receiptPageMax,

  userCards: (state) => state.cards,
  userCard: (state) => state.cards[0],

  userAddresses: (state) => state.addresses,
  gettingAddresses: (state) => state.getting_addresses,

  userEmployeeDiscount: (state) => state.employee_discount,
  userCardDeclined: (state) => state.card_declined,
  adventCalendarCoffees: (state) => state.advent_coffees,
  recurrableStateCount: (state) => state.recurrable_state_count,

  primaryRecurrable: (state) => state.primary_recurrable,
  recurrablesSwitchList: (state) => state.recurrables_switch_list,
  pausedRecurrables: (state) => state.paused_recurrables,
  retentionPlans: (state) => state.retention_plans,
  lastRateCoffee: (state) => state.last_rate_coffee,
  nextShipmentDate: (state) => state.next_shipment_date,
  lastCreatedOrderDate: (state) => state.last_created_order_date,
  getNextOrderRecurrable: (state) => state.next_order_recurrable,
  getCarouselAddons: (state) => state.carousel_addons,

  getMostRecentAddressID: (state) =>
    state.addresses.length > 0
      ? state.addresses[state.addresses.length - 1].id
      : 'no_addresses',

  getPricePolicy: (state) => state.pricePolicy,

  getAddressById: (state) => (id) =>
    state.addresses.find((address) => address.id === id),

  plans: (state) => state.recurrables,
  receivedCoffees: (state) => state.coffees,

  planNextOrder: (state) => (planId) => {
    // return state.recurrables.find((plan) => plan?.id === planId)?.current_order
    return state.primaryRecurrable?.id === planId ? state.primaryRecurrable?.current_order : undefined
  },

  CustomerServiceMode: (state) => (state.cs_mode ? state.cs_mode : false),

  getShowSidebar: (state) => state.showSidebar,
}