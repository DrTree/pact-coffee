import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import cookieHandler from '../../utils/cookies/cookieHandler.js'
// by convention, composable function names start with 'use'
export function useStoreVoucherHelper(voucher_origin = '', run_validation = true ) {
	// state encapsulated and managed by the composable
	const store = useStore()

  // check if there is a voucher code in vuex
  const voucher_store = computed(() => store.getters['basket/voucher_store'])
  const voucher_banner_active = computed(()=> store.getters['basket/storeHasVoucher'])
  const voucher_code = ref('')
  const voucher = ref({})

  const isVoucherEmpty = computed(() => {
    return (
      voucher.value && // 👈 null and undefined check
      Object.keys(voucher.value).length === 0 &&
      Object.getPrototypeOf(voucher.value) === Object.prototype
    )
  })

  function getVoucherStore() { return store.getters['basket/voucher_store'] }
  function getStoreVoucherCode() { return store.getters['basket/voucher_store_code'] }
  // function hasStoreVoucher(){ return store.getters['basket/storeHasVoucher'] }
  // function getStoreVoucherApplied(){ return store.getters['basket/voucher_store_applied'] }

  // Doesnt delete existing voucher if this one fails
	function getStoreVoucherBanners(payload) {
		store.dispatch('basket/getStoreVoucherBanners', payload)
	}

  // Doesnt delete existing voucher if this one fails, origin pact_store
	// function applyBasketVoucherSafe(payload) {
	// 	store.dispatch('basket/applyBasketVoucherSafe', payload)
	// }

	function resetStoreVoucherBanners() {
		store.dispatch('basket/resetStoreVoucherBanners')
	}

  function prepVoucherPayload(voucher_code){
    var payload = {
      code: voucher_code,
      body: {
        origin: voucher_origin,
      },
      callback: handleVoucherNotification,
    }
    return payload
  }

  // function applyStoreVoucher(){
  //   var has_store_voucher = hasStoreVoucher()
  //   var store_voucher_code = getStoreVoucherCode()
  //   if(has_store_voucher){
  //     // applyBasketVoucherSafe({code: store_voucher_code })
  //     saveBasketVoucherSafe({code: store_voucher_code })
  //   }
  // }

  function searchForVoucher(){
    var voucher_code_temp = undefined
    // check Urlparams and cache for a voucher
    var urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('voucher')) {
      voucher_code_temp = urlParams.get('voucher')
    } else if (cookieHandler.hasCookie('voucher-cache')) {
      var cached_voucher_code = cookieHandler.getCookie('voucher-cache')
      voucher_code_temp = cached_voucher_code
    }

    return voucher_code_temp
  }

  function checkSoftValidateVoucher() {
    voucher_code.value = searchForVoucher()
    // if voucher is present apply it
    if(voucher_code.value !== '' && voucher_code.value !== undefined){
      var payload = prepVoucherPayload(voucher_code.value)
      getStoreVoucherBanners(payload)
    }
  }

  function handleVoucherNotification(result) {
    if (result.status !== 'error') {
      //save the voucher code and cache it
      voucher.value = result.data.voucher
      voucher_code.value = result.notification_code
      voucher_banner_active.value = true
      // applyStoreVoucher()
      cookieHandler.setCookie('voucher-cache', voucher_code.value, '60h')
    } else {
      //throw BE error
      store.dispatch('notifications/showNotification', {
        type: 'error',
        message: result.data.message,
      })
      //check if we have a cached voucher
      if(cookieHandler.hasCookie('voucher-cache')){
        var cached_voucher_code = cookieHandler.getCookie('voucher-cache')
        //delete it if invalid
        if(cached_voucher_code === result.notification_code) {
          cookieHandler.deleteCookie('voucher-cache')
          resetStoreVoucherBanners()
        }else{
          //reapply if voucher in url is invalid and we have a cached voucher
          var payload = prepVoucherPayload(cached_voucher_code)
          getStoreVoucherBanners(payload)
        }
      }
    }
  }

  // function used on the pdp purchase picker to validate the purchase type subscribe

  function checkPurchasePickerSubscribe(type, sku){
    var voucher_store_code = getVoucherStore()
    var voucher_code = voucher_store_code !== undefined && voucher_store_code !== '' ? voucher_store_code.code : searchForVoucher()
    if(voucher_code !== undefined && voucher_code !== ''){
      var payload = {
        code: voucher_code,
        body: {
          origin: 'pdp_store',
        },
        callback: handlePurchasePickerResponse,
      }
      if(type === 'subscribe') payload.body.purchase_type = 'funnel'
      if(type === 'one-off') payload.body.basket = [{sku: sku }]

      getStoreVoucherBanners(payload)
    }
  }

  function handlePurchasePickerResponse(result){
    if (result.status === 'error') {
      //throw BE error
      store.dispatch('notifications/showNotification', {
        type: 'error',
        message: result.data.message,
      })
    }
  }

  onMounted(()=>{
    var isInGifts =  window.location.pathname.includes('/gifts')
    var isInAccount = window.location.pathname.includes('/account') || window.location.pathname.includes('/reset-password') ||  window.location.pathname.includes('/login') || window.location.pathname.includes('/claim-account')
    // check if voucher code in vuex is empty
    if(voucher_origin !== '' && run_validation && !isInGifts && !isInAccount){
      checkSoftValidateVoucher()
    }
  })
	// expose managed state as return value
	return {
    voucher,
    voucher_store,
    getVoucherStore,
    getStoreVoucherCode,
    voucher_banner_active,
    voucher_code,
    isVoucherEmpty,
    searchForVoucher,
    getStoreVoucherBanners,
    resetStoreVoucherBanners,
    checkPurchasePickerSubscribe,
    // saveStoreVoucher
	}
}
