<template>
	<div
		v-if="active"
		:class="{
			'bt-white': true,
			'checkout-btn-sticky': stickyBtn,
			'hide-checkout-btn-sticky': !stickyBtn,
		}"
	>
		<div class="row mx-0">
			<div class="col-12 px-0 basket-footer" style="left: 0px; width: 100%">
				<!-- <BasketTotals :is_basket_sticky="true"/> -->
				<div class="m m-top">
    			<BasketPaymentRequestButton @checkout-click="emit('clicked')" :checkoutcta="btncta" extraid="2" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { toRefs, ref, onMounted, defineAsyncComponent } from 'vue'

	import BasketTotals from './BasketTotals/BasketTotals.vue'
  const BasketPaymentRequestButton = defineAsyncComponent(() =>
		import('../../Forms/Stripe/BasketPaymentRequestButton.vue')
	)
	// Props (defineProps)
	const props = defineProps({
		active: {
			type: String,
			required: true,
		},
		btncta: {
			type: String,
			required: false,
			default: 'Checkout',
		},
	})
	// Emits (defineEmits)
	const emit = defineEmits(['clicked'])
	// Reactive variables (inc composables)
	const { active, btncta } = toRefs(props)

	const stickyBtn = ref(false)
	// Computed
	// Methods

	function stickyCheckoutBtn() {
		var basketContainer = document.getElementById('basket-cnt')
		var body = document.getElementsByTagName('body')[0]
		basketContainer.addEventListener('scroll', function () {
			var el = document.getElementById('checkout-btn')
			if (active.value && body.classList.contains('open-basket')) stickyBtn.value = !isElementInViewport(el)
			else stickyBtn.value = false
		})
		// stickyBtn = true -> show sticky
		// stickyBtn = false -> hide sticky
	}
	function isElementInViewport(el) {
		if (el) {
			var rect = el.getBoundingClientRect()

			//rect.bottom > 0 &&
			return (
				rect.right > 0 &&
				rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
				rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */
			)
		}
	}

	function itemListHeight() {
		var list = document.getElementById('items-list')
		if (list) {
			var rect = list.getBoundingClientRect()
			return rect.y + rect.height > (window.innerHeight || document.documentElement.clientHeight)
		}
	}

	// Watchers
	// Lifecycle Hooks
	onMounted(() => {
		if (active.value) {
			stickyBtn.value = itemListHeight()
			window.addEventListener('resize', function () {
				stickyBtn.value = itemListHeight()
			})
		}
		stickyCheckoutBtn()
	})
	// Expose (defineExpose)
</script>

<style lang="scss">
	.checkout-btn-sticky {
		position: sticky;
		position: -webkit-sticky;
		bottom: 0;
		background: white;
		width: 100%;
		padding: 0 20px;
		// filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
		z-index: 3;

		// @media (max-width: 572px) {
		// 	bottom: 50px;
		// }

		.basket-footer {
			position: relative;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 2;
			text-align: center;

			.basket-total {
				padding: 20px 0 16px;
				margin-bottom: 30px;
				text-align: right;

				span {
					float: left;
					margin-top: 8px;
				}
			}
		}
	}

	.hide-checkout-btn-sticky {
		display: none;
	}
</style>
