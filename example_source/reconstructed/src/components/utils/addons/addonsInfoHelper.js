import { ref, computed } from 'vue'

export function useAddonInfoHelpers(addon) {


  const bags_methods = ref([
    {
      display: 'Wholebean',
      valueBE: 'wholebean',
      grind_size: 'wholebean',
    },
    {
      display: 'Cafetière',
      valueBE: 'cafetiere',
      grind_size: 'coarse',
    },
    {
      display: 'V60 (drip)',
      valueBE: 'v60',
      grind_size: 'medium',
    },
    {
      display: 'Chemex',
      valueBE: 'chemex',
      grind_size: 'medium',
    },
    {
      display: 'Stove-top',
      valueBE: 'stovetop',
      grind_size: 'medium_fine',
    },
    {
      display: 'AeroPress',
      valueBE: 'aeropress',
      grind_size: 'medium_fine',
    },
    {
      display: 'Espresso machines',
      valueBE: 'espresso_machine',
      grind_size: 'fine',
    }
  ])

  const addon_product_type = computed(() => {
    return addon.product_type
  })

  const addon_is_equipment = computed(() => {
    return addon.product_type !== 'bag' && addon.product_type !== 'pod'
  })

  const addon_is_limited_edition = computed (() => {
    return addon.limited_edition
  })

  const available_addon_variants = computed(() => {
    return addon.variants.sort((a, b) => {
			if (a.amount > b.amount) {
				return 1
			} else if (a.amount < b.amount) {
				return -1
			}
			return 0
		})
  })

  const is_recurrable_addon = computed (() => {
    return addon.variants[0].bag_plan_addon || addon.variants[0].pod_plan_addon
  })

  const has_multiple_variants = computed(() => {
    return available_addon_variants.value && available_addon_variants.value.length > 1
  })


  // addon card info
  const addon_lowest_price_variant = computed(() => {
    return available_addon_variants.value.reduce((a, b) => (variant_used_price(a) < variant_used_price(b) ? a : b), [])
  })

  const addon_lowest_price_type = computed(() => {
    return addon_lowest_price_variant.value.price_type
  })

  const addon_lowest_price = computed(() => {
    return addon_lowest_price_variant.value.price_type !== 'variant_price'
      ? addon_lowest_price_variant.value[addon_lowest_price_variant.value.price_type]
      : addon_lowest_price_variant.value.variant_price
  })

  const addon_lowest_original_price = computed(() => {
    return addon_lowest_price_variant.value.variant_price
  })

  const basket_addon_lowest_price_variant = computed(() => {
    return available_addon_variants.value.reduce((a, b) => (basket_variant_used_price(a) < basket_variant_used_price(b) ? a : b), [])
  })

  const basket_addon_lowest_price = computed(() => {
    return basket_addon_lowest_price_variant.value.on_offer
      ? basket_addon_lowest_price_variant.value.offer.offer_price
      : basket_addon_lowest_price_variant.value.price
  })

  const basket_addon_lowest_original_price = computed(() => {
    return basket_addon_lowest_price_variant.value.price
  })

  // promo
  const has_variant_on_offer = computed(() => {
    return available_addon_variants.value.filter((variant) => variant.price_type === 'offer_price').length > 0
  })

  const lowest_on_offer_variant = computed(() => {
    return has_variant_on_offer.value
      ? available_addon_variants.value.filter((variant) => variant.price_type === 'offer_price').reduce((a, b) => (variant_used_price(a) < variant_used_price(b) ? a : b), [])
      : undefined
  })

  const basket_has_variant_on_offer = computed(() => {
    return available_addon_variants.value.filter((variant) => variant.on_offer).length > 0
  })

  const basket_lowest_on_offer_variant = computed(() => {
    return has_variant_on_offer.value
      ? available_addon_variants.value.filter((variant) => variant.on_offer).reduce((a, b) => (basket_variant_used_price(a) < basket_variant_used_price(b) ? a : b), [])
      : undefined
  })

  // pioneer
  const has_variant_on_pioneer_plan = computed(() => {
    return available_addon_variants.value.filter((variant) => variant.price_type === 'pioneer_price').length > 0
  })

  const lowest_on_pioneer_plan_variant = computed(() => {
    return has_variant_on_offer.value
      ? available_addon_variants.value.filter((variant) => variant.price_type === 'pioneer_price').reduce((a, b) => (variant_used_price(a) < variant_used_price(b) ? a : b), [])
      : undefined
  })
  // end addon card info
  // addon card elements

  // const available_addon_variants_text = computed(() => {
  //   const final_text = 'Available in '
  //   var count = 0;
  //   available_addon_variants.value.map(x => {
  //     var comma = count < available_addon_variants.value.length - 2 ? ', ' : ''
  //     if (count === available_addon_variants.value.length - 1)
  //       final_text = final_text + ' or ' + x.amount_display
  //     else
  //       final_text = final_text + x.amount_display + comma
  //     count++
  //   })
  //   return final_text + ' bags'
  // })

  const available_addon_variants_text = computed(() => {
    let final_text = ''
    var count = 0;
    if(available_addon_variants.value.length >= 2)
      available_addon_variants.value.map(x => {
        var backslash = count < available_addon_variants.value.length - 2 ? ' / ' : ''
        if (count === available_addon_variants.value.length - 1)
          final_text = final_text + ' / ' + x.amount_display
        else
          final_text = final_text + x.amount_display + backslash
        count++
      })
    else final_text = addon.variants[0].amount_display
    return final_text
  })

  const shown_image = computed(() => {
    if (!addon_is_limited_edition.value && !addon_is_equipment.value && addon.card_thumbnail_image !== null) return addon.card_thumbnail_image
    else {
      return addon.primary_image
    }
  })

  const has_label_artwork = computed(() => {
    return (
      !addon_is_equipment.value &&
      addon.label_artwork_image &&
      addon.label_artwork_image !== null
    )
  })

  const label_artwork_img = computed(() => {
    return addon.label_artwork_image
  })

  const addon_card_description = computed(() => {
    if (addon_is_limited_edition.value || addon_is_equipment.value)
      return addon.card_summary
    else
      return addon.roast_profile + ' roast with hints of ' + addon.tasting_note
  })

  const basket_addon_card_description = computed(() => {
    if (addon_is_limited_edition.value || addon_is_equipment.value)
      return addon.card_summary
    else
      return addon.coffee.roast_profile + ' roast with hints of ' + addon.coffee.tasting_note
  })

  const addon_origin_flag = computed(() => {
		return addon.origin_flag_image === null
			? 'https://res.cloudinary.com/pactcoffee/image/upload/v1651654229/website-d2c/assets/uploadedCMS/2022/Navigation/navbar-icons/earth.svg'
			: addon.origin_flag_image
	})

  const basket_addon_origin_flag = computed(() => {
		return addon.coffee?.origin_flag_image === null
			? 'https://res.cloudinary.com/pactcoffee/image/upload/v1651654229/website-d2c/assets/uploadedCMS/2022/Navigation/navbar-icons/earth.svg'
			: addon.coffee?.origin_flag_image
	})

  const coffees_btn_text = computed(() => {
    if (addon.product_type === 'bag' && has_multiple_variants.value)
      return 'CHOOSE BREW METHOD & SIZE'
    else if (addon.product_type === 'bag' && !has_multiple_variants.value)
      return 'CHOOSE BREW METHOD'
    else return 'CHOOSE SIZE'
  })

  //dropdowns options

  const dropdown_size_options = computed(() => {
    const options = available_addon_variants.value.map((variant, index) => {
      //offer price
      var offer_price = '<span style="font-weight: 300; margin: 0 5px;">(<span style="text-decoration-line: line-through;"> £' + parseFloat(variant.variant_price).toFixed(2) + '</span>)</span>' +
        '<span style="color: #d94822;"> £' + parseFloat(variant[variant.price_type]).toFixed(2) + '</span>'

      //pionner price
      var pioneer_price = '<span style="font-weight: 300; margin: 0 5px;">(<span style="text-decoration-line: line-through;"> £' + parseFloat(variant.variant_price).toFixed(2) + '</span>) </span>' +
        '<span style="padding: 8px 8px 5px;background-color: #ffd699;"> £' + parseFloat(variant[variant.price_type]).toFixed(2) + '</span>'

      // price to show
      var price = variant.price_type === 'variant_price' || variant.price_type === 'plan_price' ?
        '<span> (£' + parseFloat(variant[variant.price_type]).toFixed(2) + ')</span>' : variant.price_type === 'offer_price' ? offer_price : pioneer_price

      return {
        id: index + 1,
        text: variant.amount_display + ' ' + price,
        value: variant.sku,
      }
    })
    options.push({ id: 0, text: '', value: undefined })
    return options
  })

  const basket_dropdown_size_options = computed(() => {
    const options = available_addon_variants.value.map((variant, index) => {
      //offer price
      var offer_price = '<span style="font-weight: 300; margin: 0 5px;">(<span style="text-decoration-line: line-through;"> £' + parseFloat(variant.price).toFixed(2) + '</span>)</span>' +
        '<span style="color: #d94822;"> £' + parseFloat(variant.offer?.offer_price).toFixed(2) + '</span>'

      // price to show
      var price = !variant.on_offer ?
        '<span> (£' + parseFloat(variant.price).toFixed(2) + ')</span>' : offer_price

      return {
        id: index + 1,
        text: variant.amount_display + ' ' + price,
        value: variant.sku,
      }
    })
    options.push({ id: 0, text: '', value: undefined })
    return options
  })

  const dropdown_method_options = computed(() => {
    const options = bags_methods.value.map((method, index) => {
      return {
        id: index + 1,
        text: method.display,
        brew_method_be: method.valueBE,
        value: method.grind_size,
      }
    })
    options.push({ id: 0, text: '', value: undefined })
    return options
  })

  const get_picked_method = computed(() => {
    return addon.picked_method
  })

  const get_picked_variant = computed(() => {
    return addon.picked_variant ? addon.picked_variant : available_addon_variants.value[0]
  })

  // Auxiliary Methods

  function variant_used_price(variant) {
    return parseFloat(variant[variant.price_type])
  }

  function basket_variant_used_price(variant) {
    var price_to_use = 0
    if(variant.on_offer)
      price_to_use = variant.offer.offer_price
    else price_to_use = variant.price
    return parseFloat(price_to_use)
  }

  // convert addons to BE basket function
  function convertBasketforBackend(items) {
    var skuList = []
    var y
    items.map(function (addon) {
      var addon_variant = addon.picked_variant ? addon.picked_variant : addon.variants[0]
      var addon_grind = addon.product_type === 'bag' ? addon.picked_method.value : null
      var addon_brew_method = addon.product_type === 'bag' ? addon.picked_method.brew_method_be : null
      if (addon.product_type === 'bag' || addon.product_type === 'pod') {
        if (addon_variant.quantity && addon_variant.quantity > 1) {
          var prod_quantity = addon_variant.quantity
          y = 0
          while (y < prod_quantity) {
            skuList.push({
              sku: addon_variant.sku,
              brew_method: addon_brew_method,
              grind_size: addon_grind,
              create_recurrable_addon: false
            })
            y++
          }
        } else {
          skuList.push({
            sku: addon_variant.sku,
            brew_method: addon_brew_method,
            grind_size: addon_grind,
            create_recurrable_addon: false
          })
        }
      } else {
        skuList.push({
          sku: addon_variant.sku,
          // frequency default 8
          frequency: addon?.recurrable_addon_frequency ? addon.recurrable_addon_frequency : null,
          create_recurrable_addon: addon?.recurrable_addon_frequency ? true : false
        })
      }
    })
    return skuList
  }

  function manageAddonAction(recurrable_id, addon_sku, router){
    router.push('/account/manage-subscription?recurrable_id='+recurrable_id+'&addon_sku='+addon_sku+'&manage_addon=true')
  }

  // expose managed state as return value
  return {
    addon_is_equipment,
    addon_is_limited_edition,
    is_recurrable_addon,
    addon_product_type,
    available_addon_variants,
    has_multiple_variants,
    available_addon_variants_text,

    //addon lowest price
    addon_lowest_price_variant,
    addon_lowest_price_type,
    addon_lowest_price,
    addon_lowest_original_price,

    //promo
    has_variant_on_offer,
    lowest_on_offer_variant,

    //pioneer
    has_variant_on_pioneer_plan,
    lowest_on_pioneer_plan_variant,

    // addon card elements
    shown_image,
    has_label_artwork,
    label_artwork_img,
    addon_card_description,
    addon_origin_flag,
    coffees_btn_text,

    //basket addon
    basket_addon_lowest_price,
    basket_addon_lowest_original_price,
    basket_has_variant_on_offer,
    basket_lowest_on_offer_variant,
    basket_addon_card_description,
    basket_addon_origin_flag,
    basket_dropdown_size_options,

    //dropdown options
    dropdown_size_options,
    dropdown_method_options,

    //card summary
    get_picked_method,
    get_picked_variant,


    convertBasketforBackend,
    manageAddonAction
  }
}
