import { createApp } from 'vue'
import NavbarUserButtons from './NavbarUserButtons.vue'
import { setupStore } from "../../utils/stores/index";

import('../../utils/store').then(function (store) {
	const app = createApp(NavbarUserButtons)
  setupStore(app)
	app.use(store.default)
	app.mount('#navbar-user-buttons')
})
