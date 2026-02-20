import { createApp } from 'vue'
import Notification from './Notification.vue'

import('../../utils/store').then(function (store) {
	const app = createApp(Notification)
	app.use(store.default)
	app.mount('#notification')
})
