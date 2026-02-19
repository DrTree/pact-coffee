import { noAuthReq, noAuthReqGet, authReq } from './generalRequest'
import hmacSHA256 from 'crypto-js/hmac-sha256'
const HMAC_SECRET = process.env.HMAC_KEY ? process.env.HMAC_KEY : 'potato'

function giftConfig(hmac256) {
	return {
		headers: { 'X-PactFrontend-Signature': hmac256 },
	}
}

export default {
	async purchaseGift(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/gifts', 'post', payload, giftConfig(hmac256))
	},
	async redeemGift(payload) {
		return noAuthReq('/users/d2c/gift', 'post', payload)
	},
	async redeemGiftInfo(payload) {
		return noAuthReqGet(`/gifts/${payload.code}`, 'get', {})
	},
	async expressCheckoutPurchaseGift(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/gifts/express', 'post', payload, giftConfig(hmac256))
	},
	async getPurchaseGiftPDF(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq(`/gifts/${payload.id}/pdf`, 'post', payload, giftConfig(hmac256))
	},
}
