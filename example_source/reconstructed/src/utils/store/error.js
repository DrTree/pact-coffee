export function checkResponse(response) {
	if (response && response.status <= 209 && response.status >= 200) {
		return { status: 'ok', data: response.data }
	}else if(response && response.status === 500){
    return { status: 'error', data: {message: 'There was a problem contacting our servers, please wait a few minutes and try again.'} }
  }
    return { status: 'error', data: response?.data, unauthorized: response?.status === 401 }
}
