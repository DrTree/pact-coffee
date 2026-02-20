import { createApp } from 'vue'
import VoucherNotificationBanner from './VoucherNotificationBanner.vue'

import('../../utils/store').then(function (store) {
  const mount = document.querySelector("#voucher-notification-banner")
  const app = createApp(VoucherNotificationBanner, { ...mount.dataset })
  app.use(store.default)
  app.mount('#voucher-notification-banner')
})