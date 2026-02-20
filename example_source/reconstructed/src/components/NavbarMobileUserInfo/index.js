

import { createApp } from 'vue'
import NavbarMobileUserInfo from './NavbarMobileUserInfo.vue'
import { setupStore } from "../../utils/stores/index";

import('../../utils/store').then(function (store) {
  const app = createApp(NavbarMobileUserInfo)
  setupStore(app)
  app.use(store.default)
  app.mount('#nav-user-info')
})
