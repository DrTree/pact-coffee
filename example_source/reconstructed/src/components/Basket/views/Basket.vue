<template>
	<div v-if="sectionData" @mouseenter="removeAutoClosing" class="h-100">
		<!-- HEADER -->
		<div class="wrap">
			<button type="button" class="close" onclick="toggleBasket()">
				<img
					:src="'assets/icons/primary/close_basket.svg'"
					alt="basket-close-button"
					class="close-basket"
					width="200"
				/>
			</button>
			<div class="header pl-0">
				<h3 class="basket-header">{{ sectionData['basket-title'] }}</h3>
			</div>
		</div>
		<!-- end HEADER -->
		<div
			id="basket-cnt"
			:class="{
				'basket-cnt-addons scroller': sortedAddons.length > 0,
				'basket-cnt-no-addons scroller': sortedAddons.length === 0,
			}"
		>
			<div :class="{ 'basket-cnt-wrap': true, 'no-addons': sortedAddons.length === 0 }">
				<div class="row m-0" v-if="totalItems > 0">
					<BasketItems/>
					<div class="col-12 px-0">
						<BasketVoucher customization="PDPDeliveryInfo"/>
						<PDPDeliveryInfo v-if="deliveryInfoBox" :isEnvDeliveryChargeZero="true" :classCustomization="'my-0'" />
            <BasketDeliveryCharge v-else/>
					</div>
					<BasketFooter
						:btn-text="sectionData['checkout-btn']"
						:deliveryInfoBox="deliveryInfoBox"
						@clicked="goCheckout"
					/>
				</div>
				<div class="row m-0" v-else>
					<div
						class="col-12 px-0 item-list h-100 d-flex"
						:style="{
							'min-height':
								sortedAddons.length > 0
									? isMobile
										? '18vh'
										: 'calc(100vh - 778px)'
									: isMobile
									? 'calc(100vh - 364px)'
									: 'calc(100vh - 220px)',
						}"
					>
						<div class="m-auto t-center">
							<img :src="'assets/icons/primary/empty_cart.svg'" alt="empty basket" class="mb-2 mx-auto" width="60" />
							<p class="t-black sm apercu-medium" style="max-width: 170px">
								{{ emptyBasketData['empty-msg'] }}
							</p>
						</div>
					</div>
					<div
						:class="{
							'col-12 px-0 basket-footer': true,
							addons: sortedAddons.length > 0,
						}"
					>
						<div class="basket-btns">
							<a href="/coffees">
								<button
									type="button"
									class="btn btn-gray-md-lighter full-width br-5 md md-txt mb-2 no-shadow let-spacing-1"
								>
									{{ emptyBasketData['btn1-text'] }}
								</button>
							</a>
							<a href="/coffee-equipment">
								<button
									type="button"
									class="btn btn-gray-md-lighter full-width br-5 md md-txt mb-2 no-shadow let-spacing-1"
								>
									{{ emptyBasketData['btn2-text'] }}
								</button>
							</a>
						</div>
					</div>
				</div>

				<!-- <div> <BasketTrustSignifiers />  </div>-->

				<product-swipper-basket
					ref="productSwipperBasket"
					v-if="basket_addons.length > 0"
					:title="sectionData['addons-title']"
					:products="sortedAddons"
					:addonToBasket="qBuy"
				></product-swipper-basket>
        <div class="row mx-0">
          <div class="col-12 px-0 m-top">
            <trust-pilot-small :id="'basket'" :is_version_a="false" :has_full_height="true" />
          </div>
        </div>
			</div>
		</div>
		<BasketStickyBtn :active="totalItems > 0" :btncta="sectionData['checkout-btn']" @clicked="goCheckout" />
		<!--login-button-mobile v-if="isMobile && !isTablet"></login-button-mobile-->
	</div>
</template>

