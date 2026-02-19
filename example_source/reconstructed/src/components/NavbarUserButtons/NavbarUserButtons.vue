<template>
	<div class="navbar-right navbar-shrink-desktop">
		<ul class="navbar-nav d-flex navbar-first-ul">
			<!-- <button v-if="isTablet" class="btn btn-secondary tablet-business my-auto px-2" @click="goTo('https://business.pactcoffee.com/')">pact for business</button> -->
			<li class="basket-dropdown">
				<button class="basket-toggler px-2" type="button" @click="basketclickAction()" >
					<span>
						<span class="icon" />
						<span
							v-if="totalItems > 0"
							:class="{
								'ml-2 navbar-items-number': true,
								'char-1': totalItems < 10,
								'chars-2': (totalItems >= 10) & (totalItems < 100),
								'chars-3': totalItems >= 100,
							}"
							>{{ totalItems }}</span
						>
					</span>
				</button>
			</li>
			<li class="account-dropdown">
				<button
					type="button"
					class="account-toggler inverted-hover px-2"
					@click="handleClick"
				>
					<span id="account-icon" class="icon" />
				</button>
			</li>
		</ul>
	</div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useAuthUser } from '../../utils/stores/modules/authUser'
import { useMobileHelpers } from '../utils/composables/mobileHelpers'

// Props (defineProps)
// Emits (defineEmits)
// Reactive variables (inc composables)
const store = useStore()
const userStore = useAuthUser()
const { isMobile } = useMobileHelpers()
// Computed
const isOnline = computed(() => userStore.isOnline)
const getShowSidebar = computed(() => userStore.getShowSidebar)
const totalItems = computed(() => store.getters['basket/totalItems'])
const isInAccount = computed(() => window.location.pathname.startsWith('/account'))
// Methods
function openSidebar() {
  userStore.openSidebar()
}
function closeSidebar() {
  userStore.closeSidebar()
}
function basketclickAction() {
  if(totalItems.value > 0)
    store.dispatch('basket/basketValidations')
  setTimeout(() => {
    toggleBasket()
  }, 500);
}
function handleClick() {
  var href = isOnline.value ? '/account' : '/login'
  if (isMobile.value) {
    if (isInAccount.value) {
      if (getShowSidebar.value) closeSidebar()
      else openSidebar()
    } else {
      var hrefMobile = isOnline.value ? '/account/my-subscription' : '/login'
      routeRedirect(hrefMobile)
      openSidebar()
    }
  } else {
    routeRedirect(href)
  }
}
function routeRedirect(href) {
  return (window.location.href = href)
}
function goTo(url) {
  window.location = url
}
// Watchers
// Lifecycle Hooks
onMounted(() => {
  if(totalItems.value > 0)
    store.dispatch('basket/checkBasketLifeTimeForReset')
})
// Expose (defineExpose)
</script>
<script>
export default {
	name: 'NavbarUserButtons',
}
</script>
