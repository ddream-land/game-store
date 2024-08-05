export const HTTP_BASEURL = import.meta.env.VITE_APP_API_BASEURL ?? ''

export const HTTP_TIMEOUT = Number(import.meta.env.VITE_APP_HTTP_TIMEOUT ?? 10000)

export const DEFAULT_LANGUAGE = import.meta.env.VITE_APP_DEFAULT_LANGUAGE ?? 'zh-CN'

export const DEFAULT_LOCK_PANEL =
  import.meta.env.VITE_APP_DEFAULT_LOCK_PANEL === 'true' ? true : false

export const DEFAULT_OPEN_TTS = import.meta.env.VITE_APP_DEFAULT_OPEN_TTS === 'false' ? false : true

export const DEFAULT_OPEN_LIVE2D =
  import.meta.env.VITE_APP_DEFAULT_LIVE2D_OPEN === 'false' ? false : true
export const DEFAULT_DEBUG_LIVE2D =
  import.meta.env.VITE_APP_DEFAULT_LIVE2D_DEBUGGER === 'true' ? true : false

export const KEEP_ROLE_PANEL_OPEN =
  import.meta.env.VITE_APP_KEEP_ROLE_PANEL_OPEN === 'true' ? true : false
