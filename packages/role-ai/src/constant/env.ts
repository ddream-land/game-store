export const HTTP_BASEURL = import.meta.env.VITE_APP_API_BASEURL ?? ''

export const HTTP_TIMEOUT = Number(import.meta.env.VITE_APP_HTTP_TIMEOUT ?? 10000)

export const DEFAULT_LANGUAGE = import.meta.env.VITE_APP_DEFAULT_LANGUAGE ?? 'en'

export const DEFAULT_LOCK_PANEL =
  import.meta.env.VITE_APP_DEFAULT_LOCK_PANEL === 'true' ? true : false

export const DEFAULT_OPEN_TTS = import.meta.env.VITE_APP_DEFAULT_OPEN_TTS === 'false' ? false : true

export const DEFAULT_OPEN_LIVE2D =
  import.meta.env.VITE_APP_DEFAULT_OPEN_LIVE2D === 'false' ? false : true
