import store from '@/store'
import { logout } from '@/store/slices/userInfoSlice'
import { Auth } from '@ddreamland/common'
import fetchIntercept from 'fetch-intercept'
import toast from 'react-hot-toast'
import i18n from 'i18next'
import { setPowerExchangePayIsOpen } from '@/store/slices/uiSlice'

const unregister = fetchIntercept.register({
  request: function (url, config) {
    url = url?.includes('?')
      ? `${url}&session=${Auth.session}&uid=${Auth.uid}`
      : `${url}?session=${Auth.session}&uid=${Auth.uid}`
    return [url, config]
  },

  requestError: function (error) {
    return Promise.reject(error)
  },

  response: function (response) {
    if (response.status === 401) {
      store.dispatch(logout())
      // toast.error('Login timeout')
    }
    if (response.status === 422) {
      console.log('out of token')
      store.dispatch(setPowerExchangePayIsOpen(true))
      toast.error(i18n.t('outOfToken', { ns: 'roleAI' }))
    }

    return response
  },

  responseError: function (error) {
    return Promise.reject(error)
  },
})

export { unregister }
