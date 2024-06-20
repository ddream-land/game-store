import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nHttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import languages from '@/constant/languages'

const i18nInstance = i18n
  .use(I18nHttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    preload: languages,
    detection: {
      order: [
        'cookie',
        'localStorage',
        'sessionStorage',
        'querystring',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  })

export { i18nInstance }
