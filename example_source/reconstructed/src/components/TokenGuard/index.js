import cookieHandler from "../utils/cookies/cookieHandler"
import store from "../../utils/store"
import { createPinia, setActivePinia } from 'pinia'
import { useAuthUser } from '../../utils/stores/modules/authUser'

// Create and activate Pinia manually
const pinia = createPinia()
setActivePinia(pinia)


if(!cookieHandler.hasToken()){
  const userStore = useAuthUser()
  userStore.resetInfo()
  store.commit('user/resetInfo')
}
