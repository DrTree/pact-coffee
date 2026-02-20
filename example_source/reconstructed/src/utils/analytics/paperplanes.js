var md5 = require('md5')

function acceptedMarketingCookies(){
  var cookies = decodeURIComponent(document.cookie)
  var result = cookies.match(new RegExp('CookieScriptConsent' + '=([^;]+)'));
  var cookieScriptConsent = result && (result = JSON.parse(result[1]));
  var consentStatus = null
  var acceptedTargeting = null
  if(cookieScriptConsent) {
    if(cookieScriptConsent.action){
      consentStatus = result.action === 'accept' ? true : false
    }
    if(cookieScriptConsent.categories){
      acceptedTargeting = cookieScriptConsent.categories.includes('targeting') ? true : false
    }
  }

  return consentStatus === null || consentStatus && acceptedTargeting
}

function productGetPrice(product) {
  if(product.category === 'espresso' || product.category === 'brewed' || product.category === 'pod') return product.price
  return product.variant.on_offer ? product.variant.offer.offer_price : product.variant.price
}

function ppExists() {
	if (window._paq && typeof window._paq === 'object')
    return true
  else {
    if(process.env.NODE_ENV === 'production' && acceptedMarketingCookies()){
      // paperplanes
      var _paq = window._paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function () {
        var u = "//paperplaneslive.com/Paperplanes/";
        _paq.push(['setTrackerUrl', u + 'js/tracker.php']);
        _paq.push(['setSiteId', '4106']);
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript'; g.async = true; g.async = true; g.src = u + 'js/tracker.php'; s.parentNode.insertBefore(g, s);
      })();
      let pp_is_live = new Promise(function(resolve) {
        setTimeout(function() {resolve(window._paq && typeof window._paq === 'object');}, 750);
      });
      return pp_is_live
    }
  }
}

export function cartUpdate(items, total) {
	addItems(items)
	trackCart(total)
}

export async function addItems(items) {
  var pp_exists = await ppExists()
	if (pp_exists) {
		items.forEach((item) => {
			window._paq.push([
				'addEcommerceItem',
				item.sku,
				item.name,
				item.category,
				productGetPrice(item),
				item.quantity,
			])
		})
	}
}

export async function trackCart(total) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['trackEcommerceCartUpdate', total])
		window._paq.push(['trackPageView'])
	}
}

function hashed(string) {
	return md5(string)
}

export async function setUserId(id) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setUserId', hashed(id)])
		window._paq.push(['trackPageView'])
	}
}

export async function existingUserIdentify(id,address,source) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setUserId', hashed(id)])
		window._paq.push(['setCustomVariable', 1, 'Firstname', address.firstName, 'visit'])
		window._paq.push(['setCustomVariable', 2, 'Surname', address.lastName, 'visit'])
		window._paq.push(['setCustomVariable', 3, 'Line1', address.address_line_1, 'visit'])
		window._paq.push(['setCustomVariable', 4, 'Line2', address.address_line_2, 'visit'])
		window._paq.push(['setCustomVariable', 5, 'City', address.city, 'visit'])
		window._paq.push(['setCustomVariable', 6, 'Postcode', address.postcode, 'visit'])
		window._paq.push(['setCustomVariable', 7, 'Checkout', source, 'visit'])
		window._paq.push(['trackPageView'])
	}
}

export async function discountCode(code) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['trackEvent', 'Ecommerce', 'DiscountCode', code])
		window._paq.push(['trackPageView'])
	}
}

export async function purchaseComplete(order_id, total, discount, email,source) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setUserId', hashed(email)])
		window._paq.push(['setCustomVariable', 7, 'Checkout', source, 'visit'])
		window._paq.push(['trackEcommerceOrder', order_id, total, total, 0, 0, discount])
		window._paq.push(['trackPageView'])
	}
}

export async function productView(item) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setEcommerceView', item.sku, item.name, item.category, item.price])
		window._paq.push(['trackPageView'])
	}
}

export async function sendAddress(address, email,source) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setCustomVariable', 1, 'Firstname', address.firstName, 'visit'])
		window._paq.push(['setCustomVariable', 2, 'Surname', address.lastName, 'visit'])
		window._paq.push(['setCustomVariable', 3, 'Line1', address.address_line_1, 'visit'])
		window._paq.push(['setCustomVariable', 4, 'Line2', address.address_line_2, 'visit'])
		window._paq.push(['setCustomVariable', 5, 'City', address.city, 'visit'])
		window._paq.push(['setCustomVariable', 6, 'Postcode', address.postcode, 'visit'])
		window._paq.push(['setCustomVariable', 7, 'Checkout', source, 'visit'])
		window._paq.push(['setUserId', hashed(email)])
		window._paq.push(['trackPageView'])
	}
}

export async function checkoutInfo(source) {
	var pp_exists = await ppExists()
	if (pp_exists) {
		window._paq.push(['setCustomVariable', 1, 'Checkout', source, 'page'])
	}
}

