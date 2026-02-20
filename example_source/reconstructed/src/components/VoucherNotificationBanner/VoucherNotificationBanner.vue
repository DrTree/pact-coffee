<template>
	<Teleport to="#navbar">
    <div v-if="isActive && showPromo" id="voucher-banner" :class="{'voucher-notification-banner d-flex justify-content-center align-items-center': true, [message_type]: true}">
      <div class="banner-message" v-html="compileMD()">
      </div>
    </div>
	</Teleport>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch } from 'vue'
import { marked } from 'marked'
import { useMobileHelpers } from '../utils/composables/mobileHelpers.js'
import { useStoreVoucherHelper } from './composables/storeVoucherHelper.js'

// Props (defineProps)
const props = defineProps({
  voucher_origin : {
    type: String,
    required: false,
    default: 'plp_store'
  },
  run_validation:{
    type: Boolean,
    required: false,
    default: true
  }
})
// Emits (defineEmits)
// Reactive variables (inc composables)
const { voucher_origin, run_validation } = toRefs(props)
const { voucher, voucher_store, voucher_banner_active, isVoucherEmpty } = useStoreVoucherHelper(voucher_origin.value, run_validation.value)
const { isMobileSm } = useMobileHelpers()
const message_type = ref(undefined)

// Computed
const isInGifts = computed (()=>{
  return window.location.pathname.includes('/gifts')
})
const isInAccount = computed (()=>{
  return window.location.pathname.includes('/account') || window.location.pathname.includes('/reset-password') ||  window.location.pathname.includes('/login') || window.location.pathname.includes('/claim-account')
})
const isActive = computed (()=>{
  return voucher_banner_active.value && !isInAccount.value && !isInGifts.value
})
const showPromo = computed (()=>{
  // Restriction only in PLPs and PDPs with valid_for_store = true (d2c-2437)
  if(window.location.pathname !== "/" && !voucher_store.value?.voucher?.valid_for_store)
    return false
  else return true
})
const voucher_message = computed (()=>{
  var message = isVoucherEmpty.value ? getVoucherMessage(voucher_store.value.voucher) : getVoucherMessage(voucher.value)
  if(typeof message === 'object'){
    if(window.location.pathname.includes('/checkout'))
      message = message.checkout.replace('</strong>', '</strong> <br class="mobile-xs">')
    else
      message = message.pre_checkout.replace('</strong>', '</strong> <br class="mobile-xs">')
  }
  return message
})
// Methods
function compileMD() {
  return marked.parse(voucher_message.value)
}

function getVoucherMessage(voucher){
  if(voucher.green_banner){
    message_type.value = 'green'
    return voucher.green_banner
  }else{
    message_type.value = 'red'
    return voucher.red_banner_message
  }
}

function updateBannerHeight(){
  let sidewide_height_id = document.getElementById('sidewide-banner');
  let sidewide_mbl_height_id = document.getElementById('sitewide-banner-text-mobile');
  let voucher_banner_id = document.getElementById('voucher-banner');
  if(sidewide_height_id && voucher_banner_id) {
    var sidewide_height = sidewide_height_id.clientHeight
    var voucher_banner_height = voucher_banner_id.clientHeight
    if(sidewide_height !== 0 && voucher_banner_height !== 0) {
      if(sidewide_height >= voucher_banner_height)
        voucher_banner_id.style.height = sidewide_height+'px'
      else {
        sidewide_height_id.style.height = voucher_banner_height+'px'
        sidewide_mbl_height_id.style.height = voucher_banner_height+'px'
        sidewide_mbl_height_id.style.alignContent = 'center'
      }
    }
  }
}

function updateVoucherArea() {
  var hero = document.getElementById('hero-banner')
  var wrapper = document.getElementById('page-wrapper')
  var bannerText = document.getElementById('sitewide-banner-text-mobile') || document.getElementById('sitewide-banner-text-desktop')
  const currentUrl = window.location.href

  if (isActive.value && showPromo.value){
    if(hero && isMobileSm.value ){
      hero.classList.add('sitewide-adjust')

      var isVoucherBannerVisible = document.getElementById('voucher-banner')
      var isSitewideBanner = document.getElementById('sitewide-banner')
      if(isVoucherBannerVisible && !currentUrl.includes('/christmas/')) {
        hero.classList.add('mt-voucher')

        if(isSitewideBanner !== undefined && isSitewideBanner !== null){
          var siteWideTags = isSitewideBanner.getElementsByTagName("*")
          if(siteWideTags.length > 0)
            hero.classList.add('sitewide-active')
        }
      }
    }
    if(wrapper && bannerText === null){
      wrapper.classList.add('voucher-banner-adjust')
      // // To avoid having both class `sitewide-adjust` and `voucher-banner-adjust` from adding 2much space
      var targetDiv = wrapper.getElementsByClassName("sitewide-adjust")[0];
      if(targetDiv !== undefined && !currentUrl.includes('/christmas/'))
        hero.classList.remove('sitewide-adjust')
    }
  } else {
    if(currentUrl.includes('/christmas/')) {
      if(hero) hero.classList.remove('mt-voucher')
    }
    wrapper?.classList.remove('voucher-banner-adjust')
  }
}

// Watchers
watch(isActive, (newV) => {
  setTimeout(function () {
    updateVoucherArea()
    updateBannerHeight()
  }, 500)
})
// Lifecycle Hooks
onMounted(() => {
  setTimeout(function () {
    updateVoucherArea()
    updateBannerHeight()
  }, 500)
})
// Expose (defineExpose)
</script>
<script>
export default {
  name: 'VoucherNotificationBanner'
}
</script>
<style lang="scss">
#voucher-notification-banner,
#voucher-banner
{
  position: sticky;
  top: 60px;
  left: 0px;
  &.green{
    background-color: #CBEFE9;
  }

  &.red{
    background-color: #EB5757; //#c41d1d;
    &.voucher-notification-banner,
    .voucher-notification-banner
    {
      .banner-message{
        p{
          color: #ffffff;
          a{
            color: #ffffff;
            text-decoration: underline;

            &:hover{
              text-decoration: none;
            }
          }
        }
      }
    }
  }

  // z-index: 52

  @media (min-width: 576px) {
    top: 80px;
  }

  &.voucher-notification-banner,
  .voucher-notification-banner
  {
    padding: 0 20px;

    @media (max-width: 575px){
      min-height: 60px;
    }

    @media (min-width: 576px) {
      height: 46px;
    }

    .banner-message{
      text-align: center;
      padding: 3px 0px;

      p{
        color: #212427;
        font-family: 'Apercu';
        font-size: 14px;
        font-style: normal;
        font-weight: 300;
        line-height: 30px; /* 142.857% */
        letter-spacing: 0px;
        margin-bottom: 0px;

        @media (max-width: 767px){
          line-height: 20px;
        }
      }
    }
  }
}

</style>