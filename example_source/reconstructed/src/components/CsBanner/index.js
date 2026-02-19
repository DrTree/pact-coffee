import { createApp } from 'vue'
import CsBanner from './CsBanner.vue'
//import pinia
import { setupStore } from "../../utils/stores/index";

import('../../utils/store').then(function (store) {
	const app = createApp(CsBanner)
  setupStore(app)
	app.use(store.default)
	app.mount('#cs-banner')
})

