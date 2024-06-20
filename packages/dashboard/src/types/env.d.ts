/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_HTTP_TIMEOUT: string
  readonly VITE_APP_API_BASEURL?: string
  readonly VITE_APP_DEFAULT_LANGUAGE?: string
  readonly VITE_APP_DEFAULT_LOCK_PANEL?: string
  readonly VITE_APP_DEFAULT_OPEN_TTS?: string
  readonly VITE_APP_DEFAULT_OPEN_LIVE2D?: string
}
