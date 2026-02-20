import axios from 'axios'
import users from './modules/users'
import gifts from './modules/gifts'
import shared from './modules/shared'
import products from './modules/products'
import vouchers from './modules/vouchers'
import { useAuthUser } from '../stores/modules/authUser'

const DEFAULT_HOST = process.env.API_BASE ? process.env.API_BASE : 'http://127.0.0.1:4000'
const DEFAULT_VERSION = process.env.API_VERSION ? process.env.API_VERSION : 'v2'

import store from '../store/index'
import cookieHandler from '../../components/utils/cookies/cookieHandler'

axios.defaults.baseURL = `${DEFAULT_HOST}/${DEFAULT_VERSION}`
// Add a response interceptor
axios.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response
	},
	function (error) {
    const userStore = useAuthUser()
		if (error.response?.status === 401) {
			console.log('Unauthorized')
			cookieHandler.deleteToken()
			userStore.resetInfo()
			userStore.setCsModeOff()
			if (window.location.pathname.startsWith('/account')) window.location = '/login'
		}
		if (!error.response) {
      //if no response ping Viper
			store.dispatch('shared/pingViper')
    }
		return Promise.reject(error)
	}
)

export default {
	users: users,
	gifts: gifts,
	shared,
	shop: products,
	vouchers: vouchers,
}
