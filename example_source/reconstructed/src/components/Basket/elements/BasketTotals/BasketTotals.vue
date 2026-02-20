<template>
	<div :class="{
    'basket-total row mb-0 mx-0': true,
		'pt-2': deliveryInfoBox
  }">
    <div class="col-12 py-0 row mx-0 px-0">
      <div class="col-12 px-0 mt-3">
        <div class="row mx-0">
          <div class="col-6 px-0 t-left">
            <span class="t-secondary discount t-uppercase"> SUBTOTAL</span>
          </div>
          <div class="col-6 px-0 row mx-0 t-right">
            <span class="col-12 px-0 t-secondary no-m discount"
              >£{{ parseFloat(basket_totals.subtotal - basket_totals.discount).toFixed(2) }}</span
            >
            <span
              v-if="show_discount || get_calc_product_promo(basket_items) > 0"
              class="col-12 px-0 t-right summary-row-subtext text-trace-stl"
              style="letter-spacing: 0px; height: 18px;"
            >
              was
              <span class="text-trace-stl price-trace neutral-black">
                £{{ 
                    get_calc_product_promo(basket_items) > 0 
                      ? parseFloat(basket_totals.subtotal + parseFloat(get_calc_product_promo(basket_items))).toFixed(2) 
                      : parseFloat(basket_totals.subtotal).toFixed(2) 
                 }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="col-12 px-0 d-flex justify-content-between align-items-start mt-3">
        <span class="t-secondary discount t-uppercase">Delivery</span>
        <span :class="{ 't-secondary no-m discount': true }">
          {{ free_delivery || deliveryInfoBox ? 'FREE' : '£' + parseFloat(delivery_charge_value).toFixed(2) }}
        </span>
      </div>
      <div class="col-12 px-0 d-flex justify-content-between align-items-start mt-3">
        <span class="t-secondary t-bold total t-uppercase">TOTAL</span>
        <span v-if="free_delivery || deliveryInfoBox" class="t-secondary no-m total-value"
          >£{{ parseFloat(basket_totals.total).toFixed(2) }}
        </span>
        <span v-else class="t-secondary no-m total-value">
          £{{ parseFloat(basket_totals.total + delivery_charge_value).toFixed(2) }}
        </span>
      </div>
    </div>
	</div>
</template>

<script setup>
	import { computed, toRefs } from 'vue'
	import { useBasketHelpers } from '../../composables/basketHelpers'
	// Props (defineProps)
	const props = defineProps({
		is_basket_sticky: {
			type: Boolean,
			required: false,
      default: false
		},
		deliveryInfoBox: {
			type: Boolean,
			required: false,
			default: false,
		},
	})
	// Emits (defineEmits)
	// Reactive variables (inc composables)
	const { is_basket_sticky } = toRefs(props)
	// Reactive variables (inc composables)
	const { basket_totals, basket_items, basket_voucher, free_delivery, delivery_charge_value } = useBasketHelpers()
	// Computed
	const show_discount = computed(() => {
		return basket_totals.value.discount > 0
	})
  // const voucher_has_hw = computed(() => {
  //   return basket_voucher.value.type === 'HardwareVoucher' || basket_voucher.value.type === 'PromoVoucher'
  // })
  // Methods
  function get_calc_product_promo(b_items) {
    const sum_price = 0.00
    for (let i = 0; i < b_items.length; i++) {
      const price = parseFloat(b_items[i].variant.price)
      const qtt = b_items[i].quantity
      sum_price += (price * qtt)
    }

    return parseFloat(sum_price - basket_totals.value.subtotal).toFixed(2)
  }
	// Watchers
	// Lifecycle Hooks
	// Expose (defineExpose)
</script>

<style lang="scss" scoped>
	.basket-total {

    &-pad{
      padding: 30px;

      @media (min-width: 0px) and (max-width: 420px) {
        padding: 15px;
      }

      @media (min-width: 992px) and (max-width: 1200px) {
        padding: 15px;
      }

    }

		span {
			font-family: 'Apercu';
			font-weight: 700;
		}
		.discount {
			font-size: 16px;
			line-height: 20px;
		}
		.discount-value {
			font-size: 16px;
			line-height: 16px;
			text-align: right;
		}
		.total {
			font-size: 20px;
			line-height: 20px;
		}
		.total-value {
			font-size: 36px;
			line-height: 36px;
			text-align: right;
			&.discounted {
				color: #32bea6;
			}
		}

    .text-trace-stl {
      color: #212427;
      font-family: 'Apercu' !important;
      font-size: 16px !important;
      font-style: normal !important;
      font-weight: 300 !important;
      line-height: 26px !important;
      letter-spacing: 0.12px !important;
    }
    .price-trace.neutral-black {
      text-decoration: line-through #212427;
      -webkit-text-decoration: line-through #212427;
      -webkit-text-decoration-line: line-through #212427;
    }
	}
</style>
