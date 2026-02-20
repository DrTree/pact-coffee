
import { createApp } from 'vue'
import LoginButtonMobile from '../utils/loginButtonMobile.vue'
import { setupStore } from "../../utils/stores/index";
import('../../utils/store').then(function (store) {
  const app = createApp(LoginButtonMobile)
  setupStore(app)
  app.use(store.default)
  app.mount('#login-button-mobile')
})
