function ddExists() {
	return window.dmPt && typeof window.dmPt === 'function'
}

/* ----------------------------------------------------------------------------------------------------
Identify the contact:
The code below needs to be executed on every single page, after the cart has been created. 
Failure to do so may result in contacts getting an abandoned cart email too early.
---------------------------------------------------------------------------------------------------- */
export function ddIdentify(email) {
	if (ddExists()){
    window.dmPt('identify', email)
  }
}

/* ----------------------------------------------------------------------------------------------------
Supplying your cart:
The code below needs to be executed on every single page, after the cart has been created.
Failure to do so may result in contacts getting an abandoned cart email too early.
---------------------------------------------------------------------------------------------------- */
export function cartInsight(cartId, cartPhase, revenue, items){
	if (ddExists()) {
		window.dmPt('cartInsight', {
			programID: 191437, // Get this from the Program Builder in dotmailer
			cartDelay: 25, // This is the time, in minutes, we wait before sending out the email
			cartID: cartId, // The ID of your shopping cart, this should be unique
			cartPhase: cartPhase, // Set to CUSTOMER_LOGIN on all pages and ORDER_COMPLETE on final page
			currency: 'GBP', // The currency that the prices are in (e.g. USD or GBP)
			subtotal: revenue, // The cart subtotal amount
			discountAmount: 0.0, // The amount discounted on the entire order
			shipping: 0.0, // The amount of tax included on the entire order
			taxAmount: 0, // The amount of tax included on the entire order
			grandTotal: revenue, // The final total of the order, including tax, discounts, etc, if known
			cartUrl: 'https://www.pactcoffee.com/checkout', // Your website must be able to provide a unique URL to a basket
			lineItems: items.map(function(elem) {
                return {
                  sku: elem.sku,
                  name: elem.name,
                  description: elem.desc,
                  category: elem.category,
                  unitPrice:elem.variant.price,
                  quantity: elem.quantity,
                  totalPrice: elem.quantity * elem.variant.price,
                  imageUrl: elem.primary_image,
                  productUrl: elem.url,
                }
              })
		})
	}
}
