<template>
    <div :id="'addon-card-' + index" :class="{ 'basket-addon-card row mx-0': true, [class_customization]: true, 'addon-card-open-modal': is_picking === true }">
    <div class="col-12 px-0 row mx-0 basket-addon-card-content">
      <div class="col-6 pl-0 pr-2">
        <div class="basket-addon-card-img-cnt p-relative">
          <div class="p-relative mx-auto" :style="{'width': show_thumbnail ? '120px' : '100%'}">
            <img :class="{'mx-auto': true, 'thumbnail-img': show_thumbnail, 'full-width-img': !show_thumbnail}" :src="getAddonImg()" :alt="addon.name" />
          </div>
          <div v-if="show_thumbnail" :class="{ 'coffee-label-img': addon_info.has_label_artwork || addon.product_type === 'pod' }" :style="[getCardBgImg()]"/>
        </div>
        <div
          :class="{ 'col-12 px-0 row mx-0 basket-addon-card-price-cnt': true, 'addon-without-original': !addon_info.basket_has_variant_on_offer }">
          <div :class="{
            'col-12 px-0 basket-addon-card-price mb-0': true,
            'on-sale': addon_info.basket_has_variant_on_offer,
          }">
            <span>
              <span class="basket-addon-card-price-variant-indicator p-0" v-if="addon_info.has_multiple_variants"> From </span>£{{
                parseFloat(addon_info.basket_addon_lowest_price).toFixed(2)
              }}
            </span>
          </div>
          <div v-if="addon_info.basket_has_variant_on_offer"
            class="col-12 px-0 basket-addon-card-original-price">
            <span>
              was (<span class="price-trace">£{{ parseFloat(addon_info.basket_addon_lowest_original_price).toFixed(2) }}</span>)
            </span>
          </div>
        </div>
      </div>
      <div class="col-6 pl-2 pr-0">
        <div class="row mx-0">
          <div class="col-12 px-0">
            <h5 class="basket-addon-card-name three-line-clamp">
              {{ addon.name }}
            </h5>
          </div>
          <div class="col-12 px-0">
            <p class="basket-addon-card-description four-line-clamp mb-0">
              {{ addon_info.basket_addon_card_description }}
            </p>
          </div>
          <div v-if="addon_info.available_addon_variants.length > 0 && !addon_info.addon_is_equipment" class="col-12 px-0">
            <p class="basket-addon-card-available-variant">
              {{ addon_info.available_addon_variants_text }}
            </p>
          </div>
          <div v-if="addon.product_type === 'bag' || addon.product_type === 'pod' || is_mixed_pods_fp " class="col-12 px-0">
            <div class="basket-addon-card-origin d-flex align-items-center">
              <img
                :src="is_mixed_pods_fp ? 'https://res.cloudinary.com/pactcoffee/image/upload/v1651654229/website-d2c/assets/uploadedCMS/2022/Navigation/navbar-icons/earth.svg' : addon_info.basket_addon_origin_flag"
                :class="{
                  'basket-addon-card-origin-flag': true,
                  'blend-height': addon.coffee.origin?.includes('Blend') || addon.coffee.origin_flag_image === null ,
                }"
                width="30"
                height="22"
                alt="origin flag icon"
              />
              <span class="one-line-clamp">{{ is_mixed_pods_fp ? 'Blend' : addon.coffee.origin }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 px-0">
        <button v-if="addon_info.addon_is_equipment || (addon.product_type === 'pod' && !addon_info.has_multiple_variants)"
          :class="{'btn btn-primary-secondary-txt letter-spacing-1 border-radius-5 sm full-width': true, disabled: is_incomplete }" type="button" @click="addToBasket">
          Add to basket
        </button>
        <button v-else
          class="btn btn-gray-bordered-1 letter-spacing-1 border-radius-5 sm full-width" type="button" @click="flipPicking">
          {{ addon_info.coffees_btn_text }}
        </button>
      </div>
    </div>
    <!-- Inner Modal -->
    <div v-if="is_picking" :id="'addon-ninja-backdrop-' + addon.sku" class="addon-card-modal">
      <div v-if="show_notification" class="addon-card-modal-notification">
        <span>
          {{ notification_message }}
        </span>
      </div>
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="row mx-0">
          <div class="col-12 px-0 t-center">
            <p class="addon-card-modal-prod-name one-line-clamp mb-4">{{ addon.name }}</p>
          </div>
          <div v-if="addon.product_type === 'bag'" class="col-12 px-0 t-left">
            <p class="addon-card-modal-dropdown-title m-sm">Choose your Brew Method</p>
            <addons-dropdown :elementId="'grind-' + index" :options="addon_info.dropdown_method_options" :selected="picked_method_id"
              :selectF="pickMethod" :firstIsPlaceholder="true">
              <template #text="{ selectedElement, isOpen }">
                <span v-html="selectedElement.text"></span>
                <img :class="{
                  'address-arrow': true,
                }" :style="{
                  transform: isOpen
                    ? 'translate(0, -50%) scaleY(-1)'
                    : 'translate(0, -50%) scaleY(1)',
                }" src="/assets/icons/primary/arrow_down.svg"
                alt="arrow" />
              </template>
              <template #optionText="{ option_text }">
                <span v-html="option_text"></span>
              </template>
            </addons-dropdown>
          </div>
          <div v-if="addon_info.has_multiple_variants" class="col-12 px-0 t-left m-top">
            <p class="addon-card-modal-dropdown-title m-sm">
              Choose your {{ addon.product_type === 'pod' ? 'Box' : 'Bag' }} Size
            </p>
            <addons-dropdown :elementId="'size-' + index" :options="addon_info.basket_dropdown_size_options" :selected="picked_variant_id"
              :selectF="pickVariant" :firstIsPlaceholder="true">
              <template #text="{ selectedElement, isOpen }">
                <span v-html="selectedElement.text"></span>
                <img :class="{
                  'address-arrow': true,
                }" :style="{
                  transform: isOpen
                    ? 'translate(0, -50%) scaleY(-1)'
                    : 'translate(0, -50%) scaleY(1)',
                }" src="/assets/icons/primary/arrow_down.svg"
                alt="arrow" />
              </template>
              <template #optionText="{ option_text }">
                <span class="t-bold" v-html="option_text"></span>
              </template>
            </addons-dropdown>
          </div>
          <div class="col-12 px-0 row mx-0 m-top">
            <div class="col-6 pl-0 pr-2">
              <button class="btn btn-primary-secondary-txt sm sm-txt full-width" @click="flipPicking()"
                style="background-color: #F5F5F5;color: #212427;">
                Cancel
              </button>
            </div>
            <div class="col-6 pl-2 pr-0">
              <button class="btn btn-primary-secondary-txt sm sm-txt full-width" @click="modalAddToBasket()">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, ref, defineAsyncComponent, onMounted, computed } from 'vue'
