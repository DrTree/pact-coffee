import { createApp } from 'vue'
import NewsletterForm from './NewsletterForm.vue'


import('../../utils/store').then(function (store) {
const mountElements = document.querySelectorAll('[id^=newsletter-form]')
  mountElements.forEach((element) => {
    const app = createApp(NewsletterForm)
    app.use(store.default)
    app.mount(element)
  })
})
