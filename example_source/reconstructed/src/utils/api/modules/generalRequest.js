import axios from 'axios'

export function authReq(url, method, payload, authConfig, baseUrlOverride=undefined) {
	return axios({
		method: method,
		url: url,
		data: payload,
		headers: authConfig.headers,
    ...(baseUrlOverride && { baseURL: baseUrlOverride })
	})
		.then(function (response) {
			return response
		})
		.catch(function (error) {
			return error.response
		})
}
export function noAuthReq(url, method, payload, baseUrlOverride=undefined) {
	return axios({
		method: method,
		url: url,
		data: payload,
    ...(baseUrlOverride && { baseURL: baseUrlOverride })
	})
		.then(function (response) {
			return response
		})
		.catch(function (error) {
			return error.response
		})
}

export function authReqGet(url, method, params, authConfig, baseUrlOverride=undefined) {
	return axios({
		method: method,
		url: url,
		params: params,
		headers: authConfig.headers,
    ...(baseUrlOverride && { baseURL: baseUrlOverride })
	})
		.then(function (response) {
			return response
		})
		.catch(function (error) {
			return error.response
		})
}

export function noAuthReqGet(url, method, params, baseUrlOverride=undefined) {
	return axios({
		method: method,
		url: url,
		params: params,
    ...(baseUrlOverride && { baseURL: baseUrlOverride })
	})
		.then(function (response) {
			return response
		})
		.catch(function (error) {
			return error.response
		})
}
