<template>
	<div class="login-button">
		<a
			v-if="!isOnline"
			href="/account/my-subscription"
			class="apercu-medium let-spacing-1 account-icon-login"
		>
			<span>{{ loginButtonText }}</span>
		</a>
		<a
			class="apercu-medium let-spacing-1 account-icon-logout no-arrow"
			v-else
			@click="logoutLocal"
		>
			<span>{{ loginButtonText }}</span>
		</a>
	</div>
</template>
<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useAuthUser } from '../../utils/stores/modules/authUser'
const store = useStore()
const userStore = useAuthUser()
const router = useRouter()
// Props (defineProps)
// Emits (defineEmits)
// Reactive variables (inc composables)
// Computed
const isOnline = computed(() => userStore.isOnline)
const loginButtonText = computed(() => isOnline.value ? 'Log out' : 'Log in')
// Methods
function logout(payload){
  userStore.logout(payload)
}
function logoutLocal(){
  if(window.location.pathname.startsWith('/account')) {
		userStore.closeSidebar()
		logout({ callback: goLogin })
	}
  else logout()
}
function goLogin(response) {
  if (response.status === 'ok') router.push('/login')
}
function handleNavUserInfoHeight() {
  const nav_wrap = document.querySelector('#nav-wrap')
  nav_wrap.style.maxHeight = isOnline.value ? 'calc('+100+'vh - '+180+'px)' : 100+'%'
}
// Watchers
watch(isOnline, (newV) => {
  handleNavUserInfoHeight()
})
// Lifecycle Hooks
onMounted(() => {
  handleNavUserInfoHeight()
})
// Expose (defineExpose)
</script>
<script>
export default {
	name: 'LoginButtonMobile',
}
</script>

<style></style>