import { useCloudinaryHelpers } from '../../../utils/composables/cloudinaryHelpers'
import { useAddonInfoHelpers } from '../../../utils/addons/addonsInfoHelper'
const addonsDropdown = defineAsyncComponent(() => import('../../../utils/dropdown/quizDropdown.vue'))


// Props (defineProps)
const props = defineProps({
  addon: {
    type: Object,
    required: true,
  },
  addcart: {
    type: Function,
    required: true,
  },
})
// Emits (defineEmits)
// Reactive variables (inc composables)
const { addon } = toRefs(props)
const { optimizeImage } = useCloudinaryHelpers()

const is_picking = ref(false)
const picked_method = ref(undefined)
const picked_method_grind = ref(undefined)
const picked_method_id = ref(0)
const picked_variant = ref(undefined)
const picked_variant_id = ref(0)
const show_notification = ref(false)
const notification_message = ref('')

const addon_info = computed(() => {
  const {
    addon_product_type,
    addon_is_equipment,
    addon_is_limited_edition,
    has_multiple_variants,
    available_addon_variants,
    available_addon_variants_text,
    basket_addon_lowest_price,
    basket_addon_lowest_original_price,
    basket_has_variant_on_offer,
    basket_lowest_on_offer_variant,
    shown_image,
    has_label_artwork,
    label_artwork_img,
    basket_addon_card_description,
    basket_addon_origin_flag,
    coffees_btn_text,
    basket_dropdown_size_options,
    dropdown_method_options,
  } = useAddonInfoHelpers(addon.value)

  return {
    addon_product_type: addon_product_type.value,
    addon_is_equipment: addon_is_equipment.value,
    addon_is_limited_edition: addon_is_limited_edition.value,
    has_multiple_variants: has_multiple_variants.value,
    available_addon_variants: available_addon_variants.value,
    available_addon_variants_text: available_addon_variants_text.value,
    basket_addon_lowest_price: basket_addon_lowest_price.value,
    basket_addon_lowest_original_price: basket_addon_lowest_original_price.value,
    basket_has_variant_on_offer: basket_has_variant_on_offer.value,
    basket_lowest_on_offer_variant: basket_lowest_on_offer_variant.value,
    shown_image: shown_image.value,
    has_label_artwork: has_label_artwork.value,
    label_artwork_img: label_artwork_img.value,
    basket_addon_origin_flag: basket_addon_origin_flag.value,
    basket_addon_card_description: basket_addon_card_description.value,
    coffees_btn_text: coffees_btn_text.value,
    basket_dropdown_size_options: basket_dropdown_size_options.value,
    dropdown_method_options: dropdown_method_options.value,
  }
})
// Computed
const show_grind = computed(() => {
  return addon.value.product_type === 'bag'
})

