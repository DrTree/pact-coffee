import { noAuthReq, noAuthReqGet, authReq } from './generalRequest'
import hmacSHA256 from 'crypto-js/hmac-sha256'

const DEFAULT_HOST = process.env.API_BASE ? process.env.API_BASE : 'http://127.0.0.1:4000'
const DEFAULT_VERSION = 'v3'

const v3BaseUrl = `${DEFAULT_HOST}/${DEFAULT_VERSION}`

function IdentitiesauthConfig(token) {
	return {
		headers: { Authorization: `Bearer ${token}` },
	}
}

const HMAC_SECRET = process.env.HMAC_KEY ? process.env.HMAC_KEY : 'potato'

function setupConfig(hmac256) {
	return {
		headers: { 'X-PactFrontend-Signature': hmac256 },
	}
}

export default {
	async resetPassword(payload) {
		return noAuthReq('/password-reset', 'post', payload)
	},
	async setNewPassword(payload) {
		return noAuthReq('/password-reset', 'patch', payload)
	},
	checkDeliveryDate(payload) {
		return noAuthReqGet('/calendar/d2c/next_shipping_date', 'get', { date: payload.date })
	},
	executeCommand(payload) {
		return noAuthReq('/commands', 'post', { payload: payload.payload })
	},
	/******************************
	 *          BREW IN A BOX      *
	 ******************************/
	claimBrewBox(payload) {
		return authReq('/campaigns/referrals', 'post', payload, IdentitiesauthConfig(payload.token))
	},
	validateBrewBox(payload) {
		return authReq('/campaigns/validate', 'post', payload, IdentitiesauthConfig(payload.token))
	},
	shareBrewBox(payload) {
		return authReq('/campaigns/emails', 'post', payload, IdentitiesauthConfig(payload.token))
	},
	/******************************
	 *          IDENTITIES        *
	 ******************************/
	submitIdentity(payload) {
		return noAuthReq('/identities', 'post', payload)
	},
	updateIdentity(payload) {
		return noAuthReq(`/identities/${payload.id}`, 'patch', payload)
	},
	claimAccount: function (payload) {
		return authReq('/users/claim_account', 'post', payload, IdentitiesauthConfig(payload.token))
	},
	claimIdentity: function (payload) {
		return authReq('/users/claim', 'post', payload, IdentitiesauthConfig(payload.token))
	},
	userSources: function () {
		return noAuthReqGet('/user_sources/d2c', 'get', {})
	},
	submitGiftOption: function (payload) {
		return authReq(`/users/me/orders/${payload.id}/gift`, 'patch', payload, IdentitiesauthConfig(payload.token), v3BaseUrl)
	},
	/******************************
	 *       UTILITIES            *
	 ******************************/
	pingViper: function () {
		return noAuthReqGet('/ping', 'get', {})
	},
	/******************************
	 *       SIGNUP PACKAGES      *
	 ******************************/
	getJumper: function (payload) {
		return noAuthReqGet(`/signup_packages/${payload.code}`, 'get', {})
	},
	/******************************
	 *       ALT PAY BASKET      *
	 ******************************/
	async checkBasketIntent(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/basket/intents', 'post', payload, setupConfig(hmac256))
	},
	async deleteBasketIntent(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify({}), HMAC_SECRET)
		return authReq(`/basket/intents/${payload.payment_intent_id}`, 'delete', {}, setupConfig(hmac256))
	},
  async expressCheckoutPurchase(payload){
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/users/d2c/store/express', 'post', payload, setupConfig(hmac256))

  },
  async expressCheckoutPlan(payload){
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/users/d2c/funnel/express', 'post', payload, setupConfig(hmac256))

  },
	/******************************
	 *       ALT PAY PLAN     *
	 ******************************/
	async checkPlanIntent(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/coffee_plans/intents', 'post', payload, setupConfig(hmac256))
	},
  async verifyBasket(payload){
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/basket/validate', 'post', payload, setupConfig(hmac256))
  },
  async getBasketConfirmation(payload){
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/express/success', 'post', payload, setupConfig(hmac256))
  },
	async checkGiftIntent(payload) {
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/gifts/intents', 'post', payload, setupConfig(hmac256))
	},
	async verifyGiftPurchase(payload){
		var date = Date.now()
		var timestamp = Math.floor(date / 1000).toString()

		var payload_hmac = Object.assign({}, payload)
		delete payload_hmac.callback

		var hmac256 = 't=' + timestamp + '.s=' + hmacSHA256(timestamp + '-' + JSON.stringify(payload_hmac), HMAC_SECRET)
		return authReq('/gifts/validate', 'post', payload, setupConfig(hmac256))
  },
}
