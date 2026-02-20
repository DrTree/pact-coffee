import { createApp } from 'vue'
import SitewideBanner from './SitewideBanner.vue'
//import pinia
import { setupStore } from "../../utils/stores/index";

import('../../utils/store').then(function (store) {
	const mountEl = document.querySelector('#sitewide-banner')
	const app = createApp(SitewideBanner, { ...mountEl.dataset })
  setupStore(app)
	app.use(store.default)
	app.mount('#sitewide-banner')
})
