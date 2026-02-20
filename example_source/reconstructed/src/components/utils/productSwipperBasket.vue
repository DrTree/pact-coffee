<template>
	<div v-if="products.length > 0" id="why-not-try" class="py-2">
		<h6 class="t-secondary m-xs baddons-maintitle">{{ title }}</h6>
      <hr class="hr-baddon mb-4">
      <div id="basket-addons-carousel" class="glide">
				<div class="glide__track mx-auto" data-glide-el="track">
					<ul class="glide__slides">
						<li
							class="glide__slide"
							v-for="prod in products_to_use"
							:key="prod.sku"
						>
              <div :class="{
                  'brew-it-with-carousel-products-card hand-pointer': true,
                }"
              >
                <BasketAddonElement :addon="prod" :addcart="addonToBasket"/>
              </div>
						</li>
					</ul>
				</div>
        <div class="col-12 px-0 d-flex justify-content-center">
          <div class="glide__arrows d-flex justify-content-center" data-glide-el="controls">
            <button class="glide__arrow section_glide__arrow-slider-left" data-glide-dir="<">
              <img
                src="assets/icons/secondary/pdp-img-dots-arrow-left.svg"
                alt="previous image"
                :class="{
                  'normal-arrow': true,
                }"
              />
            </button>
            <div class="glide__bullets d-flex align-items-center" data-glide-el="controls[nav]">
              <button
                v-for="(prod, index) in products_to_use"
                :key="index"
                :data-glide-dir="'='+index"
                :class="{
                  'glide__bullet': true,
                }"
              ></button>
            </div>
            <button class="glide__arrow section_glide__arrow-slider-right" data-glide-dir=">">
              <img
                src="assets/icons/secondary/pdp-img-dots-arrow-right.svg"
                alt="next image"
                :class="{
                  'normal-arrow': true,
                }"
              />
            </button>
          </div>
        </div>
			</div>
      <!-- <hr class="hr-baddon two"> -->
	</div>
</template>
<script setup>
import { computed, onMounted, toRefs, ref } from 'vue'
import BasketAddonElement from '../SharedShop/elements/BasketAddons/BasketAddonElement.vue'

const props = defineProps({
  products: { type: Array, required: true },
  title: { type: String, required: true, default: ''},
  addonToBasket: { type: Function, required: true },
})

const { products } = toRefs(props)
const glide_instance = ref(undefined)
const products_to_use = computed (() => {
  return products.value
})
const slider_options = computed(() => {
	return {
		type: 'carousel',
		gap: 5,
    perView: 1,
    focusAt: 'center',
	}
})
// Methods
function mountSliders() {
	if (products_to_use.value !== undefined) {
    glide_instance.value = new Glide('#basket-addons-carousel', slider_options.value)
    setTimeout(() => {
      glide_instance.value.mount()
    }, 750)
  }
}

onMounted(()=>{
  mountSliders()
})
</script>
<script>
export default {
	name: 'ProductSwipperBasket'
}
</script>
<style lang="scss">
.wrap-limit {
	height: 270px !important;
}
.baddons-maintitle{
  font-family: 'Apercu-Medium';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.hr-baddon{
  border-bottom: 1px solid #c4c4c4;
  &.two{
    margin-top: -20px;
  }
}
</style>