const is_incomplete = computed(() => {
  return (show_grind.value && picked_method_grind.value === undefined) || (addon_info.value.has_multiple_variants && has_variant.value)
})
const is_mixed_pods_fp = computed(() => {
	return addon.value.sku === 'FP00000095'
})

const show_thumbnail = computed (() => {
  return !addon_info.value.addon_is_limited_edition && !addon_info.value.addon_is_equipment && addon.value.card_thumbnail_image !== null
})

const has_variant = computed(() => {
  return !(
    (picked_variant.value && // 👈 null and undefined check
      Object.keys(picked_variant.value).length === 0 &&
      Object.getPrototypeOf(picked_variant.value) === Object.prototype) ||
    picked_variant.value === undefined ||
    picked_variant.value === ''
  )
})
// Methods
function getAddonImg() {
  return optimizeImage(addon_info.value.shown_image)
}

function getCardBgImg(){
  return addon_info.value.has_label_artwork ? `background-image: url(${optimizeImage(addon_info.value.label_artwork_img)})` : 'background-color: #f5f5f5'
}

function pickMethod(method_id) {
  picked_method_id.value = method_id
  picked_method.value = addon_info.value.dropdown_method_options.find((method) => method.id === method_id)
  picked_method_grind.value = picked_method.value.value
}

function flipPicking() {
  is_picking.value = !is_picking.value
  if(!addon_info.value.has_multiple_variants && picked_variant.value === undefined) picked_variant.value = addon_info.value.available_addon_variants[0]
}

function pickVariant(variant_id) {
  picked_variant_id.value = variant_id
  var variant_sku = addon_info.value.basket_dropdown_size_options.find((variant) => variant.id === variant_id).value
  picked_variant.value = addon_info.value.available_addon_variants.find((variant) => variant.sku === variant_sku)
}

function addToBasket() {
  const element_to_add = { ...addon.value }
  // ITS A BAG
  if (show_grind.value) {
    element_to_add['grind_size'] = picked_method_grind.value
    element_to_add['brew_method'] = picked_method.value.brew_method_be
  }
  //  has multiple variant
  if (addon_info.value.has_multiple_variants) {
    element_to_add['variant'] = picked_variant.value
  }
  else element_to_add['variant'] = addon.value.variants[0]

  props.addcart(element_to_add)
  afterATC()
}

function hideNotification(){
  setTimeout(function() {
    show_notification.value = false
  }, 2000)
}

function modalAddToBasket() {
  var skip_grind = addon_info.value.addon_product_type === 'pod'
  if ((picked_method.value !== '' && picked_method.value !== undefined) || (picked_method.value === undefined && skip_grind)) {
    if (has_variant.value) {
      const element_to_add = { ...addon.value }
      // ITS A BAG
      if (show_grind.value) {
        element_to_add['grind_size'] = picked_method_grind.value
        element_to_add['brew_method'] = picked_method.value.brew_method_be
      }
      //  has multiple variant
      if (addon_info.value.has_multiple_variants) {
        element_to_add['variant'] = picked_variant.value
      }
      else element_to_add['variant'] = addon.value.variants[0]
      props.addcart(element_to_add)
      afterATC()
      flipPicking()
    } else {
      show_notification.value = true
      notification_message.value = 'Oops! Please select a ' + (addon_info.value.addon_product_type === 'bag' ? 'bag' : 'box') + ' size',
      hideNotification()
    }
  } else {
    show_notification.value = true
    notification_message.value = 'Oops! Please select a brew method' + (has_variant.value ? '' : ' and bag size'),
    hideNotification()
  }
}

function afterATC() {
  var basketDiv = document.getElementById('basket-cnt');
  basketDiv.scrollTop = 0;
  //RESET ON ATC
  picked_method.value = undefined;
  picked_method_grind.value = undefined;
  picked_variant.value = undefined;
  picked_method_id.value = 0
  picked_variant_id.value = 0
}
// Watchers
// Lifecycle Hooks
onMounted(() => {
  if (!addon_info.value.has_multiple_variants) {
    picked_variant.value = addon_info.value.available_addon_variants[0]
  }
})
// Expose (defineExpose)
</script>

