import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { DEFAULT_LANGUAGE } from './constant/env'
import languages from './constant/languages'
import { useEffect } from 'react'

export default function App() {
  const params = useParams()
  const navigate = useNavigate()

  useEffect(function () {
    const language = params.language
    if (!language || !languages.includes(language)) {
      navigate(`/${DEFAULT_LANGUAGE}`)
    }
  }, [])

  return <>{<Outlet></Outlet>}</>
}
