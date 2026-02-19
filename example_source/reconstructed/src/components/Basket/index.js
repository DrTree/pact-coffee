import { createApp } from 'vue'
import Basket from './views/Basket.vue'
//import pinia
import { setupStore } from "../../utils/stores/index";
// stripe
import '@stripe/stripe-js'
var stripe_key =
	process.env.NODE_ENV === 'production' ? process.env.STRIPE_PUBLISHABLE_KEY : 'pk_test_Uk8G5S4to7ggk4I7BAYVxDHV'
import { loadStripe } from '@stripe/stripe-js'

import('../../utils/store').then(async function (store) {
	const app = createApp(Basket)
  const stripe = await loadStripe(stripe_key)
  app.config.globalProperties.$stripe = stripe
  app.provide('stripe_ref', stripe)
  setupStore(app)
	app.use(store.default)
	app.mount('#basket')
})
