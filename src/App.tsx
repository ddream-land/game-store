import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { DEFAULT_LANGUAGE } from './constant/env'
import languages from './constant/languages'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { changeLanguage } from 'i18next'

export default function App() {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  function ensureLanguage() {
    const language = params.language
    if (!language || !languages.includes(language)) {
      navigate(`/${DEFAULT_LANGUAGE}`)
    }
    changeLanguage(language)
  }

  useEffect(
    function () {
      ensureLanguage()
    },
    [location]
  )

  return <>{<Outlet></Outlet>}</>
}
