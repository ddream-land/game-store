import { Outlet, useNavigate, useParams, useRoutes } from 'react-router-dom'
import { DEFAULT_LANGUAGE } from './constant/env'
import languages from './constant/languages'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { changeLanguage } from 'i18next'
import i18n from 'i18next'
import { i18nInstance } from '@/i18n'

export default function App() {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  async function ensureLanguage() {
    const language = params.language
    if (!language || !languages.includes(language)) {
      let lang = DEFAULT_LANGUAGE
      await i18nInstance
      if (i18n.isInitialized) {
        const l = i18n.language
        if (languages.includes(l)) {
          lang = l
        }
      }
      navigate(`/${lang}`)
    } else {
      if (i18n.language !== language) {
        changeLanguage(language)
      }
    }
  }

  useEffect(
    function () {
      ;(async function () {
        await ensureLanguage()
      })()
    },
    [location]
  )

  return <>{<Outlet></Outlet>}</>
}