<script setup>
	import { ref, onMounted, computed, defineAsyncComponent, onBeforeMount } from 'vue'
	import { useStore } from 'vuex'
	import * as fs from 'fs'
	import * as yaml from 'js-yaml'
	import * as GTM from '../../../utils/analytics/gtm'
	import { useMobileHelpers } from '../../utils/composables/mobileHelpers'
	import ProductSwipperBasket from '../../utils/productSwipperBasket.vue'
	import BasketFooter from '../elements/BasketFooter.vue'
  import BasketStickyBtn from '../elements/BasketStickyBtn.vue'
  import BasketDeliveryCharge from '../elements/BasketDeliveryCharge/BasketDeliveryCharge.vue'
	import PDPDeliveryInfo from '../../SharedShop/elements/Delivery/PDPDeliveryInfo.vue'
  import { useAuthUser } from '../../../utils/stores/modules/authUser'
  const BasketItems = defineAsyncComponent(() => import('../elements/BasketItems/BasketItems.vue'))
  const BasketVoucher = defineAsyncComponent(() => import('../elements/BasketVoucher/BasketVoucher.vue'))
  const TrustPilotSmall = defineAsyncComponent(() => import('../../SharedShop/elements/TrustPilot/TrustPilotSmall.vue'))

	// Props (defineProps)
	// Emits (defineEmits)
	// Reactive variables (inc composables)
	const store = useStore()
	const userStore = useAuthUser()

	const basket_addons_ref = computed(() => store.getters['shop/basket_addons'])
	const totalItems  = computed(() => store.getters['basket/totalItems'])

	const sectionData = ref({})
	const deliveryInfoBox = ref({})
	const emptyBasketData = ref({})

	const { isMobile, isTablet } = useMobileHelpers()

  const productSwipperBasket = ref(null)
	// Computed
	const basket_addons = computed(() => {
		return basket_addons_ref.value ? basket_addons_ref.value : []
	})
	const sortedAddons = computed(() => {
    var addons = basket_addons.value.map((prod) => {
      return {
				...prod,
				variants: prod.variants.filter((variant) => variant.stock === null || variant.stock > 0 ),
			}
    }).filter((prod) => prod.variants.length > 0)
		addons = [
			...addons.filter((addon) => addon.promoted).sort(positionPromotedAddonSort),
			...addons.filter((addon) => !addon.promoted && addon.basket_addon_position !== null).sort(positionBasketAddonSort),
			...addons.filter((addon) => !addon.promoted && addon.position !== null && addon.basket_addon_position === null).sort(positionAddonSort),
			...addons.filter((addon) => !addon.promoted && addon.position === null && addon.basket_addon_position === null),
		]
		return addons
	})

	// Methods
	function positionPromotedAddonSort(a, b) {
		var a_basket_pos = a.basket_addon_position ? a.basket_addon_position : a.position
		var b_basket_pos = b.basket_addon_position ? b.basket_addon_position : b.position
		return (a_basket_pos || 100000) - (b_basket_pos || 100000)
	}
	function positionBasketAddonSort(a, b) {
		return (a.basket_addon_position || 100000) - (b.basket_addon_position || 100000)
	}
	function positionAddonSort(a, b) {
		return (a.position || 100000) - (b.position || 100000)
	}
	function goCheckout() {
		GTM.checkoutProgress(1, store.getters['basket/items'], undefined, userStore.isOnline ? 'Store EU' : 'Store')
		window.location.pathname = 'checkout'
	}
	function removeAutoClosing() {
		var body = document.getElementsByTagName('body')[0]
		if (body.classList.contains('auto-closing')) {
			body.classList.remove('auto-closing')
		}
	}
	function qBuy(product) {
		store.dispatch('basket/addToBasket', {
			...product,
			url: product.url,
			quantity: 1,
			toggle: false,
		})
	}
	// Watchers
	// Lifecycle Hooks
	onMounted(() => {
		try {
			const fileContents = fs.readFileSync('_data/shop/basket.yml', 'utf8')
			sectionData.value = yaml.safeLoad(fileContents)
			emptyBasketData.value = sectionData.value['empty-basket']
		} catch (e) {
			console.log('error fething cms info 1', e)
		}
		try {
			const fileContents = fs.readFileSync('_data/free-order-delivery.yml', 'utf8')
			deliveryInfoBox.value = yaml.safeLoad(fileContents).toggle
		} catch (e) {
			console.log('error fething cms info 2', e)
		}
	})
  onBeforeMount(()=>{
    store.dispatch('shop/getBasketAddons')
  })
	// Expose (defineExpose)
</script>

<style lang="scss" scoped></style>

<style lang="scss">
	.basket-header {
		color: #1C4245;
		font-family: Apercu;
		font-size: 32px;
		font-style: normal;
		font-weight: 700;
		line-height: 32px; 
		text-transform: capitalize;
	}
	.basket-item-title {
		display: block;
		margin-right: 35px;
	}
	.basket-bin {
		float: right;
		position: static;
	}
	.right-0 {
		right: 0px;
	}
		.prod-image {
			min-height: 100px;
			width: 30%;
			margin-bottom: 0px !important;
		}
		.basket-quantities {
			font-size: 13px;
			@media (max-width: 575px) {
				font-size: 16px;
			}
			.basket-quantities-box {
				background: #ffffff;
				border: 3px solid #d9d9d9;
				border-radius: 5px;
				padding: 0px 5px;
				min-height: 30px;
				max-width: 133px;
				box-sizing: border-box;

				div > span.qty,
				div > p.qty {
					color: #212427 !important;
					text-align: center;
					font-family: 'Apercu';
					font-size: 14px;
					font-style: normal;
					font-weight: 700;
					line-height: 14px;
				}
				div > .qty-btn {
					background: #fff;
					border-radius: 2px;
					padding: 0px;
					img {
						width: 12px;
						height: 12px;
					}

					&.disable-qty-btn {
						opacity: 0.5;
						pointer-events: none;
					}
				}

				div[class*='col-'] {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.basket-prices {
			width: 100%;
			overflow: hidden;
			font-size: 0.6rem;
		}
		.image-dim {
			width: 100%;
			height: 100%;
			object-fit: cover;
			@media (max-width: 399px) { height: 150px !important; }
			@media (min-width: 400px){ height: 100% !important; }
		}
	#basket-flexi-items {
		margin-top: 28%;
		border: none !important;
		button {
			p {
				text-transform: none;
				font-size: 14px;
			}
			img {
				position: initial;
				width: 13px;
			}
			padding: 0;
		}
	}
	#order-summary-flexi-items {
		margin-top: 5%;
		margin-bottom: 5px;
		border: none !important;
		button {
			p {
				text-transform: none;
				font-size: 14px;
			}
			img {
				position: initial;
				width: 13px;
			}
			padding: 0;
		}
	}
</style>
