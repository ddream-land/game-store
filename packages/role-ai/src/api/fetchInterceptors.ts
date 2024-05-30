import fetchIntercept from 'fetch-intercept'

const unregister = fetchIntercept.register({
  request: function (url, config) {
    url = url?.includes('?')
      ? `${url}&session=fa320f34949b01d64c04b1559faa23b9b86e&uid=8497928`
      : `${url}?session=fa320f34949b01d64c04b1559faa23b9b86e&uid=8497928`
    return [url, config]
  },

  requestError: function (error) {
    return Promise.reject(error)
  },

  response: function (response) {
    return response
  },

  responseError: function (error) {
    return Promise.reject(error)
  },
})

export { unregister }
