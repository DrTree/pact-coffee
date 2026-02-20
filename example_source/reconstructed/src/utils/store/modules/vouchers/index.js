import api from '../../../api'
import { checkResponse } from '../../error'
export const vouchers = {
	namespaced: true,
  state:{
    coffee_plan_months: undefined,
    cost_per_bag: undefined,
    gift_amount: undefined,
    gift_voucher_code: ''
  },
  getters:{
    coffee_plan_months(state) {
			return state.coffee_plan_months
		},
		cost_per_bag(state) {
			return state.cost_per_bag
		},
		gift_amount(state) {
			return state.gift_amount
		},
		gift_voucher_code(state) {
			return state.gift_voucher_code
		},
  },
  mutations:{
    updateGiftVoucherInfo(state, payload) {
      state.coffee_plan_months = payload.coffee_plan_months
      state.cost_per_bag = payload.cost_per_bag
      state.gift_amount = payload.gift_amount
      state.gift_voucher_code = payload.gift_voucher_code
    },
    resetGiftVoucherInfo(state) {
      state.coffee_plan_months = undefined
      state.cost_per_bag = undefined
      state.gift_amount = undefined
      state.gift_voucher_code = ''
    },
  },
	actions: {
		async getVoucherInfo(_, payload) {
			return api.vouchers.getVoucherInfo(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
		async validateVoucher(_, payload) {
			return api.vouchers.validateVoucher(payload).then((response) => {
				var result = checkResponse(response)
				if (payload.callback) payload.callback(result)
			})
		},
    async validateGiftVoucher({ commit }, payload) {
			return api.vouchers.validateVoucher(payload).then((response) => {
				var result = checkResponse(response)
        if(result.status === 'ok')
          commit('updateGiftVoucherInfo',
            {
              coffee_plan_months: response.data.gift.coffee_plan_months,
              cost_per_bag: response.data.gift.cost_per_bag,
              gift_amount: response.data.gift.gift_amount,
              gift_voucher_code: payload.code
            }
          )
				if (payload.callback) payload.callback(result)
			})
		},
    async resetGiftVoucherInfo({ commit }) {
			commit('resetGiftVoucherInfo')
		},
	},
}
