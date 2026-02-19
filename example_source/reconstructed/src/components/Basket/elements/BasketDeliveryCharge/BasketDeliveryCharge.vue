<template>
	<div class="row mx-0 delivery-field">
		<div v-if="free_delivery" class="col-12 px-0 t-center">
			<span class="delivery-check">You’ve qualified for <b>FREE Delivery!</b></span>
		</div>
		<div v-else class="col-12 px-0 t-center">
			<span class="delivery-check"
				>Spend <b>£{{ parseFloat(amount_to_free_delivery).toFixed(2) }}</b> more to get FREE delivery!</span
			>
		</div>
		<div class="col-12 px-0 pt-3 pb-2">
			<DeliveryBar :complete="free_delivery" :filled="bar_fill" customization="delivery" />
		</div>
		<div class="col-12 px-0 row mx-0">
			<div class="col-6 px-0 t-left">
				<span class="delivery-mark">£0</span>
			</div>
			<div class="col-6 px-0 t-right">
				<span class="delivery-mark">£15</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { useBasketHelpers } from '../../composables/basketHelpers'
	import DeliveryBar from './DeliveryBar.vue'
	// Props (defineProps)
	// Emits (defineEmits)
	// Reactive variables (inc composables)
	const { free_delivery, amount_to_free_delivery } = useBasketHelpers()
	// Computed
	const bar_fill = computed(() => {
		const is_filled = 15 - amount_to_free_delivery.value
		return (is_filled * 100) / 15
	})
	// Methods
	// Watchers
	// Lifecycle Hooks
	// Expose (defineExpose)
</script>

<style lang="scss" scoped>
	.delivery-field {
		padding-top: 25px;
	}
	span.delivery-check {
		font-family: 'Apercu';
		font-style: normal;
		font-weight: 300;
		font-size: 16px;
		line-height: 16px;
		color: #1d4045;
		b {
			font-weight: 700;
		}
	}
	span.delivery-mark {
		font-family: 'Apercu-medium';
		font-weight: 500;
		font-size: 16px;
		line-height: 16px;
		color: #1d4045;
	}
</style>
