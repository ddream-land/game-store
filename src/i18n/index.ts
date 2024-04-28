import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nHttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(I18nHttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    // ns: ['common', 'roleAI'],
    // interpolation: {
    //   escapeValue: false,
    // },
  })

export default i18n
