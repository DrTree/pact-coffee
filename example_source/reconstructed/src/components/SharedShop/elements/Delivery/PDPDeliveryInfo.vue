<template>
	<div :class="{
		'row mx-0': true,
		'my-2': [classCustomization] == '' && !isInsidePurchasePicker,
		'mt-2': isInsidePurchasePicker,
		[classCustomization]: true
	}">
		<div
			v-if="isEnvDeliveryChargeZero"
			:class="{
				'col-12 delivery-info-free-delivery row mx-0': true,
				'bespoke': isBespoke
			}"
		>
      <div class="col-12 px-0 row mx-0 justify-content-center align-items-center">
        <div class="px-0 d-flex align-items-center justify-content-center">
					<img src="assets/icons/green/delivery_truck.svg" alt="free delivery icon" />
				</div>
        <div class="pl-2 d-flex align-items-center justify-content-start t-uppercase">
          <span :class="{ 'bespoke': isBespoke }">FREE Delivery Today</span>
        </div>
      </div>
		</div>
		<div v-if="isInsidePurchasePicker" class="col-12 delivery-info no-bg row mx-0 px-0 pb-0 pt-2">
			<div class="col-12 px-0 row mx-0 mx-auto" style="max-width: 475px;">
        <div class="col-3 px-0 d-flex align-items-center justify-content-center">
					<img src="assets/icons/fillable/truck.svg" class="truck-img" alt="free delivery icon" />
				</div>
        <div class="col-9 px-0 row mx-0 align-content-center">
          <div class="col-12 px-0 d-flex align-items-center justify-content-start">
						<span v-if="totalPrice >= 15" class="mb-0">Ships with FREE Next-Day Delivery with Royal Mail Tracked 24</span>
						<span v-else>FREE Next-Day Delivery Available with Royal Mail Tracked 24</span>
					</div>
          <div v-if="totalPrice < 15" class="col-12 px-0 d-flex align-items-center justify-content-start">
            <span class="sub">When you spend £15 or more</span>
          </div>
        </div>
      </div>
		</div>
		<div v-else-if="plan" class="col-12 delivery-info row mx-0 px-0">
      <div class="col-11 px-0 row mx-0" style="max-width: 425px;">
        <div class="col-3 px-0 d-flex align-items-center justify-content-center"><img src="assets/icons/white/delivery_box.svg" alt="free delivery icon" /></div>
        <div class="col-9 px-0 row mx-0">
          <div class="col-12 px-0 d-flex align-items-center justify-content-start"><span>FREE Delivery Available</span></div>
          <div class="col-12 px-0 d-flex align-items-center justify-content-start">
            <span class="sub">When you spend £15. Or with every order when you Subscribe & Save.</span>
          </div>
        </div>
      </div>
		</div>
		<div v-else class="col-12 delivery-info row mx-0 px-0">
      <div class="col-10 px-0 row mx-0" style="max-width: 271px;">
        <div class="col-3 px-0 d-flex align-items-center justify-content-center"><img src="assets/icons/white/delivery_box.svg" alt="free delivery icon" /></div>
        <div class="col-9 pl-0 row mx-0">
          <div class="col-12 px-0 d-flex align-items-center justify-content-start"><span>FREE Delivery Available</span></div>
          <div class="col-12 px-0 d-flex align-items-center justify-content-start"><span class="sub">When you spend £15 or more.</span></div>
        </div>
      </div>
		</div>
	</div>
</template>

<script setup>
	import { toRefs } from 'vue'
	// Props (defineProps)
	const props = defineProps({
		plan: { type: Boolean, required: false, default: false },
		isEnvDeliveryChargeZero: { type: Boolean, required: false, default: false },
		isBespoke: { type: Boolean, required: false, default: false },
		isInsidePurchasePicker: { type: Boolean, required: false, default: false },
		totalPrice: { type: Number, required: false, default: 0.00 },
		classCustomization: { type: String, required: false, default: '' }
	})
	// Emits (defineEmits)
	// Reactive variables (inc composables)
	const { plan } = toRefs(props)
	// Computed
	// Methods
	// Watchers
	// Lifecycle Hooks
	// Expose (defineExpose)
</script>

<style lang="scss" scoped>
	.delivery-info {
		background: #f3f3f3;
		padding: 15px 20px;
		&.no-bg { background-color: transparent; }
		img {
			width: 36px;
			height: 40px;
			&.truck-img { height: 32px; }
		}
		span {
			font-family: 'Apercu-medium';
			font-weight: 700;
			font-size: 14px;
			line-height: 18px;
			color: #212427;
      margin-bottom: 5px;
			&.sub {
				font-family: 'Apercu';
				font-style: normal;
				font-weight: 300;
				font-size: 13px;
				line-height: 18px;
        margin-bottom: 0;
			}
		}
	}

	.delivery-info-free-delivery {
		background: rgba(255, 173, 50, 0.25); 
		padding: 20px;
		&.bespoke {
			background: transparent; 
			padding: 0px 20px;
		}
		img {
			width: 25px;
			height: 18px;
		}
		span {
			color: #1D4045;
			font-family: 'Apercu';
			font-size: 16px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}

	.espresso-martini-kit {
		span { color: #fff; }
		img {
			filter: brightness(0) saturate(100%) invert(71%) sepia(16%) saturate(1007%) hue-rotate(2deg) brightness(96%) contrast(87%);
		}
	}
	.bespoke-12 {
		.bespoke {
			@media (max-width: 360px) {
				span { &.bespoke { width: 160px; } }
			}
			@media (min-width: 992px) and (max-width: 1199px) {
				span { &.bespoke { width: 160px; } }
			}
			@media (max-width: 1500px) {
				padding-left: 0px;
				.justify-content-center {
					justify-content: left !important;
				}
			}
    }
	}
</style>
