import { VueCookieNext as VueCookie } from 'vue-cookie-next'

export default {
  hasToken: function () {
		return VueCookie.isCookieAvailable('token')
	},
	getToken: function () {
		return VueCookie.getCookie('token')
	},
	setToken: function (token) {
		VueCookie.setCookie('token', token, { expire: '1d' })
	},
	deleteToken: function () {
		VueCookie.removeCookie('token')
	},
	refreshToken: function () {
		const token = VueCookie.getCookie('token')
		VueCookie.setCookie('token', token, { expire: '1d' })
	},
	getCookie: function (name) {
		return VueCookie.getCookie(name)
	},
	setCookie: function (name, value, expiry) {
		VueCookie.setCookie(name, value, { expire: expiry })
	},
	deleteCookie: function (name) {
		VueCookie.removeCookie(name)
	},
	setCsToken: function (token) {
		VueCookie.setCookie('token', token, { expire: '5min' })
	},
  hasCookie: function (name) {
		return VueCookie.isCookieAvailable(name)
	},
}
