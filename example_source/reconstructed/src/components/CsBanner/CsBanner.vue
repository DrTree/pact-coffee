<template>
  <div
    v-if="cs_mode"
    :class="{
      'cs-banner t-center d-flex': true,
    }"
  >
    <span class="notification-message m-auto t-black t-bold"> CUSTOMER SUPPORT LOGIN MODE FOR USER  *** {{ email }} *** </span>
  </div>
</template>

<script>
  import { useAuthUser } from '../../utils/stores/modules/authUser'

	export default {
		name: 'CsBanner',
		props: {
			dismissible: {
				type: Boolean,
				default: true,
			},
		},
    setup(){
      const userStore = useAuthUser()
      return {
        userStore
      }
    },
		computed: {
      email(){
        return this.userStore.userEmail
      },
      cs_mode(){
        return this.userStore.CustomerServiceMode
      }
		},
		mounted() {
      var isOnIOS = window.navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i)
      var eventName = isOnIOS ? "pagehide" : "beforeunload"
			window[eventName] = this.turnOff
      if(!this.email || this.email === '' || this.email === ' ') this.setCsModeOff()
		},
		methods: {
      setCsModeOff(){
        this.userStore.setCsModeOff()
      }
		},
	}
</script>
<style lang="scss">
.cs-banner{
  background-color: #a6d5d5;
  height: 50px;
  border: 2px solid black;
  z-index: 110;
  position: fixed;
  width: 100%;
}
</style>

