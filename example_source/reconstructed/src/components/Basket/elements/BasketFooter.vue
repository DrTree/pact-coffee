<template>
	<div
		id="basket-footer"
		:class="{
			'col-12 px-0 basket-footer': true,
			[customization]: true,
		}"
		style="left: 0px; width: 100%"
	>
		<BasketTotals :deliveryInfoBox="deliveryInfoBox" />
		<div class="m">
			<BasketPaymentRequestButton @checkout-click="emit('clicked')" :checkoutcta="btncta" />
		</div>
	</div>
</template>

<script setup>
	import { toRefs, defineAsyncComponent } from 'vue'

	import BasketTotals from './BasketTotals/BasketTotals.vue'
	const BasketPaymentRequestButton = defineAsyncComponent(() =>
		import('../../Forms/Stripe/BasketPaymentRequestButton.vue')
	)

	// Props (defineProps)
	const props = defineProps({
		customization: {
			type: String,
			required: false,
			default: '',
		},
		btncta: {
			type: String,
			required: false,
			default: 'Checkout',
		},
		deliveryInfoBox: {
			type: Boolean,
			required: false,
			default: false,
		},
	})
	// Emits (defineEmits)
	const emit = defineEmits(['clicked'])
	// Reactive variables (inc composables)
	const { customization, btncta } = toRefs(props)
	// Computed
	// Methods
	// Watchers
	// Lifecycle Hooks
	// Expose (defineExpose)
</script>

<style lang="scss" scoped></style>