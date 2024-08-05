import { HTTP_TIMEOUT } from '@/constant/env'
import { isObject } from '@/libs/isTypes'
import { Auth } from '@ddreamland/common'
import axios from 'axios'
import toast from 'react-hot-toast'
import store from '@/store'
import { logout } from '@/store/slices/userInfoSlice'
import { HTTP_BASEURL } from '@/constant/env'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

function getTimeout() {
  let timeout = Number(HTTP_TIMEOUT ?? 10000)
  if (!timeout) {
    timeout = 10000
  }
  return timeout
}

function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

const service = axios.create({
  baseURL: HTTP_BASEURL,
  timeout: getTimeout(),
})

service.interceptors.request.use(
  function (config) {
    // const isToken = (config.headers || {}).isToken === false
    // const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    // if (getToken() && !isToken) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken()
    // }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    config.url = config.url?.includes('?')
      ? `${config.url}&session=${Auth.session ?? ''}&uid=${Auth.uid ?? ''}`
      : `${config.url}?session=${Auth.session ?? ''}&uid=${Auth.uid ?? ''}`

    return config
  },
  function (error) {
    console.error(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  function (res) {
    const code = res.status
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res
    }

    // if (code === 401) {
    // } else if (code === 500) {
    // } else if (code === 601) {
    // } else if (code !== 200) {
    // } else {
    //   return Promise.resolve(res.data)
    // }

    if (code !== 200) {
      throw new Error(`Response error.`)
    }

    if (isObject(res.data) && 'code' in res.data) {
      const code = res.data.code
      if (code === 604) {
        store.dispatch(logout())
        // toast.error('Login timeout')
      }
    }

    return Promise.resolve(res.data)
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
