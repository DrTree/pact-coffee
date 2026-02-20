import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { user } from './modules/user'
import { shop } from './modules/shop'
import { basket } from './modules/basket'

import { notifications } from './modules/notifications'

import { vouchers } from './modules/vouchers'
import { shared } from './modules/shared'

//encryption in Local Storage
// https://github.com/softvar/secure-ls
import SecureLS from 'secure-ls'
var ls = new SecureLS({ isCompression: false })

const store = createStore({
	modules: {
		user,
		shared,
		notifications,
		shop,
		basket,
		vouchers,
	},
	plugins: [
		createPersistedState({
			key: 'pact-data',
			/*rehydrated: function(store){
        console.log('water + fire',store)
      },*/
			storage: {
				getItem: (key) => ls.get(key),
				setItem: (key, value) => ls.set(key, value),
				removeItem: (key) => ls.remove(key),
			},
		}),
	],
})
/*
function haha(mutation,state){
  console.log('x')
  console.log(mutation,state)
}
store.subscribe(haha)
DEBUG */
export default store