<style lang="scss">
.basket-addon-card {
  position: relative;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    max-width: 360px;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  &-open-modal{
    @media (max-width: 767px) {
      min-height: 304px;
    }
  }

  &-content {
    // background-color: #f5f5f5;
    // padding: 15px;
    text-align: left;

    // @media (min-width: 768px) {
    //   padding: 20px;
    // }
  }

  &-header-dt {
    @media (min-width: 768px) {
      height: 66px;
    }
  }

  &-name {
    color: #212427;
    font-family: 'Apercu';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0px;
    margin-bottom: 10px;
    text-align: left;
    height: 66px;
  }

  &-description {
    color: #212427;
    /* pact-para-small */
    font-family: 'Apercu';
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 18px;
    letter-spacing: 0px !important;
    text-align: left;
  }


  &-available-variant {
    color: #212427;
    text-align: left;
    font-family: 'Apercu';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0px !important;
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: left;
  }

  &-origin {
    display: flex;
    align-items: normal;
    @media (min-width: 576px) {
      align-items: center;
    }
    &-flag {
      height: 20px;
      width: 27px;
      margin-right: 10px;
    }
    .blend-height{
      width: 15px !important;
      @media (min-width: 992px) {
        width: 22px !important;
      }
    }
    span {
      color: #212427;
      font-family: 'Apercu';
      font-size: 13px;
      font-style: normal;
      font-weight: 300;
      line-height: 18px;
      letter-spacing: 0px !important;
      margin-top: 2px;
    }
  }

  &-price-cnt {
    margin: 15px 0px 20px;

    @media (min-width: 768px) {
      &.addon-without-original {
        height: 64px;
        margin-bottom: 0px;
      }
    }
  }

  &-price {
    color: #212427;
    font-family: 'Apercu';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0px !important;
    text-align: center;

    &-variant-indicator{
      color: #212427;
      font-family: 'Apercu';
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: 16px;
      letter-spacing: 0px !important;
      text-align: center;
      position: relative;
      top: -5px;
    }

    &.pioneer {
      span {
        padding: 6px 6px 2px;
        background-color: #ffd699;
      }
    }

    &.on-sale {
      color: #d94822;
    }
  }

  &-original-price {
    color: #212427;
    font-family: 'Apercu';
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 16px;
    letter-spacing: 0px !important;
    text-align: center;
    margin-top: 5px;

    .price-trace {
      text-decoration: line-through #212427;
      -webkit-text-decoration: line-through #212427;
      -webkit-text-decoration-line: line-through #212427;
    }
  }

  &-img-cnt {
    height: 187px;
    position: relative;

    .full-width-img{
      width: 100%;
      height: 187px;
      object-fit: cover;
      &.img-xs-opts {
        @media (max-width: 576px) {
          height: 167px;
        }
      }
    }

    .thumbnail-img{
      width: 120px;
      object-fit: cover;
      z-index: 1;
      position: relative;
      left: 1px;
    }

    .coffee-label-img {
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 0px;
      height: 100px;
      width: 100%;
      position: absolute;
      bottom: 0px;
      // z-index: -1;
    }
  }

  .addon-card-modal {
    position: absolute;
    z-index: 3;
    background-color: rgba(0, 0, 0, 0.85);
    padding: 15px;
    width: 100%;
    height: 100%;
    border-radius: 8px;

    &-notification{
      width: 100%;
      position: absolute;
      background-color: #EB5757; //#c41d1d;
      top: 0px;
      left: 0px;
      padding: 10px;
      text-align: center;
      z-index: 1;
      font-size: 16px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: 0;
      color: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .addon-card-modal-prod-name{
      color: #FFF;
      font-family: 'Apercu';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 111.111% */
      letter-spacing: 0px;
    }

    .addon-card-modal-dropdown-title {
      color: #FFF;
      font-family: 'Apercu';
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0.12px;
      text-transform: uppercase;
    }

    .dropdown-parent {
      position: relative;
      border-radius: 5px;
      border: 2px solid #E5E5E5;
      background: #FFF;
      box-sizing: border-box;
      padding: 4px 15px;
      height: 40px;
      min-width: 220px;
    }

    .dropdown-selected {
      text-align: left;
      color: #1D4045;
      font-family: 'Apercu';
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: capitalize;
      // line-height: normal;
    }

    .address-arrow {
      position: absolute;
      right: 15px;
      top: 50%;
      width: 15px;
      max-width: 15px;
    }

    .wrap-dropdown-content {
      position: absolute;
      left: 0px;
      top: 43px;
      z-index: 30 !important;

      .dropdown-content {
        overflow-y: scroll;
        max-height: 66px;
      }

      .dropdown-content ul {
        margin: 0px;
      }

      .dropdown-content ul>li {
        text-align: left;
        color: #1D4045;
        padding: 10px 20px;
        text-decoration: none;
        display: block;
        font-size: 14px;
        letter-spacing: 0;
      }

      .dropdown-content ul>li:hover {
        font-family: 'Apercu-medium';
        cursor: pointer;
      }
    }
  }
}
</style>
