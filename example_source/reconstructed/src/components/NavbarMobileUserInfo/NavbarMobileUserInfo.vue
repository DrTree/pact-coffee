<template>
  <a
    v-if="isOnline"
    href="/account/my-subscription"
    id="account-nav-banner"
    :class="{'loggedin-header': true, 'show-account-banner': isOnline }"
  >
    <div class="">
      <p class="user-account-link d-inline">Your Account</p>
      <img
        class="user-account-link-img d-inline"
        src="/assets/icons/secondary/chevron-rounded-right.svg"
        alt="user account link arrow"
      />
    </div>
    <div class="d-flex mt-2">
      <img
        class="user-avatar-img d-inline"
        src="/assets/icons/orange/user-account-secondary.svg"
        alt="user account navbar avatar"
      />
      <div class="d-inline ml-2">
        <p class="user-full-name">{{ full_name }}</p>
        <p v-if="next_shipment_date" class="user-next-dispatch-date">
          Next dispatch date
          <span class="t-capitalize">{{ getMonthDate(next_shipment_date) }}</span>
        </p>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthUser } from '../../utils/stores/modules/authUser'
import { useDateHelpers } from '../utils/composables/dateHelpers'
// Props (defineProps)
// Emits (defineEmits)
// Reactive variables (inc composables)
  const userStore = useAuthUser()
  const { getMonthDate } = useDateHelpers()
// Computed
	const isOnline = computed(() => userStore.isOnline)
	const full_name = computed(() => userStore.fullName)
  const next_shipment_date = computed (() => userStore.nextShipmentDate)
// Methods
// Watchers
// Lifecycle Hooks
// Expose (defineExpose)
</script>

<style lang="scss" scoped>
</style>
