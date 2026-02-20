
import { noAuthReq, noAuthReqGet } from './generalRequest'

export default {
	getVoucherInfo(payload) {
		return noAuthReqGet(`/vouchers/${payload.code}/info`, 'get', {})
	},
	validateVoucher(payload) {
		return noAuthReq(`/vouchers/${payload.code}/validate`, 'post', payload.body)
	},
  getStoreVoucherBanners(payload) {
		return noAuthReq(`/vouchers/${payload.code}/banners`, 'post', payload.body)
	},
}

