import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nHttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const i18nInstance = i18n
  .use(I18nHttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-CN',
    debug: import.meta.env.DEV,
    preload: ['en', 'zh-CN'],
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
    // ns: ['common', 'roleAI'],
    // interpolation: {
    //   escapeValue: false,
    // },
  })

export { i18nInstance }
